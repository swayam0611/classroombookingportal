package com.coep.booking;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import jakarta.servlet.http.HttpSession;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;

import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;






@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired private UserRepository userRepository;

    @GetMapping
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    @GetMapping("/{email}")
    public Optional<User> getUserByEmail(@PathVariable String email) {
        return userRepository.findByEmail(email);
    }
    
    @PostMapping
    public void createUser(@RequestBody User user) {
        User saved = userRepository.save(user);
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest, HttpSession session) {
        Optional<User> user = userRepository.findByEmail(loginRequest.getEmail());
        
        if (user.isPresent()) {
            if (user.get().getPassword().equals(loginRequest.getPassword())) {
                session.setAttribute("loggedInUser", user.get().getEmail());
                session.setAttribute("userRole", user.get().getRole());
                return ResponseEntity.ok("Login Sucess.");
            }
        }
        return ResponseEntity.status(401).body("Invalid User ID or Password");
    }

    @GetMapping("/login")
    public void logout(HttpSession session) {
        session.invalidate();
    }
    
    

    @DeleteMapping("/{id}")
    public void deleteUser(@PathVariable Long id) {
        userRepository.deleteById(id);
    }

}
