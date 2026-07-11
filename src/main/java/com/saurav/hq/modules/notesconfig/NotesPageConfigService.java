package com.saurav.hq.modules.notesconfig;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
@Transactional
public class NotesPageConfigService {

    private final NotesPageConfigRepository repository;

    public NotesPageConfigService(NotesPageConfigRepository repository) {
        this.repository = repository;
    }

    @Transactional(readOnly = true)
    public Optional<NotesPageConfig> getConfig() {
        return repository.findById(1L);
    }

    public NotesPageConfig saveConfig(NotesPageConfigRequest req) {
        NotesPageConfig config = repository.findById(1L).orElse(new NotesPageConfig());
        config.setId(1L);

        config.setBgEnabled(req.bgEnabled());
        config.setBgImageUrl(req.bgImageUrl());
        config.setBgOpacity(req.bgOpacity());

        config.setHeroEnabled(req.heroEnabled());
        config.setHeroImageUrl(req.heroImageUrl());
        config.setHeroHeight(req.heroHeight());
        config.setHeroImageOpacity(req.heroImageOpacity());

        config.setSidebarImageEnabled(req.sidebarImageEnabled());
        config.setSidebarImageUrl(req.sidebarImageUrl());
        config.setSidebarImageOpacity(req.sidebarImageOpacity());

        config.setCornerTLEnabled(req.cornerTLEnabled());
        config.setCornerTLImageUrl(req.cornerTLImageUrl());
        config.setCornerTLSize(req.cornerTLSize());
        config.setCornerTLFadeIntensity(req.cornerTLFadeIntensity());

        config.setCornerTREnabled(req.cornerTREnabled());
        config.setCornerTRImageUrl(req.cornerTRImageUrl());
        config.setCornerTRSize(req.cornerTRSize());
        config.setCornerTRFadeIntensity(req.cornerTRFadeIntensity());

        config.setCornerBLEnabled(req.cornerBLEnabled());
        config.setCornerBLImageUrl(req.cornerBLImageUrl());
        config.setCornerBLSize(req.cornerBLSize());
        config.setCornerBLFadeIntensity(req.cornerBLFadeIntensity());

        config.setCornerBREnabled(req.cornerBREnabled());
        config.setCornerBRImageUrl(req.cornerBRImageUrl());
        config.setCornerBRSize(req.cornerBRSize());
        config.setCornerBRFadeIntensity(req.cornerBRFadeIntensity());

        config.setTheme(req.theme());

        return repository.save(config);
    }
}
