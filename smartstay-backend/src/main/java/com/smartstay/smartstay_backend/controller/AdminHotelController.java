package com.smartstay.smartstay_backend.controller;

import com.smartstay.smartstay_backend.model.Hotel;
import com.smartstay.smartstay_backend.service.HotelService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/hotels")
@RequiredArgsConstructor
public class AdminHotelController {

    private final HotelService hotelService;

    //  Only ADMIN can view all hotels
    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping
    public ResponseEntity<List<Hotel>> getAllHotelsForAdmin() {
        return ResponseEntity.ok(hotelService.getAllHotels());
    }


    //  Only ADMIN can add hotels
    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping
    public ResponseEntity<Hotel> addHotel(@RequestBody Hotel hotel) {
        return ResponseEntity.ok(hotelService.addHotel(hotel));
    }

    //  Only ADMIN can update hotels
    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{id}")
    public ResponseEntity<Hotel> updateHotel(
            @PathVariable Long id,
            @RequestBody Hotel hotel
    ) {
        return ResponseEntity.ok(hotelService.updateHotel(id, hotel));
    }

    //  Only ADMIN can delete hotels
    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteHotel(@PathVariable Long id) {
        hotelService.deleteHotel(id);
        return ResponseEntity.ok("Hotel deleted successfully");
    }
}
