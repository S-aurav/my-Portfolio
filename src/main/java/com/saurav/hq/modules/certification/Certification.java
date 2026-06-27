package com.saurav.hq.modules.certification;

import com.saurav.hq.common.BaseEntity;
import jakarta.persistence.*;

@Entity
@Table(name = "certification")
public class Certification extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private int displayOrder = 0;

    // ── Constructors ─────────────────────────────────────────────────────────

    public Certification() {}

    // ── Getters & Setters ────────────────────────────────────────────────────

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public int getDisplayOrder() {
        return displayOrder;
    }

    public void setDisplayOrder(int displayOrder) {
        this.displayOrder = displayOrder;
    }
}
