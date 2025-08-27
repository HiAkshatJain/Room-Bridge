package roomy.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;
import roomy.dto.room.RoomReviewDto;
import roomy.dto.room.RoomReviewRequestDto;
import roomy.services.RoomReviewService;

import java.util.List;

@RestController
@RequestMapping("/api/room-reviews")
@RequiredArgsConstructor
public class RoomReviewController {

    private final RoomReviewService reviewService;

    @PostMapping("/add")
    public RoomReviewDto addReview(@Valid @RequestBody RoomReviewRequestDto request) {
        return reviewService.addReview(request);
    }

    @GetMapping("/room/{roomId}")
    public List<RoomReviewDto> getReviews(@PathVariable Long roomId) {
        return reviewService.getReviewsForRoom(roomId);
    }
}
