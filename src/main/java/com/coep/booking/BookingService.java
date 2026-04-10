package com.coep.booking;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class BookingService {

    @Autowired
    private BookingRepository bookingRepository;

    public Booking saveBooking(Booking newBooking) throws InvalidBookingException {
        //slots of 30s
        if (newBooking.getStartTime().getMinute() % 30 != 0 || 
            newBooking.getEndTime().getMinute() % 30 != 0) {
            throw new InvalidBookingException("Bookings must align with 30-minute slots (e.g., 9:00, 9:30).");
        }

        //prevent zero length
        if (!newBooking.getEndTime().isAfter(newBooking.getStartTime())) {
            throw new InvalidBookingException("End time must be after start time.");
        }

        //collision check
        List<Booking> existingBookings = bookingRepository.findByRoomId(newBooking.getRoom().getId());
        for (Booking existing : existingBookings) {
            if (newBooking.getStartTime().isBefore(existing.getEndTime()) && 
                existing.getStartTime().isBefore(newBooking.getEndTime())) {
                throw new InvalidBookingException("This slot is conflicting with another booking on this room.");
            }
        }

        return bookingRepository.save(newBooking);
    }
}