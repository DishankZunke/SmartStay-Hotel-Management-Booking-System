package com.smartstay.smartstay_backend.controller;

import com.smartstay.smartstay_backend.model.Room;
import com.smartstay.smartstay_backend.service.RoomService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/rooms")
@RequiredArgsConstructor
public class AdminRoomController {

    private final RoomService roomService;

    //  Admin adds a room
    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping
    public ResponseEntity<Room> addRoom(
            @RequestParam Long hotelId,
            @RequestBody Room room
    ) {
        return ResponseEntity.ok(roomService.saveRoom(room, hotelId));
    }

    //  Admin updates a room
    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{id}")
    public ResponseEntity<Room> updateRoom(
            @PathVariable Long id,
            @RequestParam Long hotelId,
            @RequestBody Room room
    ) {
        room.setRoomId(id);
        return ResponseEntity.ok(roomService.saveRoom(room, hotelId));
    }

    //  Admin deletes a room
    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteRoom(@PathVariable Long id) {
        roomService.deleteRoom(id);
        return ResponseEntity.ok("Room deleted");
    }
}
