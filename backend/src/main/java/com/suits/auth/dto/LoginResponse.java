package com.suits.auth.dto;


public class LoginResponse {
    private String token;
    private String refreshToken;
    private UserDto user;

    public LoginResponse() {}
    
    public LoginResponse(String token, String refreshToken, UserDto user) {
        this.token = token;
        this.refreshToken = refreshToken;
        this.user = user;
    }

    public String getToken() { return token; }
    public void setToken(String token) { this.token = token; }
    
    public String getRefreshToken() { return refreshToken; }
    public void setRefreshToken(String refreshToken) { this.refreshToken = refreshToken; }
    
    public UserDto getUser() { return user; }
    public void setUser(UserDto user) { this.user = user; }

    public static class UserDto {
        private String id;
        private String email;
        private String firstName;
        private String lastName;
        private String fullName;
        private String role;

        public UserDto() {}
        
        public UserDto(String id, String email, String firstName, String lastName, String fullName, String role) {
            this.id = id;
            this.email = email;
            this.firstName = firstName;
            this.lastName = lastName;
            this.fullName = fullName;
            this.role = role;
        }

        public String getId() { return id; }
        public void setId(String id) { this.id = id; }
        
        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }
        
        public String getFirstName() { return firstName; }
        public void setFirstName(String firstName) { this.firstName = firstName; }
        
        public String getLastName() { return lastName; }
        public void setLastName(String lastName) { this.lastName = lastName; }
        
        public String getFullName() { return fullName; }
        public void setFullName(String fullName) { this.fullName = fullName; }
        
        public String getRole() { return role; }
        public void setRole(String role) { this.role = role; }
    }
}
