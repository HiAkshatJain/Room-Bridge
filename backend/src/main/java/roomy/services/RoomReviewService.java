package roomy.services;

import org.springframework.stereotype.Service;
import lombok.RequiredArgsConstructor;
import roomy.dto.room.RoomReviewDto;
import roomy.dto.room.RoomReviewRequestDto;
import roomy.entities.Room;
import roomy.entities.RoomReview;
import roomy.entities.User;
import roomy.repositories.RoomRepository;
import roomy.repositories.RoomReviewRepository;
import roomy.repositories.UserRepository;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class RoomReviewService {

    private final RoomReviewRepository reviewRepository;
    private final RoomRepository roomRepository;
    private final UserRepository userRepository;

    public RoomReviewDto addReview(RoomReviewRequestDto request) {

        // Optional: check if user already reviewed
        if(reviewRepository.existsByRoomIdAndUserId(request.getRoomId(), request.getUserId())) {
            throw new RuntimeException("User has already reviewed this room");
        }

        Room room = roomRepository.findById(request.getRoomId())
                .orElseThrow(() -> new RuntimeException("Room not found"));

        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        RoomReview review = RoomReview.builder()
                .room(room)
                .user(user)
                .rating(request.getRating())
                .reviewComment(request.getReviewComment())
                .build();

        RoomReview saved = reviewRepository.save(review);

        return mapToDto(saved);
    }

    public List<RoomReviewDto> getReviewsForRoom(Long roomId) {
        return reviewRepository.findByRoomId(roomId)
                .stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    private RoomReviewDto mapToDto(RoomReview review) {
        RoomReviewDto dto = new RoomReviewDto();
        dto.setId(review.getId());
        dto.setRoomId(review.getRoom().getId());
        dto.setUserId(review.getUser().getId());
        dto.setUserName(review.getUser().getName());
        dto.setRating(review.getRating());
        dto.setReviewComment(review.getReviewComment());
        dto.setCreatedAt(review.getCreatedAt());
        return dto;
    }
}
