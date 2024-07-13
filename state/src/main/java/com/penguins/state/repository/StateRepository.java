package com.penguins.state.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

import com.penguins.state.model.State;

public interface StateRepository extends MongoRepository<State,String>{

    @Query(value = "{ 'state' : ?0 }")
    State findByState(String state);   
    
    @Query(value = "{ 'state' : ?0 }", fields = "{ 'curDistrictPlan' : 1, '_id' : 0  }")
    String findCurDistrictPlanByState(String state);

    @Query(value = "{ 'state' : ?0 }", fields = "{ 'summary' : 1, '_id' : 0  }")
    String findSummary(String state);
}
