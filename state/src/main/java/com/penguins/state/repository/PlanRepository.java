package com.penguins.state.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

import com.penguins.state.model.Plan;

public interface PlanRepository extends MongoRepository<Plan,String>{

    @Query(value = "{ 'state' : ?0, 'ensemble': ?1 }")
    Plan findByPlan(String state, Integer ensemble);   
    
}
