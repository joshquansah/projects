package com.worldcup;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("users")
public class UserController {
    @GetMapping
    public List<User> getUsers(){
        return List.of(
                new User(1, "hi", "joe", "po"),
                new User(2, "o", "k", "k")
        );
    }

}
