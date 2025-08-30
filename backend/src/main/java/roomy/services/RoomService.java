package roomy.services;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import roomy.dto.room.RoomDto;
import roomy.dto.room.RoomReviewDto;
import roomy.dto.room.RoomWithReviewsDto;
import roomy.entities.Room;
import roomy.entities.User;
import roomy.entities.UserDocument;
import roomy.entities.enums.RoomStatus;
import roomy.exceptions.ResourceNotFoundException;
import roomy.repositories.RoomRepository;
import roomy.repositories.RoomReviewRepository;
import roomy.repositories.UserDocumentRepository;
import roomy.repositories.UserRepository;

import org.springframework.security.access.AccessDeniedException;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class RoomService {

    private final UserRepository userRepository;
    private final ModelMapper modelMapper;
    private final RoomRepository roomRepository;
    private final RoomReviewRepository reviewRepository;
   private final UserDocumentRepository userDocumentRepository;



    public RoomDto createRoom(RoomDto roomDto, User user) {
        Room room = modelMapper.map(roomDto, Room.class);
        room.setUser(user);
        room.setCreatedAt(LocalDateTime.now());
        Room savedRoom = roomRepository.save(room);
        return modelMapper.map(savedRoom, RoomDto.class);
    }



    public List<RoomDto> getRoomsByUser(User user) {
        List<Room> rooms = roomRepository.findByUser(user);
        return rooms.stream()
                .map(room -> modelMapper.map(room, RoomDto.class))
                .collect(Collectors.toList());
    }

    public List<RoomDto> getAllRooms() {
        List<Room> rooms = roomRepository.findAll();
        return rooms.stream()
                .map(room -> modelMapper.map(room, RoomDto.class))
                .collect(Collectors.toList());
    }


    public RoomDto updateRoomStatus(Long roomId, RoomStatus status, User user) {
        Room room = roomRepository.findById(roomId)
                .orElseThrow(() -> new ResourceNotFoundException("Room not found with id: " + roomId));

        if (!room.getUser().getId().equals(user.getId())) {
           throw new AccessDeniedException("You are not authorized to update this room");
        }

        room.setStatus(status);
        Room updatedRoom = roomRepository.save(room);
        return modelMapper.map(updatedRoom, RoomDto.class);
    }

    public void deleteRoom(Long roomId, Long userId) {
        Room room = roomRepository.findByIdAndUserId(roomId, userId)
                .orElseThrow(() -> new AccessDeniedException("You are not authorized to delete this room"));

        roomRepository.delete(room);
    }
    public void deleteRoomByAdmin(Long roomId, User currentUser) {
        // 🔐 Check admin role
        boolean isAdmin = currentUser.getRoles()
                .stream()
                .anyMatch(role -> role.name().equals("ADMIN"));

        if (!isAdmin) {
            throw new AccessDeniedException("Only admins can delete rooms.");
        }

        Room room = roomRepository.findById(roomId)
                .orElseThrow(() -> new RuntimeException("Room not found with id " + roomId));

        roomRepository.delete(room);
    }
//    public void deleteRoomById(Long id) {
//        if (!roomRepository.existsById(id)) {
//            throw new ResourceNotFoundException("Room not found with id: " + id);
//        }
//        roomRepository.deleteById(id);
//    }
//





    public RoomDto uploadRoomImages(Long roomId, MultipartFile[] images, User user) {
        Room room = roomRepository.findById(roomId)
                .orElseThrow(() -> new ResourceNotFoundException("Room not found"));

        if (!room.getUser().getId().equals(user.getId())) {
            throw new AccessDeniedException("You are not authorized to update this room");
        }

        List<String> uploadedUrls = new ArrayList<>();

        for (MultipartFile file : images) {
            String fileName = UUID.randomUUID() + "_" + file.getOriginalFilename();
            Path path = Paths.get("uploads/rooms/" + fileName);
            try {
                Files.createDirectories(path.getParent());
                Files.write(path, file.getBytes());
                uploadedUrls.add("/uploads/rooms/" + fileName); // relative path to access later
            } catch (IOException e) {
                throw new RuntimeException("Failed to upload image", e);
            }
        }

        room.getImageUrls().addAll(uploadedUrls);
        Room saved = roomRepository.save(room);

        return modelMapper.map(saved, RoomDto.class);
    }


    public RoomDto updateRoom(Long roomId, RoomDto roomDto, User user) {
        Room existingRoom = roomRepository.findById(roomId)
                .orElseThrow(() -> new ResourceNotFoundException("Room not found with id: " + roomId));

        // Check ownership
        if (!existingRoom.getUser().getId().equals(user.getId())) {
            throw new AccessDeniedException("You are not authorized to update this room");
        }

        // Update fields
        existingRoom.setTitle(roomDto.getTitle());
        existingRoom.setDescription(roomDto.getDescription());
        existingRoom.setPrice(roomDto.getPrice());
        existingRoom.setLocation(roomDto.getLocation());
        existingRoom.setImageUrls(roomDto.getImageUrls() != null ? new ArrayList<>(roomDto.getImageUrls()) : existingRoom.getImageUrls());
        existingRoom.setFurnished(roomDto.isFurnished());
        existingRoom.setAvailable(roomDto.isAvailable());
        existingRoom.setRoomType(roomDto.getRoomType());
        existingRoom.setStatus(roomDto.getStatus() != null ? roomDto.getStatus() : existingRoom.getStatus());
        existingRoom.setAvailableFrom(roomDto.getAvailableFrom());
        existingRoom.setGenderPreference(roomDto.getGenderPreference());
        existingRoom.setMaxOccupancy(roomDto.getMaxOccupancy());

        Room savedRoom = roomRepository.save(existingRoom);


        return modelMapper.map(savedRoom, RoomDto.class);
    }



    public RoomDto getRoomById(Long roomId) {
        Room room = roomRepository.findById(roomId)
                .orElseThrow(() -> new ResourceNotFoundException("Room not found with id: " + roomId));
        return modelMapper.map(room, RoomDto.class);
    }


    public List<RoomWithReviewsDto> getRoomsByLocation(String location) {
        List<Room> rooms = roomRepository.findByLocationContainingIgnoreCase(location);

        return rooms.stream().map(room -> {
            RoomWithReviewsDto dto = modelMapper.map(room, RoomWithReviewsDto.class);
            dto.setUserId(room.getUser() != null ? room.getUser().getId() : null);

            List<RoomReviewDto> reviews = reviewRepository.findByRoom(room)
                    .stream()
                    .map(r -> {
                        RoomReviewDto reviewDto = new RoomReviewDto();
                        reviewDto.setId(r.getId());
                        reviewDto.setRoomId(r.getRoom().getId());
                        reviewDto.setUserId(r.getUser() != null ? r.getUser().getId() : null);
                        reviewDto.setUserName(r.getUser() != null ? r.getUser().getName() : null);
                        reviewDto.setRating(r.getRating());
                        reviewDto.setReviewComment(r.getReviewComment());
                        reviewDto.setCreatedAt(r.getCreatedAt());
                        return reviewDto;
                    })
                    .collect(Collectors.toList());

            dto.setReviews(reviews);
            return dto;
        }).collect(Collectors.toList());
    }

    public List<RoomWithReviewsDto> getRoomsByQuery(String query) {
        String lowerQuery = query.toLowerCase();

        List<Room> allRooms = roomRepository.findAll();

        return allRooms.stream()
                .filter(room ->
                        (room.getTitle() != null && room.getTitle().toLowerCase().contains(lowerQuery)) ||
                                (room.getLocation() != null && room.getLocation().toLowerCase().contains(lowerQuery))
                )
                .map(room -> {
                    RoomWithReviewsDto dto = modelMapper.map(room, RoomWithReviewsDto.class);
                    dto.setUserId(room.getUser() != null ? room.getUser().getId() : null);

                    List<RoomReviewDto> reviews = reviewRepository.findByRoom(room)
                            .stream()
                            .map(r -> {
                                RoomReviewDto reviewDto = new RoomReviewDto();
                                reviewDto.setId(r.getId());
                                reviewDto.setRoomId(r.getRoom().getId());
                                reviewDto.setUserId(r.getUser() != null ? r.getUser().getId() : null);
                                reviewDto.setUserName(r.getUser() != null ? r.getUser().getName() : null);
                                reviewDto.setRating(r.getRating());
                                reviewDto.setReviewComment(r.getReviewComment());
                                reviewDto.setCreatedAt(r.getCreatedAt());
                                return reviewDto;
                            })
                            .collect(Collectors.toList());

                    dto.setReviews(reviews);
                    return dto;
                })
                .collect(Collectors.toList());
    }


    public List<RoomDto> getRandomRooms(int count) {
        List<Room> rooms = roomRepository.findAllByIsAvailableTrue(); // fetch all available rooms

        // Shuffle the list randomly
        Collections.shuffle(rooms);

        // Pick the first 'count' rooms
        List<Room> selectedRooms = rooms.stream()
                .limit(count)
                .toList();

        // Map to RoomDto
        return selectedRooms.stream()
                .map(room -> {
                    RoomDto dto = modelMapper.map(room, RoomDto.class);
                    dto.setUserId(room.getUser() != null ? room.getUser().getId() : null);
                    return dto;
                })
                .toList();
    }

}