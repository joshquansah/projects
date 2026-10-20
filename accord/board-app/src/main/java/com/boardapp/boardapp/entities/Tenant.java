package com.boardapp.boardapp.entities;

import com.boardapp.boardapp.enums.TenantStatus;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.UUID;

@Entity
@Table(name = "tenants")
public class Tenant {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false)
    private String companyName;

    @Column(nullable = false, unique = true)
    private String subdomain;

    @Enumerated(EnumType.STRING)
    private TenantStatus status = TenantStatus.ACTIVE;

    private boolean isDemo = false;

    private LocalDateTime createdAt;


    @OneToMany(mappedBy = "tenant", cascade = CascadeType.ALL)
    @JsonIgnore
    private List<User> users = new ArrayList<>();

    @OneToMany(mappedBy = "tenant", cascade = CascadeType.ALL)
    @JsonIgnore
    private List<Team> teams = new ArrayList<>();

    @OneToMany(mappedBy = "tenant", cascade = CascadeType.ALL)
    @JsonIgnore
    private List<Project> projects = new ArrayList<>();

    public Tenant() {
    }

    public Tenant(UUID id, String companyName, String subdomain, TenantStatus status, boolean isDemo, LocalDateTime createdAt, List<User> users, List<Team> teams, List<Project> projects) {
        this.id = id;
        this.companyName = companyName;
        this.subdomain = subdomain;
        this.status = status;
        this.isDemo = isDemo;
        this.createdAt = createdAt;

        this.users = users;
        this.teams = teams;
        this.projects = projects;
    }

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public String getCompanyName() {
        return companyName;
    }

    public void setCompanyName(String companyName) {
        this.companyName = companyName;
    }

    public String getSubdomain() {
        return subdomain;
    }

    public void setSubdomain(String subdomain) {
        this.subdomain = subdomain;
    }

    public TenantStatus getStatus() {
        return status;
    }

    public void setStatus(TenantStatus status) {
        this.status = status;
    }

    public boolean isDemo() {
        return isDemo;
    }

    public void setDemo(boolean demo) {
        isDemo = demo;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }


    public List<User> getUsers() {
        return users;
    }

    public void setUsers(List<User> users) {
        this.users = users;
    }

    public List<Team> getTeams() {
        return teams;
    }

    public void setTeams(List<Team> teams) {
        this.teams = teams;
    }

    public List<Project> getProjects() {
        return projects;
    }

    public void setProjects(List<Project> projects) {
        this.projects = projects;
    }

    @Override
    public boolean equals(Object o) {
        if (o == null || getClass() != o.getClass()) return false;
        Tenant tenant = (Tenant) o;
        return isDemo == tenant.isDemo && Objects.equals(id, tenant.id) && Objects.equals(companyName, tenant.companyName) && Objects.equals(subdomain, tenant.subdomain) && status == tenant.status && Objects.equals(createdAt, tenant.createdAt) && Objects.equals(users, tenant.users) && Objects.equals(teams, tenant.teams) && Objects.equals(projects, tenant.projects);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, companyName, subdomain, status, isDemo, createdAt, users, teams, projects);
    }
}