package com.coep.booking;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.GetMapping;


@RestController
@RequestMapping("/api/count")
public class CountController {
    @Autowired
    private RoomRepository roomRepository;

    @GetMapping
    public long getCountofRooms() {
        return roomRepository.count();
    }
    
}
