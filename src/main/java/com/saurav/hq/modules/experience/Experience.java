package com.saurav.hq.modules.experience;

import com.saurav.hq.common.BaseEntity;
import jakarta.persistence.*;

@Entity
@Table(name = "experience")
public class Experience extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @Column(nullable = false)
    private String role;

    @Column(nullable = false)
    private String company;

    private String duration;
    private String location;

    @Column(nullable = false)
    private String type; // "work" or "education"

    @Column(columnDefinition = "TEXT")
    private String highlights; // JSON array string e.g. ["point1","point2"]

    @Column(columnDefinition = "TEXT")
    private String techStack; // JSON array string e.g. ["Java","Spring"]

    @Column(nullable = false)
    private int displayOrder = 0;

    // ── Constructors ─────────────────────────────────────────────────────────

    public Experience() {}

    // ── Getters & Setters ────────────────────────────────────────────────────

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public String getCompany() {
        return company;
    }

    public void setCompany(String company) {
        this.company = company;
    }

    public String getDuration() {
        return duration;
    }

    public void setDuration(String duration) {
        this.duration = duration;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getHighlights() {
        return highlights;
    }

    public void setHighlights(String highlights) {
        this.highlights = highlights;
    }

    public String getTechStack() {
        return techStack;
    }

    public void setTechStack(String techStack) {
        this.techStack = techStack;
    }

    public int getDisplayOrder() {
        return displayOrder;
    }

    public void setDisplayOrder(int displayOrder) {
        this.displayOrder = displayOrder;
    }
}
