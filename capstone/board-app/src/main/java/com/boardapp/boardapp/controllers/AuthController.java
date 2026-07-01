package com.boardapp.boardapp.controllers;

import ch.qos.logback.core.net.SMTPAppenderBase;
import com.boardapp.boardapp.entities.User;
import com.boardapp.boardapp.repositories.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/auth")
@CrossOrigin(origins = "http://localhost:5173")
public class AuthController {
    private final UserRepository userRepository;
    private final BCryptPasswordEncoder passwordEncoder;

    public AuthController(UserRepository userRepository, BCryptPasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }
    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody Map<String, String> registrationData) {
        String email = registrationData.get("email");
        String rawPassword = registrationData.get("password");
        String role = registrationData.get("role");

        if (userRepository.findByEmail(email).isPresent()) {
            return ResponseEntity.badRequest().body(Map.of(
                    "success", false,
                    "message", "Email is already registered!"
            ));
        }

        User newUser = new User();
        newUser.setEmail(email);

        String encryptedPassword = passwordEncoder.encode(rawPassword);
        newUser.setPassword(encryptedPassword);
        newUser.setRole(role);
        userRepository.save(newUser);

        return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "User registered successfully!"
        ));
    }
    @PostMapping("/login")
    public ResponseEntity<?> loginUser(@RequestBody Map<String, String> loginData) {
        String email = loginData.get("email");
        String password = loginData.get("password");
        Optional<User> userOptional = userRepository.findByEmail(email);

        if (userOptional.isPresent()) {
            User user = userOptional.get();
            if (passwordEncoder.matches(password, user.getPassword())) {
                return ResponseEntity.ok(Map.of(
                        "success", true,
                        "message", "Login successful!",
                        "token", "dummy-jwt-token"
                ));
            }
        }
        else {
            return ResponseEntity.status(401).body(Map.of(
                    "success", false,
                    "message", "Invalid email or password"
            ));
        }
        return null;
    }
}


