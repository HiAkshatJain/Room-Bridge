package roomy.dto.room;


import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import roomy.entities.enums.RoomStatus;
import java.time.LocalDate;
import java.util.List;


@Data
public class RoomDto {
    private Long id;

    @NotBlank(message = "Title is required")
    private String title;

    private String description;

    @NotNull(message = "Price is required")
    private Double price;

    @NotBlank(message = "Location is required")
    private String location;

    private List<String> imageUrls;

    @JsonProperty("isAvailable")
    private boolean isAvailable;

    private boolean furnished;

    private String roomType;


    private RoomStatus status ;

    private LocalDate availableFrom;

    private String genderPreference;

    private int maxOccupancy;

    private Long userId;

    private String userName;


}
