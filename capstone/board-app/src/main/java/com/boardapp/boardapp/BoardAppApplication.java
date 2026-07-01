package com.boardapp.boardapp;

import com.boardapp.boardapp.config.SecurityConfig;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Import;

@SpringBootApplication
@Import(SecurityConfig.class)
public class BoardAppApplication {

    public static void main(String[] args) {
        SpringApplication.run(BoardAppApplication.class, args);
    }

}
