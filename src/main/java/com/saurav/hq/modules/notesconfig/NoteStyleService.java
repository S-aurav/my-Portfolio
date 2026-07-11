package com.saurav.hq.modules.notesconfig;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class NoteStyleService {

    private final NoteStyleRepository repository;

    public NoteStyleService(NoteStyleRepository repository) {
        this.repository = repository;
    }

    @Transactional(readOnly = true)
    public List<NoteStyle> getAllStyles() {
        return repository.findAll();
    }

    @Transactional(readOnly = true)
    public NoteStyle getStyleById(String id) {
        return repository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Style Profile not found with id: " + id));
    }

    public NoteStyle createStyle(NoteStyleRequest req) {
        NoteStyle style = new NoteStyle();
        updateEntityFromRequest(style, req);
        return repository.save(style);
    }

    public NoteStyle updateStyle(String id, NoteStyleRequest req) {
        NoteStyle style = getStyleById(id);
        updateEntityFromRequest(style, req);
        return repository.save(style);
    }

    public void deleteStyle(String id) {
        if (!repository.existsById(id)) {
            throw new IllegalArgumentException("Style Profile not found with id: " + id);
        }
        repository.deleteById(id);
    }

    private void updateEntityFromRequest(NoteStyle style, NoteStyleRequest req) {
        if (req.name() == null || req.name().isBlank()) {
            throw new IllegalArgumentException("Style name is required");
        }
        style.setName(req.name().trim());
        style.setBgEnabled(req.bgEnabled());
        style.setBgImageUrl(req.bgImageUrl());
        style.setBgOpacity(req.bgOpacity());

        style.setHeroEnabled(req.heroEnabled());
        style.setHeroImageUrl(req.heroImageUrl());
        style.setHeroImageOpacity(req.heroImageOpacity());

        style.setSidebarImageEnabled(req.sidebarImageEnabled());
        style.setSidebarImageUrl(req.sidebarImageUrl());
        style.setSidebarImageOpacity(req.sidebarImageOpacity());

        style.setCornerTLEnabled(req.cornerTLEnabled());
        style.setCornerTLImageUrl(req.cornerTLImageUrl());
        style.setCornerTLSize(req.cornerTLSize());
        style.setCornerTLFadeIntensity(req.cornerTLFadeIntensity());

        style.setCornerTREnabled(req.cornerTREnabled());
        style.setCornerTRImageUrl(req.cornerTRImageUrl());
        style.setCornerTRSize(req.cornerTRSize());
        style.setCornerTRFadeIntensity(req.cornerTRFadeIntensity());

        style.setCornerBLEnabled(req.cornerBLEnabled());
        style.setCornerBLImageUrl(req.cornerBLImageUrl());
        style.setCornerBLSize(req.cornerBLSize());
        style.setCornerBLFadeIntensity(req.cornerBLFadeIntensity());

        style.setCornerBREnabled(req.cornerBREnabled());
        style.setCornerBRImageUrl(req.cornerBRImageUrl());
        style.setCornerBRSize(req.cornerBRSize());
        style.setCornerBRFadeIntensity(req.cornerBRFadeIntensity());

        style.setTheme(req.theme() != null ? req.theme().trim() : "sky");
    }
}
