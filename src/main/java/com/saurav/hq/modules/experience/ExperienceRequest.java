package com.saurav.hq.modules.experience;

public record ExperienceRequest(
        String role,
        String company,
        String duration,
        String location,
        String type,
        String highlights,
        String techStack,
        int displayOrder
) {}
