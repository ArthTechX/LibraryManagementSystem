package com.habeebcycle.lms.service.userservice.controller;

import com.habeebcycle.lms.service.userservice.model.User;
import com.habeebcycle.lms.service.userservice.security.CurrentUser;
import com.habeebcycle.lms.service.userservice.security.UserPrincipal;
import com.habeebcycle.lms.service.userservice.service.UserService;
import com.habeebcycle.lms.service.userservice.util.exception.NotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;

    @Autowired
    public UserController(UserService userService) {
        this.userService = userService;
    }

    // Get current user profile
    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser(@CurrentUser UserPrincipal currentUser) {
        User user = userService.getUserById(currentUser.getId())
                .orElseThrow(() -> new NotFoundException("User", "id", currentUser.getId()));

        Map<String, Object> profile = new HashMap<>();
        profile.put("id", user.getId());
        profile.put("firstName", user.getFirstName());
        profile.put("lastName", user.getLastName());
        profile.put("username", user.getUsername());
        profile.put("email", user.getEmail());
        profile.put("roles", user.getRoles().stream()
                .map(role -> role.getName().name())
                .collect(Collectors.toList()));
        profile.put("createdAt", user.getCreatedAt());
        profile.put("updatedAt", user.getUpdatedAt());

        return ResponseEntity.ok(profile);
    }

    // Get all users (admin only)
    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<Map<String, Object>>> getAllUsers() {
        List<User> users = userService.getAllUsers();
        List<Map<String, Object>> result = users.stream().map(user -> {
            Map<String, Object> map = new HashMap<>();
            map.put("id", user.getId());
            map.put("firstName", user.getFirstName());
            map.put("lastName", user.getLastName());
            map.put("username", user.getUsername());
            map.put("email", user.getEmail());
            map.put("roles", user.getRoles().stream()
                    .map(role -> role.getName().name())
                    .collect(Collectors.toList()));
            map.put("createdAt", user.getCreatedAt());
            return map;
        }).collect(Collectors.toList());

        return ResponseEntity.ok(result);
    }

    // Check if username is available
    @GetMapping("/check/username/{username}")
    public ResponseEntity<Map<String, Boolean>> checkUsernameAvailability(@PathVariable String username) {
        Boolean isAvailable = !userService.userExistsByUsername(username);
        Map<String, Boolean> result = new HashMap<>();
        result.put("available", isAvailable);
        return ResponseEntity.ok(result);
    }

    // Check if email is available
    @GetMapping("/check/email/{email}")
    public ResponseEntity<Map<String, Boolean>> checkEmailAvailability(@PathVariable String email) {
        Boolean isAvailable = !userService.userExistsByEmail(email);
        Map<String, Boolean> result = new HashMap<>();
        result.put("available", isAvailable);
        return ResponseEntity.ok(result);
    }
}
