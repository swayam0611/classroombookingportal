# Room Scheduler & Classroom Booking Portal
### A Full-Stack Classroom Management System

---

## Project Overview
The **Room Scheduler** is a web-based application designed to streamline the process of booking lecture halls and labs across various departments. The system provides a real-time, interactive interface for students and faculty to check room availability and manage academic schedules efficiently.

## Tech Stack
* **Frontend:** HTML5, CSS3 (Custom Grid Layouts), JavaScript (ES6+, Fetch API)
* **Backend:** Java 17, Spring Boot 3.x, Spring Data JPA
* **Database:** PostgreSQL
* **Session Management:** `HttpSession` (Server-side tracking)
* **Version Control:** Git

## Key Features
* **Interactive Dynamic Calendar:** A custom-built JavaScript calendar allowing users to select dates and view schedules instantly.
* **Department-wise Browsing:** Categorized view for CS, EnTC, Mechanical, Electrical, and more.
* **Collision Detection System:** Backend logic in the Service layer that prevents double-booking and overlapping schedules.
* **Business Rule Enforcement:** Ensures bookings align with 30-minute academic slots.
* **Session-based Authentication:** Basic Login/Logout flow to authenticate users for booking data.
* **Admin Portal:** Admin can create new lecture halls, and manage/cancel any bookings.

---

## Object-Oriented principles used:
This project serves as a practical implementation of core OO concepts:
* **Encapsulation:** Business logic is encapsulated within the `BookingService` class, protecting it from direct controller manipulation.
* **Abstraction:** Database interactions are abstracted through Spring Data JPA interfaces.
* **Inheritance:** Custom exception handling via `BookingValidationException` which extends the standard `RuntimeException`.
* **Polymorphism:** Utilized Repository-level polymorphism for specialized query methods.

---

## 📂 Project Structure
```text
src/
├── main/
│   ├── java/com/coep/booking/
│   │   ├── controller/   # REST API Endpoints
│   │   ├── model/        # Database Entities (User, Room, Booking)
│   │   ├── repository/   # JPA Data Access Objects
│   │   ├── service/      # Business Logic & Conflict Checks
│   │   └── exception/    # Custom Exception Handlers
│   └── resources/
│       ├── static/       # Frontend (HTML, CSS, JS)
│       └── application.properties # Database & App Config
