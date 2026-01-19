package com.smartstay.smartstay_backend.service;

import com.smartstay.smartstay_backend.enums.BookingStatus;
import com.smartstay.smartstay_backend.enums.PaymentStatus;
import com.smartstay.smartstay_backend.model.Booking;
import com.smartstay.smartstay_backend.model.Payment;
import com.smartstay.smartstay_backend.model.Room;
import com.smartstay.smartstay_backend.repository.BookingRepository;
import com.smartstay.smartstay_backend.repository.PaymentRepository;
import com.smartstay.smartstay_backend.repository.RoomRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class PaymentService {

    private final BookingRepository bookingRepository;
    private final PaymentRepository paymentRepository;
    private final RoomRepository roomRepository;

    @Transactional
    public Payment processPayment(String orderId, String paymentId, String signature) {

        Booking booking = bookingRepository.findByRazorpayOrderId(orderId)
                .orElseThrow(() -> new RuntimeException("Booking not found for order " + orderId));

        if (booking.getPaymentStatus() == PaymentStatus.PAID) {
            throw new RuntimeException("Payment already done");
        }

        //  Lock room now
        Room room = booking.getRoom();
        if (room.getAvailableRooms() <= 0) {
            throw new RuntimeException("No rooms left");
        }
        room.setAvailableRooms(room.getAvailableRooms() - 1);

        //  Update booking
        booking.setStatus(BookingStatus.CONFIRMED);
        booking.setPaymentStatus(PaymentStatus.PAID);
        booking.setRazorpayPaymentId(paymentId);

        //  Create payment record
        Payment payment = new Payment();
        payment.setBooking(booking);
        payment.setRazorpayOrderId(orderId);
        payment.setRazorpayPaymentId(paymentId);
        payment.setRazorpaySignature(signature);
        payment.setAmount(booking.getTotalPrice());
        payment.setStatus(PaymentStatus.PAID);
        payment.setCreatedAt(LocalDateTime.now());

        roomRepository.save(room);
        bookingRepository.save(booking);
        return paymentRepository.save(payment);
    }
}
