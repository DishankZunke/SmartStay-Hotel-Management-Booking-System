package com.smartstay.smartstay_backend.controller;

import com.smartstay.smartstay_backend.model.Room;
import com.smartstay.smartstay_backend.service.RoomService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/rooms")
@RequiredArgsConstructor
public class RoomController {

    private final RoomService roomService;

    //  Get all rooms
    @GetMapping
    public List<Room> getAllRooms() {
        return roomService.getAllRooms();
    }

    //  Get rooms by hotel
    @GetMapping("/hotel/{hotelId}")
    public List<Room> getRoomsByHotel(@PathVariable Long hotelId) {
        return roomService.getRoomsByHotel(hotelId);
    }

    //  Get only available rooms of a hotel (for booking)
    @GetMapping("/available/{hotelId}")
    public List<Room> getAvailableRooms(@PathVariable Long hotelId) {
        return roomService.getAvailableRooms(hotelId);
    }

}
