package roomy.entities;


import jakarta.persistence.Entity;
import jakarta.validation.constraints.NotNull;
import lombok.Setter;
import lombok.ToString;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.*;
import roomy.entities.enums.RoomStatus;
import roomy.entities.enums.RoomType;
import jakarta.validation.constraints.NotBlank;



import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
@Entity
@Getter
@Setter
@ToString
@AllArgsConstructor
@NoArgsConstructor
@JsonIgnoreProperties(ignoreUnknown = true)

public class Room {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    private String title;

    private String description;

    @NotNull
    private Double price;

    @NotBlank
    private String location;

    @ElementCollection
    private List<String> imageUrls = new ArrayList<>();

    private boolean furnished;

    private String roomType; // PRIVATE, SHARED

    @Enumerated(EnumType.STRING)
    private RoomStatus status = RoomStatus.AVAILABLE;

    @Column(name = "is_available", nullable = false)
    private boolean isAvailable ;

    private LocalDate availableFrom;

    private String genderPreference; // MALE, FEMALE, ANY

    private int maxOccupancy;

    private LocalDateTime createdAt = LocalDateTime.now();

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;
}
