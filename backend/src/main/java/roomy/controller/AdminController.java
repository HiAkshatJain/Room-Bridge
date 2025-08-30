package roomy.controller;


import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import roomy.dto.DocumentVerifyDto;
import roomy.dto.UserDocumentDto;
import roomy.dto.UserDto;

import roomy.dto.room.RoomDto;
import roomy.entities.User;
import roomy.services.AdminService;
import roomy.services.RoomService;
import roomy.services.UserDocumentService;


import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/admin")
@PreAuthorize("hasRole('ADMIN')")
@RequiredArgsConstructor
public class AdminController {

    private final AdminService adminService;
    private final UserDocumentService documentService;
    private final RoomService roomService;

    @GetMapping("/users")
    public ResponseEntity<List<UserDto>> getAllUsers() {
        return ResponseEntity.ok(adminService.getAllUsers());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteUser(@PathVariable Long id) {
        adminService.deleteUserById(id);
        return ResponseEntity.ok("User with ID " + id + " and related data deleted successfully.");
    }

    @GetMapping("/documents")
    public ResponseEntity<List<UserDocumentDto>> getAllDocuments() {
        return ResponseEntity.ok(documentService.getAllDocuments());
    }

    @PutMapping("/{id}/verify")
    public ResponseEntity<UserDocumentDto> verifyDocument(
            @PathVariable Long id,
            @RequestBody DocumentVerifyDto verifyDto) {

        UserDocumentDto docDto = documentService.verifyDocument(id, verifyDto.getStatus());
        return ResponseEntity.ok(docDto);
    }

    @GetMapping("/allRooms")
    public ResponseEntity<List<RoomDto>> getAllRooms() {
        return ResponseEntity.ok(adminService.getAllRooms());
    }


    @DeleteMapping("/room/{id}")
    public ResponseEntity<?> deleteRoom(@PathVariable Long id,
                                        @AuthenticationPrincipal User user) {
        roomService.deleteRoomByAdmin(id, user);
        return ResponseEntity.ok(Map.of("message", "Room deleted successfully by Admin!"));
    }


    @PostMapping("/make-admin")
    public ResponseEntity<String> makeUserAdmin(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        adminService.makeUserAdmin(email);
        return ResponseEntity.ok("User with email " + email + " is now an ADMIN.");
    }
}
