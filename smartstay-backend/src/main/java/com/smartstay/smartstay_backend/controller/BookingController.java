package com.smartstay.smartstay_backend.controller;

import com.smartstay.smartstay_backend.dto.BookingRequest;
import com.smartstay.smartstay_backend.model.Booking;
import com.smartstay.smartstay_backend.security.CustomUserDetails;
import com.smartstay.smartstay_backend.service.BookingService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/bookings")
@RequiredArgsConstructor
public class BookingController {

    private final BookingService bookingService;

    //  MY BOOKINGS
    @GetMapping("/my")
    public List<Booking> myBookings(@AuthenticationPrincipal CustomUserDetails user) {
        String email = user.getUsername().toLowerCase();   // 🔥 FIX
        return bookingService.getMyBookings(email);
    }

    //  CREATE BOOKING
    @PostMapping
    public Booking createBooking(
            @AuthenticationPrincipal CustomUserDetails user,
            @RequestBody BookingRequest request
    ) {
        String email = user.getUsername().toLowerCase();   // 🔥 FIX
        return bookingService.createBooking(email, request);
    }

    //  CANCEL BOOKING
    @PutMapping("/{id}/cancel")
    public Booking cancelBooking(
            @AuthenticationPrincipal CustomUserDetails user,
            @PathVariable Long id
    ) {
        String email = user.getUsername().toLowerCase();   // 🔥 FIX
        return bookingService.cancelBooking(id, email);
    }
}


