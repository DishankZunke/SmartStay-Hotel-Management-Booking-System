package com.smartstay.smartstay_backend.controller;

import com.smartstay.smartstay_backend.model.Hotel;
import com.smartstay.smartstay_backend.service.HotelService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/hotels")
@RequiredArgsConstructor
public class HotelController {

    private final HotelService hotelService;

    //  Show all hotels
    @GetMapping()
    public List<Hotel> getAllHotels() {
        return hotelService.getAllHotels();
    }

    //  Search hotels by city
    @GetMapping("/city/{city}")
    public List<Hotel> getByCity(@PathVariable String city) {
        return hotelService.getHotelsByCity(city);
    }

    //  Hotel details page
    @GetMapping("/{id}")
    public Hotel getHotel(@PathVariable Long id) {
        return hotelService.getHotelById(id);
    }
}
