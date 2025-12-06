package org.sdia.oauth2openidconnectaveckeycloak.contrller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

import java.util.*;
import java.util.concurrent.CopyOnWriteArrayList;
@RestController
public class CourseController {

    @GetMapping("/courses")
    public List<String> getCourses(@AuthenticationPrincipal Jwt jwt) {
        return List.of("Math", "Physique", "Informatique");
    }

    @PostMapping("/courses")
    @PreAuthorize("hasRole('ADMIN')")
    public String addCourse(@RequestParam String name) {
        return "Cours ajouté: " + name;
    }

    @GetMapping("/me")
    public Map<String, Object> getMe(@AuthenticationPrincipal Jwt jwt) {
        return jwt.getClaims();
    }
}
