package roomy.dto;



import lombok.Data;
import roomy.entities.Room;
import roomy.entities.enums.Role;
import roomy.entities.enums.VerificationStatus;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;

@Data
public class UserDto {

    private Long id;
    private String email;
    private String name;
    private Set<Role> roles;


}
