package com.coep.booking;

import org.springframework.web.bind.annotation.*;

import jakarta.servlet.http.HttpSession;
import java.util.Optional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;



@RestController
@RequestMapping("/api/bookings")
public class BookingController {
    @Autowired
    private BookingService bookingService;

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired 
    private UserRepository userRepository;

    BookingController(BookingService bookingService) {
        this.bookingService = bookingService;
    }

    @GetMapping
    public List<Booking> getAllBookings() {
        return bookingRepository.findAllByOrderByStartTimeAsc();
    }

    @GetMapping("/{roomId}")
    public List<Booking> getMethodName(@PathVariable Long roomId) {
        return bookingRepository.findByRoomId(roomId);
    }

    @GetMapping("/{roomId}/{date}")
    public List<Booking> getBookingsByRoomAndDate(@PathVariable Long roomId, @PathVariable String date) {
        LocalDate localDate = LocalDate.parse(date);
        System.out.println(localDate);
        LocalDateTime start = localDate.atStartOfDay();
        LocalDateTime end = localDate.atTime(LocalTime.MAX);

        return bookingRepository.findByRoomIdAndStartTimeBetween(roomId, start, end);
    }
    

    /**
     * @param booking
     * @param session
     * @return
     */
    @PostMapping
    public ResponseEntity<?> createBooking(@RequestBody Booking booking, HttpSession session) {
        String email =(String) session.getAttribute("loggedInUser");
        if (email == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Session expired. Please login again.");
        }
        Optional<User> user = userRepository.findByEmail(email);
        if (user.isPresent()) {
            booking.setBooker(user.get());
            try {
                bookingService.saveBooking(booking);
            } catch (InvalidBookingException e) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
            }
            return ResponseEntity.ok("Booking Created Successfully.");
        }
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("User not found in database.");
    }

    @PostMapping("/admin")
    public ResponseEntity<?> createBookingForAdmin(@RequestBody Booking booking) {
        Optional<User> admin = userRepository.findById((long)7);
        booking.setBooker(admin.get());
        bookingService.saveBooking(booking);
        return ResponseEntity.ok("Booking Created successfully.");
    }
    

    @DeleteMapping("/{id}")
    public void deleteRoom(@PathVariable Long id) {
        bookingRepository.deleteById(id);
    }
}