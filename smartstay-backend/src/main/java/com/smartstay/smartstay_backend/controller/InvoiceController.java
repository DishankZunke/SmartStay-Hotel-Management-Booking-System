package com.smartstay.smartstay_backend.controller;

import com.smartstay.smartstay_backend.model.User;
import com.smartstay.smartstay_backend.repository.UserRepository;
import com.smartstay.smartstay_backend.security.JwtService;
import com.smartstay.smartstay_backend.service.InvoiceService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/invoice")
@RequiredArgsConstructor
public class InvoiceController {

    private final InvoiceService invoiceService;
    private final JwtService jwtService;
    private final UserRepository userRepository;

    @GetMapping("/{bookingId}")
    public ResponseEntity<byte[]> downloadInvoice(
            @PathVariable Long bookingId,
            @RequestHeader("Authorization") String authHeader) {

        String token = authHeader.substring(7);

        String email = jwtService.extractEmail(token).toLowerCase();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        byte[] pdf = invoiceService.generateInvoice(bookingId, user.getUserId());

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION,
                        "attachment; filename=invoice_" + bookingId + ".pdf")
                .contentType(MediaType.APPLICATION_PDF)
                .body(pdf);
    }
}

