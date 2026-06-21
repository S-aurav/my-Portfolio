package com.saurav.hq.modules.project;

import com.saurav.hq.common.Visibility;

public record ProjectRequest(
        String title,
        String description,
        String date,
        String githubUrl,
        String demoUrl,
        String techStack,
        Visibility visibility,
        Integer displayOrder
) {}
