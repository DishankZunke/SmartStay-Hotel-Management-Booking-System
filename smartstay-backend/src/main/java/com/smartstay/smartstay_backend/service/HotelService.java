package com.smartstay.smartstay_backend.service;

import com.smartstay.smartstay_backend.model.Hotel;
import com.smartstay.smartstay_backend.repository.HotelRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class HotelService {

    private final HotelRepository hotelRepository;

    //  Admin creates hotel
    public Hotel addHotel(Hotel hotel) {
        hotel.setRatingAvg((double) 0);   // new hotel has no rating
        return hotelRepository.save(hotel);
    }

    //  Admin updates hotel
    public Hotel updateHotel(Long hotelId, Hotel updatedHotel) {
        Hotel hotel = hotelRepository.findById(hotelId)
                .orElseThrow(() -> new RuntimeException("Hotel not found"));

        hotel.setName(updatedHotel.getName());
        hotel.setCity(updatedHotel.getCity());
        hotel.setAddress(updatedHotel.getAddress());
        hotel.setDescription(updatedHotel.getDescription());
        hotel.setAmenities(updatedHotel.getAmenities());

        return hotelRepository.save(hotel);
    }

    //  Admin deletes hotel
    public void deleteHotel(Long hotelId) {
        Hotel hotel = hotelRepository.findById(hotelId)
                .orElseThrow(() -> new RuntimeException("Hotel not found"));

        hotelRepository.delete(hotel);   //  this triggers cascade delete
    }


    //  Anyone can view hotels
    public List<Hotel> getAllHotels() {
        return hotelRepository.findAll();
    }

    public Hotel getHotelById(Long id) {
        return hotelRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Hotel not found"));
    }

    public List<Hotel> getHotelsByCity(String city) {
        return hotelRepository.findByCityIgnoreCase(city);
    }

}
