package com.saurav.hq.modules.profile;

public record ProfileRequest(
        String name,
        String role,
        String tagline,
        String bio,
        String email,
        String phone,
        String location,
        String profileImage,
        String githubUrl,
        String linkedinUrl,
        String leetcodeUrl,
        String sectionOrder
) {}
