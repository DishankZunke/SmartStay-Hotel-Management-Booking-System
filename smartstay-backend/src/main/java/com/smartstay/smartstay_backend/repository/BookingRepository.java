package com.smartstay.smartstay_backend.repository;

import com.smartstay.smartstay_backend.model.Booking;
import com.smartstay.smartstay_backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface BookingRepository extends JpaRepository<Booking, Long> {

    List<Booking> findByUser(User user);
    Optional<Booking> findByRazorpayOrderId(String razorpayOrderId);

    List<Booking> findByUserEmail(String email);

}
