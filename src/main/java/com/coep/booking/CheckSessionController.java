package com.coep.booking;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import jakarta.servlet.http.HttpSession;

import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;


@RestController
@RequestMapping("/api/check-session")
public class CheckSessionController {
    
    @GetMapping
    public ResponseEntity<?> checkSession(HttpSession session) {
        if ((String)session.getAttribute("loggedInUser") != null) {
            String email = (String) session.getAttribute("loggedInUser");
            return ResponseEntity.ok(email);
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
    }
    
}
