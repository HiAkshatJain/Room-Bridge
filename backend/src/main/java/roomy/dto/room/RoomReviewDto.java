package roomy.dto.room;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class RoomReviewDto {
    private Long id;
    private Long roomId;
    private Long userId;
    private String userName; // optional, to show who gave review
    private int rating;
    private String reviewComment;
    private LocalDateTime createdAt;
}