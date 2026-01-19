package com.smartstay.smartstay_backend.controller;

import com.razorpay.Order;
import com.smartstay.smartstay_backend.model.Booking;
import com.smartstay.smartstay_backend.repository.BookingRepository;
import com.smartstay.smartstay_backend.service.PaymentService;
import com.smartstay.smartstay_backend.service.RazorpayService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/payments")
@RequiredArgsConstructor
public class PaymentController {

    private final RazorpayService razorpayService;
    private final BookingRepository bookingRepository;
    private final PaymentService paymentService;

    //  CREATE ORDER
    @PostMapping("/create-order/{bookingId}")
    public ResponseEntity<Map<String, Object>> createOrder(@PathVariable Long bookingId) throws Exception {

        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found"));

        //  Always send String receipt
        Order order = razorpayService.createOrder(
                booking.getTotalPrice(),
                String.valueOf(bookingId)
        );

        String razorpayOrderId = order.get("id").toString();

        booking.setRazorpayOrderId(razorpayOrderId);
        bookingRepository.save(booking);

        Map<String, Object> response = new HashMap<>();
        response.put("id", razorpayOrderId);
        response.put("amount", order.get("amount"));
        response.put("currency", order.get("currency"));

        return ResponseEntity.ok(response);
    }

    //  VERIFY PAYMENT
    @PostMapping("/verify")
    public ResponseEntity<?> verifyPayment(@RequestBody Map<String, String> data) {

        String orderId = data.get("razorpay_order_id");
        String paymentId = data.get("razorpay_payment_id");
        String signature = data.get("razorpay_signature");

        System.out.println("ORDER ID = " + orderId);
        System.out.println("PAYMENT ID = " + paymentId);
        System.out.println("SIGNATURE = " + signature);

        boolean valid = razorpayService.verifySignature(orderId, paymentId, signature);

        if (!valid) {
            return ResponseEntity.badRequest().body("Payment verification failed");
        }

        //  This sets payment_status = PAID
        paymentService.processPayment(orderId, paymentId, signature);

        return ResponseEntity.ok("Payment successful");
    }
}
