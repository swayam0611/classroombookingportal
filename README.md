# Classroom Booking Portal

A web app for booking lecture halls and labs at a college. Students and faculty can check which rooms are free and book them; admins manage rooms, professors, and bookings.

## Tech stack

- Frontend: plain HTML, CSS, JavaScript
- Backend: Java 17, Spring Boot, Spring Data JPA
- Database: PostgreSQL

## Features

- Calendar view to check room availability by date
- Book a room for a lecture or event
- Bookings must sit on 30-minute slots (e.g. 9:00, 9:30)
- Blocks bookings that overlap an existing one for the same room
- Login/logout using server-side sessions
- Admin pages to add rooms, add professors, and cancel any booking

## Project structure

```
src/
├── main/
│   ├── java/com/coep/booking/
│   │   ├── ClassroomBookingApplication.java   # entry point
│   │   ├── Booking.java, Room.java, User.java, Professor.java   # data models
│   │   ├── BookingController.java, RoomController.java,
│   │   │   UserController.java, ProfessorController.java,
│   │   │   CheckSessionController.java, CountController.java   # API endpoints
│   │   ├── BookingRepository.java, RoomRepository.java,
│   │   │   UserRepository.java, ProfessorRepository.java   # database access
│   │   ├── BookingService.java   # slot validation and overlap checks
│   │   ├── InvalidBookingException.java   # custom exception
│   │   └── LoginRequest.java
│   └── resources/
│       ├── static/   # frontend pages (login, bookings, admin, etc.)
│       └── application.properties   # database config
└── test/   # basic test setup
```

## Setup

1. Create a PostgreSQL database.
2. Set the database URL, username, and password in `src/main/resources/application.properties`.
3. Run the app:
   ```bash
   ./mvnw spring-boot:run
   ```
4. Open `http://localhost:8080` in your browser.

## Notes

- Room-conflict and slot-length checks happen in `BookingService`.
- Invalid bookings throw `InvalidBookingException`, with a message explaining why.
