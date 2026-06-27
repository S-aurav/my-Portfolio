package com.saurav.hq.modules.profile;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
@Transactional
public class ProfileService {

    private final ProfileRepository repository;

    public ProfileService(ProfileRepository repository) {
        this.repository = repository;
    }

    @Transactional(readOnly = true)
    public Optional<Profile> getProfile() {
        return repository.findById(1L);
    }

    public Profile saveProfile(ProfileRequest req) {
        Profile profile = repository.findById(1L).orElse(new Profile());
        profile.setId(1L);
        profile.setName(req.name());
        profile.setRole(req.role());
        profile.setTagline(req.tagline());
        profile.setBio(req.bio());
        profile.setEmail(req.email());
        profile.setPhone(req.phone());
        profile.setLocation(req.location());
        profile.setProfileImage(req.profileImage());
        profile.setGithubUrl(req.githubUrl());
        profile.setLinkedinUrl(req.linkedinUrl());
        profile.setLeetcodeUrl(req.leetcodeUrl());
        
        if (req.sectionOrder() != null && !req.sectionOrder().isBlank()) {
            profile.setSectionOrder(req.sectionOrder().trim());
        } else {
            profile.setSectionOrder("about,skills,experience,projects,notes,contact");
        }
        
        return repository.save(profile);
    }
}
