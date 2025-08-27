package roomy.services;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import roomy.dto.ProfileDto;
import roomy.entities.Profile;
import roomy.entities.User;
import roomy.exceptions.ResourceNotFoundException;
import roomy.repositories.ProfileRepository;
import roomy.repositories.UserRepository;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ProfileService {



    private final ProfileRepository profileRepository;
    private final UserRepository userRepository;
    private final ModelMapper modelMapper;
    private final String PROFILE_IMAGE_DIR = "uploads/profile-images/";

    public ProfileDto createOrUpdateProfile(Long userId, ProfileDto profileDto) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Profile profile = profileRepository.findByUser(user).orElse(new Profile());
        profile.setUser(user);
        profile.setFullName(profileDto.getFullName());
        profile.setPhoneNumber(profileDto.getPhoneNumber());
        profile.setAddress(profileDto.getAddress());
        profile.setBio(profileDto.getBio());
        profile.setProfileImageUrl(profileDto.getProfileImageUrl());

        profile.setVerificationStatus(profileDto.isVerificationStatus());
        profile.setSocialLinks(profileDto.getSocialLinks());

        // createdAt is set automatically on persist

        Profile saved = profileRepository.save(profile);
        return modelMapper.map(saved, ProfileDto.class);
    }

    public ProfileDto getProfileByUserId(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));

        Profile profile = profileRepository.findByUser(user)
                .orElseThrow(() -> new RuntimeException("Profile not found for user id: " + userId));

        return modelMapper.map(profile, ProfileDto.class);
    }


    @Transactional
    public ProfileDto updateProfile(Long userId, ProfileDto profileDto) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));

        Profile profile = profileRepository.findByUser(user).orElse(new Profile());
        profile.setUser(user);
        profile.setFullName(profileDto.getFullName());
        profile.setPhoneNumber(profileDto.getPhoneNumber());
        profile.setAddress(profileDto.getAddress());
        profile.setBio(profileDto.getBio());
        profile.setProfileImageUrl(profileDto.getProfileImageUrl());
        profile.setVerificationStatus(profileDto.isVerificationStatus());
        profile.setSocialLinks(profileDto.getSocialLinks());

        // createdAt is set automatically on persist (do not update here)

        Profile savedProfile = profileRepository.save(profile);
        return modelMapper.map(savedProfile, ProfileDto.class);
    }


    @Transactional
    public ProfileDto createProfile(Long userId, ProfileDto profileDto) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));

        if (profileRepository.findByUser(user).isPresent()) {
            throw new IllegalArgumentException("Profile already exists for user id: " + userId);
        }

        Profile profile = new Profile();
        profile.setUser(user);
        profile.setFullName(profileDto.getFullName());
        profile.setPhoneNumber(profileDto.getPhoneNumber());
        profile.setAddress(profileDto.getAddress());
        profile.setBio(profileDto.getBio());
        profile.setProfileImageUrl(profileDto.getProfileImageUrl());
        profile.setVerificationStatus(profileDto.isVerificationStatus());
        profile.setSocialLinks(profileDto.getSocialLinks());

        Profile savedProfile = profileRepository.save(profile);
        return modelMapper.map(savedProfile, ProfileDto.class);
    }


    public ProfileDto uploadProfileImageForLoggedInUser(User user, MultipartFile file) throws IOException {

        // 1. Fetch existing profile from repository
        Profile profile = profileRepository.findByUser(user)
                .orElse(new Profile()); // create new only if none exists

        profile.setUser(user); // associate with user (safe even if already exists)

        // 2. Ensure directory exists
        Path uploadPath = Paths.get(PROFILE_IMAGE_DIR);
        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
        }

        // 3. Save file with unique name
        String fileName = System.currentTimeMillis() + "_" + file.getOriginalFilename();
        Path filePath = uploadPath.resolve(fileName);
        Files.write(filePath, file.getBytes());

        // 4. Update profile image URL
        profile.setProfileImageUrl("/uploads/profile-images/" + fileName);

        // 5. Save profile (insert or update)
        profileRepository.save(profile);

        // 6. Map to DTO
        ProfileDto dto = new ProfileDto();
        dto.setId(profile.getId());
        dto.setUserId(user.getId());
        dto.setFullName(profile.getFullName());
        dto.setPhoneNumber(profile.getPhoneNumber());
        dto.setAddress(profile.getAddress());
        dto.setBio(profile.getBio());
        dto.setProfileImageUrl(profile.getProfileImageUrl());
        dto.setSocialLinks(profile.getSocialLinks());
        dto.setVerificationStatus(profile.isVerificationStatus());
        dto.setCreatedAt(profile.getCreatedAt());

        return dto;
    }







}
