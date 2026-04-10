package com.coep.booking;

import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Autowired;
import java.util.List;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;



@RestController
@RequestMapping("/api/rooms")
public class RoomController {

    @Autowired
    private RoomRepository roomRepository;

    @GetMapping
    public List<Room> getAllRooms() {
        return roomRepository.findAllByOrderByIdAsc();
    }
    
    @GetMapping("/{dept}")
    public List<Room> getRoomsByDepartment(@PathVariable String dept) {
        return roomRepository.findByDepartment(dept);
    }
    

    @PostMapping
    public void addRoom(@RequestBody Room room) {
        roomRepository.save(room);
    }

    @DeleteMapping("/{id}")
    public void deleteRoom(@PathVariable Long id) {
        roomRepository.deleteById(id);
    }

    @PutMapping("/{id}")
    public void editRoom(@PathVariable Long id, @RequestBody Room roomDetails) {
        Room room = roomRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Room not found."));
        
        room.setName(roomDetails.getName());
        room.setCapacity(roomDetails.getCapacity());
        room.setDepartment(roomDetails.getDepartment());
        
        roomRepository.save(room);
    }
}