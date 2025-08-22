package roomy.dto.room;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;
import roomy.entities.User;
import roomy.entities.enums.RoomStatus;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Set;
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

    private boolean isAvailable ;

    private boolean furnished;

    private String roomType;


    private RoomStatus status ;

    private LocalDate availableFrom;

    private String genderPreference;

    private int maxOccupancy;

    private Long userId;
}
