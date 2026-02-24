package com.worldcup;

import java.util.Objects;

public class User {
    private Integer id;
    private String username;
    private String email;
    private String password_hash;

    public User() {
    }

    public User(Integer id, String username, String email, String password_hash) {
        this.id = id;
    }

    public Integer getId() {
        return id;
    }

    public String getUsername() {
        return username;
    }

    public String getEmail() {
        return email;
    }

    public String getPassword_hash() {
        return password_hash;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public void setPassword_hash(String password_hash) {
        this.password_hash = password_hash;
    }

    @Override
    public boolean equals(Object o) {
        if (o == null || getClass() != o.getClass()) return false;
        User user = (User) o;
        return Objects.equals(id, user.id) && Objects.equals(username, user.username) && Objects.equals(email, user.email) && Objects.equals(password_hash, user.password_hash);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, username, email, password_hash);
    }
}
