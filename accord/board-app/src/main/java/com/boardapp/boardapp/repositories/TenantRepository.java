package com.boardapp.boardapp.repositories;

import com.boardapp.boardapp.entities.Tenant;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface TenantRepository extends JpaRepository<Tenant, UUID> {

}
