package com.smartstay.smartstay_backend.repository;

import com.smartstay.smartstay_backend.model.Room;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface RoomRepository extends JpaRepository<Room, Long> {

    // 🔍 Get all rooms of a particular hotel
    List<Room> findByHotel_HotelId(Long hotelId);

    // 🔍 Get rooms with available rooms > 0
    List<Room> findByHotel_HotelIdAndAvailableRoomsGreaterThan(
            Long hotelId,
            Integer availableRooms
    );
}
