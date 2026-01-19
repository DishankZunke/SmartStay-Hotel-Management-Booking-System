package com.smartstay.smartstay_backend.service;

import com.smartstay.smartstay_backend.model.Hotel;
import com.smartstay.smartstay_backend.model.Room;
import com.smartstay.smartstay_backend.repository.HotelRepository;
import com.smartstay.smartstay_backend.repository.RoomRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class RoomService {

    private final RoomRepository roomRepository;
    private final HotelRepository hotelRepository;

    //  Get all rooms
    public List<Room> getAllRooms() {
        return roomRepository.findAll();
    }

    //  Get all rooms of a hotel
    public List<Room> getRoomsByHotel(Long hotelId) {
        return roomRepository.findByHotel_HotelId(hotelId);
    }

    //  Get only available rooms (for booking)
    public List<Room> getAvailableRooms(Long hotelId) {
        return roomRepository.findByHotel_HotelIdAndAvailableRoomsGreaterThan(hotelId, 0);
    }

    //  Admin adds or updates room
    public Room saveRoom(Room room, Long hotelId) {

        Hotel hotel = hotelRepository.findById(hotelId)
                .orElseThrow(() -> new RuntimeException("Hotel not found with id " + hotelId));

        //  attach hotel before saving
        room.setHotel(hotel);

        return roomRepository.save(room);
    }

    //  Delete a room
    public void deleteRoom(Long roomId) {
        roomRepository.deleteById(roomId);
    }
}
