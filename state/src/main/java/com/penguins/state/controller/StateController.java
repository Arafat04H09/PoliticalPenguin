package com.penguins.state.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import com.penguins.state.repository.StateRepository;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
public class StateController {

    @Autowired
    StateRepository stateRepo;
	
    @GetMapping("/{state}/curDistrictPlan")
	public String getStateCurDistrictPlan(@PathVariable String state)
	{
		return stateRepo.findCurDistrictPlanByState(state);
	}

	@GetMapping("/{state}/summary")
	public String getSummary(@PathVariable String state)
	{
		return stateRepo.findSummary(state);
	}
}
