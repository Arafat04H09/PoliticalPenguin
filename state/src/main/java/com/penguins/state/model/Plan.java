package com.penguins.state.model;

import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "Plan")
public class Plan {
    private String state;
    private String ensemble;
    private String plan;

    public String getPlan() {
        return plan;
    }

    public void setPlan(String plan) {
        this.plan = plan;
    }

    public String getState() {
        return state;
    }

    public void setState(String state) {
        this.state = state;
    }

    public String getEnsemble() {
        return ensemble;
    }

    public void setEnsemble(String ensemble) {
        this.ensemble = ensemble;
    }

    public Plan() {
    }
}
