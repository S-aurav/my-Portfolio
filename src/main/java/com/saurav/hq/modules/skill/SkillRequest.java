package com.saurav.hq.modules.skill;

public record SkillRequest(
        String category,
        String name,
        int displayOrder
) {}
