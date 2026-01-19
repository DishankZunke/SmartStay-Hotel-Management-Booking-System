package com.smartstay.smartstay_backend.service;

import com.smartstay.smartstay_backend.dto.BookingRequest;
import com.smartstay.smartstay_backend.enums.BookingStatus;
import com.smartstay.smartstay_backend.enums.PaymentStatus;
import com.smartstay.smartstay_backend.model.Booking;
import com.smartstay.smartstay_backend.model.Hotel;
import com.smartstay.smartstay_backend.model.Room;
import com.smartstay.smartstay_backend.model.User;
import com.smartstay.smartstay_backend.repository.BookingRepository;
import com.smartstay.smartstay_backend.repository.HotelRepository;
import com.smartstay.smartstay_backend.repository.RoomRepository;
import com.smartstay.smartstay_backend.repository.UserRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.List;

@Service
@RequiredArgsConstructor
public class BookingService {

    private final BookingRepository bookingRepository;
    private final UserRepository userRepository;
    private final RoomRepository roomRepository;
    private final HotelRepository hotelRepository;

    public List<Booking> getMyBookings(String email) {
        return bookingRepository.findByUserEmail(email.toLowerCase());
    }


    //  CREATE BOOKING (NO PAYMENT YET)

    public Booking createBooking(String userEmail, BookingRequest request) {

        User user = userRepository.findByEmail(userEmail.toLowerCase())
                .orElseThrow(() -> new RuntimeException("User not found"));

        Hotel hotel = hotelRepository.findById(request.getHotelId())
                .orElseThrow(() -> new RuntimeException("Hotel not found"));

        Room room = roomRepository.findById(request.getRoomId())
                .orElseThrow(() -> new RuntimeException("Room not found"));

        if (room.getAvailableRooms() == null || room.getAvailableRooms() <= 0) {
            throw new RuntimeException("Room not available");
        }

        long days = ChronoUnit.DAYS.between(request.getCheckIn(), request.getCheckOut());
        double totalPrice = days * room.getPricePerNight();

        Booking booking = new Booking();
        booking.setUser(user);
        booking.setHotel(hotel);
        booking.setRoom(room);
        booking.setCheckIn(request.getCheckIn());
        booking.setCheckOut(request.getCheckOut());
        booking.setGuests(request.getGuests());
        booking.setTotalPrice(totalPrice);

        //  Booking created but not yet paid
        booking.setStatus(BookingStatus.PENDING);
        booking.setPaymentStatus(PaymentStatus.PENDING);

        booking.setCreatedAt(LocalDate.now());

        //  DO NOT reduce room here
        // room will be reduced only after payment success

        return bookingRepository.save(booking);
    }
    //  CONFIRM BOOKING AFTER PAYMENT

    @Transactional
    public Booking confirmBooking(Long bookingId)
    {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found"));

        if (booking.getStatus() != BookingStatus.PENDING) {
            throw new RuntimeException("Booking is not in pending state");
        }

        Room room = booking.getRoom();

        if (room.getAvailableRooms() <= 0) {
            throw new RuntimeException("No rooms left");
        }

        // lock room
        room.setAvailableRooms(room.getAvailableRooms() - 1);
        roomRepository.save(room);

        booking.setStatus(BookingStatus.CONFIRMED);

        return bookingRepository.save(booking);
    }

    //  CANCEL BOOKING

    @Transactional
    public Booking cancelBooking(Long bookingId, String userEmail)
    {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found"));

        if (!booking.getUser().getEmail().equals(userEmail)) {
            throw new RuntimeException("You are not allowed to cancel this booking");
        }

        if (booking.getStatus() == BookingStatus.CANCELLED) {
            throw new RuntimeException("Booking already cancelled");
        }

        // If booking was confirmed → restore room
        if (booking.getStatus() == BookingStatus.CONFIRMED) {
            Room room = booking.getRoom();
            room.setAvailableRooms(room.getAvailableRooms() + 1);
            roomRepository.save(room);
        }

        booking.setStatus(BookingStatus.CANCELLED);
        return bookingRepository.save(booking);
    }
}
