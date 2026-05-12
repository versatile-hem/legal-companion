package com.suits.auth.service;

import com.suits.auth.entity.User;
import com.suits.auth.repository.UserRepository;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Collection;
import java.util.stream.Collectors;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    private final UserRepository userRepository;

    public CustomUserDetailsService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    @Transactional
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        User user = userRepository.findByEmailAndDeletedAtIsNull(email)
                .orElseThrow(() -> {
                    return new UsernameNotFoundException("User not found with email: " + email);
                });

        if (user.getStatus() == User.UserStatus.SUSPENDED) {
            throw new UsernameNotFoundException("User account has been suspended");
        }

        if (user.getStatus() == User.UserStatus.INACTIVE) {
            throw new UsernameNotFoundException("User account is inactive");
        }

        return new org.springframework.security.core.userdetails.User(
                user.getEmail(),
                user.getPasswordHash(),
                true, true, true, true,
                getAuthorities(user)
        );
    }

    private Collection<? extends GrantedAuthority> getAuthorities(User user) {
        return user.getRoles().stream()
                .flatMap(role -> role.getPermissions().stream()
                        .map(permission -> new SimpleGrantedAuthority(permission)))
                .collect(Collectors.toSet());
    }
}
