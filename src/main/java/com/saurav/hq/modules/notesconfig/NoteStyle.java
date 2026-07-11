package com.saurav.hq.modules.notesconfig;

import com.saurav.hq.common.BaseEntity;
import jakarta.persistence.*;

@Entity
@Table(name = "note_styles")
public class NoteStyle extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @Column(nullable = false)
    private String name;

    private Boolean bgEnabled = false;
    private String bgImageUrl;
    private Integer bgOpacity = 15;

    private Boolean heroEnabled = false;
    private String heroImageUrl;
    private Integer heroImageOpacity = 100;

    private Boolean sidebarImageEnabled = false;
    private String sidebarImageUrl;
    private Integer sidebarImageOpacity = 30;

    private Boolean cornerTLEnabled = false;
    private String cornerTLImageUrl;
    private Integer cornerTLSize = 300;
    private Integer cornerTLFadeIntensity = 60;

    private Boolean cornerTREnabled = false;
    private String cornerTRImageUrl;
    private Integer cornerTRSize = 300;
    private Integer cornerTRFadeIntensity = 60;

    private Boolean cornerBLEnabled = false;
    private String cornerBLImageUrl;
    private Integer cornerBLSize = 300;
    private Integer cornerBLFadeIntensity = 60;

    private Boolean cornerBREnabled = false;
    private String cornerBRImageUrl;
    private Integer cornerBRSize = 300;
    private Integer cornerBRFadeIntensity = 60;

    private String theme = "sky";

    // ── Constructors ─────────────────────────────────────────────────────────
    public NoteStyle() {}

    // ── Getters & Setters ────────────────────────────────────────────────────
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public Boolean getBgEnabled() { return bgEnabled == null ? false : bgEnabled; }
    public void setBgEnabled(Boolean bgEnabled) { this.bgEnabled = bgEnabled; }
    public String getBgImageUrl() { return bgImageUrl; }
    public void setBgImageUrl(String bgImageUrl) { this.bgImageUrl = bgImageUrl; }
    public Integer getBgOpacity() { return bgOpacity == null ? 15 : bgOpacity; }
    public void setBgOpacity(Integer bgOpacity) { this.bgOpacity = bgOpacity; }

    public Boolean getHeroEnabled() { return heroEnabled == null ? false : heroEnabled; }
    public void setHeroEnabled(Boolean heroEnabled) { this.heroEnabled = heroEnabled; }
    public String getHeroImageUrl() { return heroImageUrl; }
    public void setHeroImageUrl(String heroImageUrl) { this.heroImageUrl = heroImageUrl; }
    public Integer getHeroImageOpacity() { return heroImageOpacity == null ? 100 : heroImageOpacity; }
    public void setHeroImageOpacity(Integer heroImageOpacity) { this.heroImageOpacity = heroImageOpacity; }

    public Boolean getSidebarImageEnabled() { return sidebarImageEnabled == null ? false : sidebarImageEnabled; }
    public void setSidebarImageEnabled(Boolean sidebarImageEnabled) { this.sidebarImageEnabled = sidebarImageEnabled; }
    public String getSidebarImageUrl() { return sidebarImageUrl; }
    public void setSidebarImageUrl(String sidebarImageUrl) { this.sidebarImageUrl = sidebarImageUrl; }
    public Integer getSidebarImageOpacity() { return sidebarImageOpacity == null ? 30 : sidebarImageOpacity; }
    public void setSidebarImageOpacity(Integer sidebarImageOpacity) { this.sidebarImageOpacity = sidebarImageOpacity; }

    public Boolean getCornerTLEnabled() { return cornerTLEnabled == null ? false : cornerTLEnabled; }
    public void setCornerTLEnabled(Boolean cornerTLEnabled) { this.cornerTLEnabled = cornerTLEnabled; }
    public String getCornerTLImageUrl() { return cornerTLImageUrl; }
    public void setCornerTLImageUrl(String cornerTLImageUrl) { this.cornerTLImageUrl = cornerTLImageUrl; }
    public Integer getCornerTLSize() { return cornerTLSize == null ? 300 : cornerTLSize; }
    public void setCornerTLSize(Integer cornerTLSize) { this.cornerTLSize = cornerTLSize; }
    public Integer getCornerTLFadeIntensity() { return cornerTLFadeIntensity == null ? 60 : cornerTLFadeIntensity; }
    public void setCornerTLFadeIntensity(Integer cornerTLFadeIntensity) { this.cornerTLFadeIntensity = cornerTLFadeIntensity; }

    public Boolean getCornerTREnabled() { return cornerTREnabled == null ? false : cornerTREnabled; }
    public void setCornerTREnabled(Boolean cornerTREnabled) { this.cornerTREnabled = cornerTREnabled; }
    public String getCornerTRImageUrl() { return cornerTRImageUrl; }
    public void setCornerTRImageUrl(String cornerTRImageUrl) { this.cornerTRImageUrl = cornerTRImageUrl; }
    public Integer getCornerTRSize() { return cornerTRSize == null ? 300 : cornerTRSize; }
    public void setCornerTRSize(Integer cornerTRSize) { this.cornerTRSize = cornerTRSize; }
    public Integer getCornerTRFadeIntensity() { return cornerTRFadeIntensity == null ? 60 : cornerTRFadeIntensity; }
    public void setCornerTRFadeIntensity(Integer cornerTRFadeIntensity) { this.cornerTRFadeIntensity = cornerTRFadeIntensity; }

    public Boolean getCornerBLEnabled() { return cornerBLEnabled == null ? false : cornerBLEnabled; }
    public void setCornerBLEnabled(Boolean cornerBLEnabled) { this.cornerBLEnabled = cornerBLEnabled; }
    public String getCornerBLImageUrl() { return cornerBLImageUrl; }
    public void setCornerBLImageUrl(String cornerBLImageUrl) { this.cornerBLImageUrl = cornerBLImageUrl; }
    public Integer getCornerBLSize() { return cornerBLSize == null ? 300 : cornerBLSize; }
    public void setCornerBLSize(Integer cornerBLSize) { this.cornerBLSize = cornerBLSize; }
    public Integer getCornerBLFadeIntensity() { return cornerBLFadeIntensity == null ? 60 : cornerBLFadeIntensity; }
    public void setCornerBLFadeIntensity(Integer cornerBLFadeIntensity) { this.cornerBLFadeIntensity = cornerBLFadeIntensity; }

    public Boolean getCornerBREnabled() { return cornerBREnabled == null ? false : cornerBREnabled; }
    public void setCornerBREnabled(Boolean cornerBREnabled) { this.cornerBREnabled = cornerBREnabled; }
    public String getCornerBRImageUrl() { return cornerBRImageUrl; }
    public void setCornerBRImageUrl(String cornerBRImageUrl) { this.cornerBRImageUrl = cornerBRImageUrl; }
    public Integer getCornerBRSize() { return cornerBRSize == null ? 300 : cornerBRSize; }
    public void setCornerBRSize(Integer cornerBRSize) { this.cornerBRSize = cornerBRSize; }
    public Integer getCornerBRFadeIntensity() { return cornerBRFadeIntensity == null ? 60 : cornerBRFadeIntensity; }
    public void setCornerBRFadeIntensity(Integer cornerBRFadeIntensity) { this.cornerBRFadeIntensity = cornerBRFadeIntensity; }

    public String getTheme() { return theme == null ? "sky" : theme; }
    public void setTheme(String theme) { this.theme = theme; }
}
