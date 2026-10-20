package com.boardapp.boardapp.controllers;

import com.boardapp.boardapp.dto.TenantRegistrationRequest;
import com.boardapp.boardapp.services.TenantService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/tenants")
public class TenantController {
    private final TenantService tenantService;


    public TenantController(TenantService tenantService) {
        this.tenantService = tenantService;
    }
    @PostMapping("/register")
    public ResponseEntity<?> createTenant(
            @RequestBody TenantRegistrationRequest tenantRegistrationRequest){
        return tenantService.registerTenant(tenantRegistrationRequest);
    }
}
