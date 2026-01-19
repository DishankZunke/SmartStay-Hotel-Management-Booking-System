package com.smartstay.smartstay_backend.dto;

import lombok.Data;
import java.time.LocalDate;

@Data
public class BookingRequest {

    private Long hotelId;
    private Long roomId;

    private LocalDate checkIn;
    private LocalDate checkOut;

    private int guests;
}
