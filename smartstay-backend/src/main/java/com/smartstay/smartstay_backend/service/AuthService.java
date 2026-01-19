package com.smartstay.smartstay_backend.service;

import com.smartstay.smartstay_backend.dto.AuthResponse;
import com.smartstay.smartstay_backend.dto.LoginRequest;
import com.smartstay.smartstay_backend.dto.RegisterRequest;
import com.smartstay.smartstay_backend.enums.Role;
import com.smartstay.smartstay_backend.model.User;
import com.smartstay.smartstay_backend.repository.UserRepository;
import com.smartstay.smartstay_backend.security.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;

    //  User Registration
    public String register(RegisterRequest request) {

        String email = request.getEmail().toLowerCase();

        if (userRepository.findByEmail(email).isPresent()) {
            return "Email already registered!";
        }

        User user = new User();
        user.setName(request.getName());
        user.setEmail(email);
        user.setPhone(request.getPhone());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole(Role.USER);
        user.setCreatedAt(LocalDateTime.now());

        userRepository.save(user);
        return "User Registered Successfully!";
    }

    //  User Login
    public AuthResponse login(LoginRequest request, JwtService jwtService) {

        String email = request.getEmail().toLowerCase();

        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        email,
                        request.getPassword()
                )
        );

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        String jwt = jwtService.generateToken(user.getEmail(), user.getRole().name());
        return new AuthResponse(jwt);

    }
}


