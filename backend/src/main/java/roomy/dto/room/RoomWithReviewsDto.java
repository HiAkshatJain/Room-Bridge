package roomy.dto.room;

import lombok.Data;
import roomy.entities.enums.RoomStatus;

import java.time.LocalDate;
import java.util.List;

@Data
public class RoomWithReviewsDto {
    private Long id;
    private String title;
    private String description;
    private Double price;
    private String location;
    private List<String> imageUrls;
    private boolean isAvailable;
    private boolean furnished;
    private String roomType;
    private RoomStatus status;
    private LocalDate availableFrom;
    private String genderPreference;
    private int maxOccupancy;
    private Long userId;
    private List<RoomReviewDto> reviews;
}
