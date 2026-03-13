package com.worldcup.controllers;

import com.worldcup.entities.User;
import com.worldcup.repositories.UserRepository;
import com.worldcup.services.UserService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("users")
public class UserController {
    private final UserService userService;
    private final UserRepository userRepository;

    public UserController(UserService userService, UserRepository userRepository) {
        this.userService = userService;
        this.userRepository = userRepository;
    }

    @GetMapping
    public List<User> getUsers(){
        return userService.getAllUsers();

    }
    @PostMapping
    public void addNewUser(
            @RequestBody User user
    ){
        userService.insertUser(user);

    }

}
