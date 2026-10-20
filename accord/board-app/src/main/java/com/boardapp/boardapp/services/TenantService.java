package com.boardapp.boardapp.services;

import com.boardapp.boardapp.dto.TenantRegistrationRequest;
import com.boardapp.boardapp.entities.Team;
import com.boardapp.boardapp.entities.Tenant;
import com.boardapp.boardapp.entities.User;
import com.boardapp.boardapp.enums.Role;
import com.boardapp.boardapp.repositories.TenantRepository;
import com.boardapp.boardapp.repositories.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RequestBody;

import java.util.Map;
import java.util.UUID;

@Service
public class TenantService {
    private final TenantRepository tenantRepository;
    private final UserRepository userRepository;
    private final BCryptPasswordEncoder passwordEncoder;
    public TenantService(TenantRepository tenantRepository, UserRepository userRepository, BCryptPasswordEncoder passwordEncoder) {
        this.tenantRepository = tenantRepository;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public ResponseEntity<?> registerTenant(@RequestBody TenantRegistrationRequest tenantRegistrationRequest) {
        String companyName = tenantRegistrationRequest.companyName();
        String adminName = tenantRegistrationRequest.name();
        String adminEmail = tenantRegistrationRequest.email();
        String rawPassword = tenantRegistrationRequest.password();
        String subdomain = companyName.toLowerCase()
                .replaceAll("[^a-z0-9]", "")
                .trim();
        if (userRepository.findByEmail(adminEmail).isPresent()) {
            return ResponseEntity.badRequest().body(Map.of(
                    "success", false,
                    "message", "Email is already registered!"
            ));
        }
        Tenant newTenant = new Tenant();

        Role role = Role.ROLE_EXECUTIVE;
        User newAdmin = new User();
        newAdmin.setUsername(adminName);
        newAdmin.setEmail(adminEmail);

        String encryptedPassword = passwordEncoder.encode(rawPassword);
        newAdmin.setPassword(encryptedPassword);
        newAdmin.setRole(role);

        newTenant.setCompanyName(companyName);
        newTenant.setSubdomain(subdomain);
        newTenant = tenantRepository.save(newTenant);
        newAdmin.setTenant(newTenant);
        userRepository.save(newAdmin);


        return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "Tenant registered successfully!"
        ));
    }
}
