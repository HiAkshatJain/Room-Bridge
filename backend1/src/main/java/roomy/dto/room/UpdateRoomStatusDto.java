package roomy.dto.room;

import jakarta.validation.constraints.NotNull;
import roomy.entities.enums.RoomStatus;

public class UpdateRoomStatusDto {
    @NotNull(message = "Room status is required")
    private RoomStatus status;

    public RoomStatus getStatus() {
        return status;
    }
    public void setStatus(RoomStatus status) {
        this.status = status;
    }
}