package com.smartstay.smartstay_backend.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "rooms")
@Data
public class Room {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long roomId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "hotel_id", nullable = false)
    @JsonIgnore
    private Hotel hotel;

    @Column(nullable = false)
    private String roomType;     // Deluxe, Suite, Family

    @Column(nullable = false)
    private Double pricePerNight;

    private Integer maxGuests;

    private Integer totalRooms;

    private Integer availableRooms;

    private String imageUrl;     // later we store S3 or Cloudinary URL

    @Transient
    public Long getHotelId() {
        return hotel != null ? hotel.getHotelId() : null;
    }

}
