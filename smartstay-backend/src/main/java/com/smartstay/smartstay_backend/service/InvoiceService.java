package com.smartstay.smartstay_backend.service;

import com.smartstay.smartstay_backend.enums.PaymentStatus;
import com.smartstay.smartstay_backend.model.Booking;
import com.smartstay.smartstay_backend.repository.BookingRepository;
import com.itextpdf.text.*;
import com.itextpdf.text.pdf.PdfWriter;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;

@Service
@RequiredArgsConstructor
public class InvoiceService {

    private final BookingRepository bookingRepository;

    public byte[] generateInvoice(Long bookingId, Long userId) {

        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found"));

        if (!booking.getUser().getUserId().equals(userId)) {
            throw new RuntimeException("Not your booking");
        }

        if (booking.getPaymentStatus() != PaymentStatus.PAID) {
            throw new RuntimeException("Payment not completed");
        }

        try {
            ByteArrayOutputStream out = new ByteArrayOutputStream();
            Document document = new Document();
            PdfWriter.getInstance(document, out);
            document.open();

            Font title = new Font(Font.FontFamily.HELVETICA, 20, Font.BOLD);
            Font normal = new Font(Font.FontFamily.HELVETICA, 12);

            document.add(new Paragraph("SmartStay Invoice", title));
            document.add(new Paragraph(" "));
            document.add(new Paragraph("Booking ID: " + booking.getBookingId(), normal));
            document.add(new Paragraph("Hotel: " + booking.getHotel().getName(), normal));
            document.add(new Paragraph("Room: " + booking.getRoom().getRoomType(), normal));
            document.add(new Paragraph("Check-in: " + booking.getCheckIn(), normal));
            document.add(new Paragraph("Check-out: " + booking.getCheckOut(), normal));
            document.add(new Paragraph("Guests: " + booking.getGuests(), normal));
            document.add(new Paragraph(" "));
            document.add(new Paragraph("Total Paid: ₹" + booking.getTotalPrice(), title));
            document.add(new Paragraph("Payment ID: " + booking.getRazorpayPaymentId(), normal));
            document.add(new Paragraph("Order ID: " + booking.getRazorpayOrderId(), normal));

            document.close();
            return out.toByteArray();

        } catch (Exception e) {
            throw new RuntimeException("Invoice generation failed");
        }
    }
}
