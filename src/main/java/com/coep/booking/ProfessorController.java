package com.coep.booking;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;


@RestController
@RequestMapping("/api/professor")
public class ProfessorController {

    @Autowired ProfessorRepository professorRepository;

    @GetMapping()
    public List<Professor> getMethodName() {
        return professorRepository.findAll(); 
    }

    
}
