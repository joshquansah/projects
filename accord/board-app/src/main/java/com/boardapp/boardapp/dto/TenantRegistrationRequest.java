package com.boardapp.boardapp.dto;

public record TenantRegistrationRequest(
        String companyName,
        String name,
        String email,
        String password
) {}