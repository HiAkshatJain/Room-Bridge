package roomy.services;


import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import roomy.dto.UserDto;
import roomy.dto.room.RoomDto;
import roomy.entities.User;
import roomy.entities.enums.Role;
import roomy.exceptions.ResourceNotFoundException;
import roomy.repositories.*;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AdminService {

    private final UserRepository userRepository;
    private final ModelMapper modelMapper;
    private final RoomRepository roomRepository;

    private final ChatMessageRepository chatMessageRepository;
    private final RoomReviewRepository roomReviewRepository;
    private final SessionRepository sessionRepository;
    private final UserDocumentRepository userDocumentRepository;

    public List<UserDto> getAllUsers() {
        List<User> users = userRepository.findAll();
        return users.stream()
                .map(user -> modelMapper.map(user, UserDto.class))
                .toList();
    }




    @Transactional
    public void deleteUserById(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with id " + userId));

        // 0. Delete documents first (fix for your error)
        userDocumentRepository.deleteByUserId(userId);

        // 1. Delete sessions
        sessionRepository.deleteByUserId(userId);

        // 2. Delete chat messages
        chatMessageRepository.deleteBySenderIdOrReceiverId(userId, userId);

        // 3. Delete room reviews written by the user
        roomReviewRepository.deleteByUserId(userId);

        // 4. Delete reviews on rooms owned by the user
        roomReviewRepository.deleteByUserRooms(userId);

        // 5. Delete rooms owned by the user
        roomRepository.deleteByUserId(userId);

        // 6. Finally delete the user
        userRepository.delete(user);
    }

    public List<RoomDto> getAllRooms() {
        return roomRepository.findAll()
                .stream()
                .map(room -> {
                    RoomDto dto = modelMapper.map(room, RoomDto.class);
                    dto.setUserId(room.getUser().getId());
                    dto.setUserName(room.getUser().getName());
                    return dto;
                })
                .collect(Collectors.toList());
    }



    @Transactional
    public void makeUserAdmin(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found with email: " + email));

        // Add ADMIN role if not already present
        if (!user.getRoles().contains(Role.ADMIN)) {
            user.getRoles().add(Role.ADMIN);
            userRepository.save(user);
        } else {
            throw new RuntimeException("User is already an ADMIN.");
        }
    }

}