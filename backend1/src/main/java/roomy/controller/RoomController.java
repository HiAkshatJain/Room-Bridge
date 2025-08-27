package roomy.controller;


import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.apache.tomcat.util.net.openssl.ciphers.Authentication;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import roomy.advice.ApiError;
import roomy.dto.room.RoomDto;
import roomy.dto.room.RoomWithReviewsDto;
import roomy.dto.room.UpdateRoomStatusDto;
import roomy.entities.Room;
import roomy.entities.User;
import roomy.exceptions.ResourceNotFoundException;
import roomy.services.RoomService;

import java.util.List;

@RestController
@RequestMapping("/api/room")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class RoomController {

    private final RoomService roomService;

    @PostMapping
    public ResponseEntity<RoomDto> createRoom(@Valid @RequestBody RoomDto roomDto, @AuthenticationPrincipal User user) {

        RoomDto created = roomService.createRoom(roomDto, user);
        return new ResponseEntity<>(created, HttpStatus.CREATED);
    }


    @GetMapping("/mine")
    public ResponseEntity<List<RoomDto>> getMyRooms(@AuthenticationPrincipal User user) {
        List<RoomDto> rooms = roomService.getRoomsByUser(user);
        return new ResponseEntity<>(rooms, HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<RoomDto> getRoomById(@PathVariable Long id) {
        RoomDto room = roomService.getRoomById(id);
        return ResponseEntity.ok(room);
    }



    @GetMapping
    public ResponseEntity<List<RoomDto>> getAllRooms() {
        List<RoomDto> rooms = roomService.getAllRooms();
        return ResponseEntity.ok(rooms);
    }

    @PutMapping("/{roomId}/status")
    public ResponseEntity<RoomDto> updateRoomStatus(@PathVariable Long roomId,
                                                    @Valid @RequestBody UpdateRoomStatusDto statusDto,
                                                    @AuthenticationPrincipal User user) {
        RoomDto updatedRoom = roomService.updateRoomStatus(roomId, statusDto.getStatus(), user);
        return ResponseEntity.ok(updatedRoom);
    }


    @DeleteMapping("/{roomId}")
    public ResponseEntity<String> deleteRoom(
            @PathVariable Long roomId,
            @AuthenticationPrincipal User user
    ) {
        roomService.deleteRoom(roomId, user.getId());
        return ResponseEntity.ok("Room deleted successfully");
    }


    @PutMapping("/{roomId}/upload-images")
    public ResponseEntity<RoomDto> uploadRoomImages(
            @PathVariable Long roomId,
            @RequestParam("images") MultipartFile[] images,
            @AuthenticationPrincipal User user
    ) {
        RoomDto roomDto = roomService.uploadRoomImages(roomId, images, user);
        return ResponseEntity.ok(roomDto);
    }
    @PutMapping("/{roomId}")
    public ResponseEntity<RoomDto> updateRoom(@PathVariable Long roomId,
                                              @Valid @RequestBody RoomDto roomDto,
                                              @AuthenticationPrincipal User user) {
        RoomDto updatedRoom = roomService.updateRoom(roomId, roomDto, user);
        return ResponseEntity.ok(updatedRoom);
    }

    @GetMapping("/search")
    public ResponseEntity<List<RoomWithReviewsDto>> getRoomsByLocation(
            @RequestParam String location
    ) {
        List<RoomWithReviewsDto> rooms = roomService.getRoomsByLocation(location);
        return ResponseEntity.ok(rooms);
    }




}
