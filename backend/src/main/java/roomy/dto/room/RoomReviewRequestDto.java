package roomy.dto.room;

import lombok.Data;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

@Data
public class RoomReviewRequestDto {

    @NotNull
    private Long roomId;

    @NotNull
    private Long userId;

    @Min(1)
    @Max(5)
    private int rating;

    @NotBlank
    private String reviewComment;
}