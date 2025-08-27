package roomy.controller;

import lombok.RequiredArgsConstructor;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import roomy.dto.ProfileDto;
import roomy.entities.User;
import roomy.repositories.ProfileRepository;
import roomy.services.EmailService;
import roomy.services.ProfileService;


import roomy.services.UserService;

import java.io.IOException;

@Controller
@RequiredArgsConstructor
@RequestMapping("/profile")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class ProfileController {

    private final ProfileService profileService;
    private final UserService userService;
    private final EmailService emailService;
    private final ProfileRepository profileRepository;



    @PostMapping("/upload-image")
    public ResponseEntity<ProfileDto> uploadProfileImage(
            @RequestParam("image") MultipartFile file,
            @AuthenticationPrincipal User currentUser) {  // Get logged-in user directly

        try {
            ProfileDto updatedProfile = profileService.uploadProfileImageForLoggedInUser(currentUser, file);
            return ResponseEntity.ok(updatedProfile);
        } catch (IOException e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/me")
    public ResponseEntity<ProfileDto> getMyProfile(@AuthenticationPrincipal User currentUser) {
        ProfileDto profile = profileService.getProfileByUserId(currentUser.getId());
        return ResponseEntity.ok(profile);
    }

    @PutMapping("/update")
    public ResponseEntity<ProfileDto> updateProfile(
            @AuthenticationPrincipal User currentUser,
            @RequestBody ProfileDto profileDto) {

        ProfileDto updatedProfile = profileService.updateProfile(currentUser.getId(), profileDto);
        return ResponseEntity.ok(updatedProfile);
    }


    @PostMapping("/create")
    public ResponseEntity<ProfileDto> createProfile(
            @AuthenticationPrincipal User currentUser,
            @RequestBody ProfileDto profileDto) {

        ProfileDto createdProfile = profileService.createProfile(currentUser.getId(), profileDto);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdProfile);
    }






}
