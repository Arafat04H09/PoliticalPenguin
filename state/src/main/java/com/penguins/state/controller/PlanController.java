package com.penguins.state.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import com.penguins.state.model.Plan;
import com.penguins.state.repository.PlanRepository;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
public class PlanController {

    @Autowired
    PlanRepository planRepo;

    @GetMapping("/{state}/ensemble{ensemble}")
    public Plan getPlan250ByName(@PathVariable String state, @PathVariable Integer ensemble) {
        return planRepo.findByPlan(state, ensemble);
    }
}
