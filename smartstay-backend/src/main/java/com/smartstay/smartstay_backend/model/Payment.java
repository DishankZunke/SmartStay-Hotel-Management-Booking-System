package com.smartstay.smartstay_backend.model;

import com.smartstay.smartstay_backend.enums.PaymentStatus;
import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;

@Entity
@Table(name = "payments")
@Data
public class Payment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long paymentId;

    //  Which booking this payment belongs to
    @OneToOne
    @JoinColumn(name = "booking_id", nullable = false)
    private Booking booking;

    // Razorpay values
    private String razorpayOrderId;
    private String razorpayPaymentId;
    private String razorpaySignature;

    private Double amount;
    private String currency;       // INR
    private String receipt;        // booking_12 etc

    @Enumerated(EnumType.STRING)
    private PaymentStatus status;   // CREATED, PAID, FAILED

    private LocalDateTime createdAt;
}
