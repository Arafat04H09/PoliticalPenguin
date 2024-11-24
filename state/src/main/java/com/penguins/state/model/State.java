package com.penguins.state.model;

import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "State")
public class State {
    private String state;
    private String planType;
    private String curDistrictPlan;
    private String summary;
    private String ensemble250;
    private String ensemble500;
    private String ensemble1000;
    private String ensemble2000;
    private String ensemble5000;
    
    public State() {
    }
    public String getSummary() {
        return summary;
    }
    public void setSummary(String summary) {
        this.summary = summary;
    }
    public String getEnsemble250() {
        return ensemble250;
    }
    public void setEnsemble250(String ensemble250) {
        this.ensemble250 = ensemble250;
    }
    public String getEnsemble500() {
        return ensemble500;
    }
    public void setEnsemble500(String ensemble500) {
        this.ensemble500 = ensemble500;
    }
    public String getEnsemble1000() {
        return ensemble1000;
    }
    public void setEnsemble1000(String ensemble1000) {
        this.ensemble1000 = ensemble1000;
    }
    public String getEnsemble2000() {
        return ensemble2000;
    }
    public void setEnsemble2000(String ensemble2000) {
        this.ensemble2000 = ensemble2000;
    }
    public String getEnsemble5000() {
        return ensemble5000;
    }
    public void setEnsemble5000(String ensemble5000) {
        this.ensemble5000 = ensemble5000;
    }
    public String getPlanType() {
        return planType;
    }
    public void setPlanType(String planType) {
        this.planType = planType;
    }
    public String getState() {
        return state;
    }
    public void setState(String state) {
        this.state = state;
    }
    public String getCurDistrictPlan() {
        return curDistrictPlan;
    }
    public void setCurDistrictPlan(String curDistrictPlan) {
        this.curDistrictPlan = curDistrictPlan;
    }
    @Override
    public String toString() {
        return "State [state=" + state + ", planType=" + planType + ", curDistrictPlan=" + curDistrictPlan
                + ", summary=" + summary + ", ensemble250=" + ensemble250 + ", ensemble500=" + ensemble500
                + ", ensemble1000=" + ensemble1000 + ", ensemble2000=" + ensemble2000 + ", ensemble5000=" + ensemble5000
                + "]";
    }
}
