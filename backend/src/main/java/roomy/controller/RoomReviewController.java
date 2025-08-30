package roomy.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;
import roomy.dto.room.RoomReviewDto;
import roomy.dto.room.RoomReviewRequestDto;
import roomy.entities.User;
import roomy.services.RoomReviewService;

import java.util.List;

@RestController
@RequestMapping("/api/room-reviews")
@RequiredArgsConstructor
public class RoomReviewController {

    private final RoomReviewService reviewService;


  @PostMapping("/add")
   public RoomReviewDto addReview(@Valid @RequestBody RoomReviewRequestDto request, @AuthenticationPrincipal User user) {

     return reviewService.addReview(request, user);
   }

    @GetMapping("/room/{roomId}")
    public List<RoomReviewDto> getReviews(@PathVariable Long roomId) {
        return reviewService.getReviewsForRoom(roomId);
    }
}
