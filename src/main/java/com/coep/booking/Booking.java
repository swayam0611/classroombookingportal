package com.coep.booking;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
public class Booking {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String purpose; // "LECTURE" or "EVENT"

    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private String subject;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User booker;

    @ManyToOne
    @JoinColumn(name = "professor_id")
    private Professor professor;

    @ManyToOne
    @JoinColumn(name = "room_id")
    private Room room;

    public Booking() {}
    // Getters and Setters
    public User getBooker() { return booker; }
    public void setBooker(User booker) { this.booker = booker; }
    public Professor getProfessor() { return professor; }
    public void setProfessor(Professor professor) { this.professor = professor; }
    public Room getRoom() { return room; }
    public void setRoom(Room room) { this.room = room; }
    public LocalDateTime getStartTime() { return startTime; }
    public void setStartTime(LocalDateTime startTime) { this.startTime = startTime; }
    public LocalDateTime getEndTime() {return endTime;}
    public void setEndTime(LocalDateTime endTime) {this.endTime = endTime;}
    public String getPurpose() {return purpose;}
    public void setPurpose(String purpose) {this.purpose = purpose;}
    public String getSubject() {return subject;}
    public void setSubject(String subject) {this.subject = subject;}
    public Long getId() {return id;}
}