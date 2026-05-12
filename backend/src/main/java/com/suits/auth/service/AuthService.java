package com.suits.auth.service;

import com.suits.auth.dto.LoginRequest;
import com.suits.auth.dto.LoginResponse;
import com.suits.auth.dto.SignupRequest;
import com.suits.auth.entity.Role;
import com.suits.auth.entity.User;
import com.suits.auth.repository.RoleRepository;
import com.suits.auth.repository.UserRepository;
import com.suits.auth.security.JwtTokenProvider;
import com.suits.common.exception.ResourceNotFoundException;
import com.suits.common.exception.UnauthorizedException;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;
import java.util.Set;

@Service
@Transactional
public class AuthService {

    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final JwtTokenProvider jwtTokenProvider;
    private final PasswordEncoder passwordEncoder;

    public AuthService(AuthenticationManager authenticationManager, UserRepository userRepository,
                      RoleRepository roleRepository, JwtTokenProvider jwtTokenProvider,
                      PasswordEncoder passwordEncoder) {
        this.authenticationManager = authenticationManager;
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.jwtTokenProvider = jwtTokenProvider;
        this.passwordEncoder = passwordEncoder;
    }

    public LoginResponse login(LoginRequest request) {

        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getPassword()
                )
        );

        User user = userRepository.findByEmailAndDeletedAtIsNull(request.getEmail())
                .orElseThrow(() -> new ResourceNotFoundException("User", "email", request.getEmail()));

        String token = jwtTokenProvider.generateToken(authentication);
        String refreshToken = jwtTokenProvider.generateRefreshToken(user.getEmail());

        LoginResponse.UserDto userDto = new LoginResponse.UserDto(
                user.getId().toString(),
                user.getEmail(),
                user.getFirstName(),
                user.getLastName(),
                user.getFullName(),
                user.getRole() != null ? user.getRole().toString() : null
        );

        return new LoginResponse(token, refreshToken, userDto);
    }

    public LoginResponse signup(SignupRequest request) {

        if (userRepository.existsByEmail(request.getEmail())) {
            throw new UnauthorizedException("Email is already registered");
        }

        User user = new User();
        user.setEmail(request.getEmail());
        user.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());
        user.setPhone(request.getPhone());
        user.setStatus(User.UserStatus.ACTIVE);
        user.setRole(User.UserRole.VIEWER);

        // Assign default role
        Role viewerRole = roleRepository.findByName("VIEWER")
                .orElseThrow(() -> new ResourceNotFoundException("Role", "name", "VIEWER"));
        user.setRoles(new HashSet<>(Set.of(viewerRole)));

        User savedUser = userRepository.save(user);

        // Generate tokens - create empty authorities for now
        Authentication authentication = new UsernamePasswordAuthenticationToken(
                savedUser.getEmail(), null, java.util.Collections.emptyList()
        );

        String token = jwtTokenProvider.generateToken(authentication);
        String refreshToken = jwtTokenProvider.generateRefreshToken(savedUser.getEmail());

        LoginResponse.UserDto userDto = new LoginResponse.UserDto(
                savedUser.getId().toString(),
                savedUser.getEmail(),
                savedUser.getFirstName(),
                savedUser.getLastName(),
                savedUser.getFullName(),
                savedUser.getRole().toString()
        );

        return new LoginResponse(token, refreshToken, userDto);
    }

    public User getUserByEmail(String email) {
        return userRepository.findByEmailAndDeletedAtIsNull(email)
                .orElseThrow(() -> new ResourceNotFoundException("User", "email", email));
    }
}
