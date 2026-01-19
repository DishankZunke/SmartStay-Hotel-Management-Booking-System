package com.smartstay.smartstay_backend.model;

import com.smartstay.smartstay_backend.enums.BookingStatus;
import com.smartstay.smartstay_backend.enums.PaymentStatus;
import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDate;

@Entity
@Table(name = "bookings")
@Data
public class Booking {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long bookingId;

    @ManyToOne
    private User user;

    @ManyToOne
    private Hotel hotel;

    @ManyToOne
    private Room room;

    private LocalDate checkIn;
    private LocalDate checkOut;
    private int guests;
    private double totalPrice;

    @Enumerated(EnumType.STRING)
    private BookingStatus status;    // PENDING / CONFIRMED / CANCELLED

    @Enumerated(EnumType.STRING)
    private PaymentStatus paymentStatus;   // PENDING / PAID / FAILED

    private String razorpayOrderId;
    private String razorpayPaymentId;

    private LocalDate createdAt;
}
