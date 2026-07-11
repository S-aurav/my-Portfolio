package com.saurav.hq.modules.notesconfig;

import com.saurav.hq.common.BaseEntity;
import jakarta.persistence.*;

@Entity
@Table(name = "notes_page_config")
public class NotesPageConfig extends BaseEntity {

    @Id
    private Long id = 1L; // Singleton — always ID = 1

    // ── Background bleed ─────────────────────────────────────────────────
    private boolean bgEnabled = false;
    private String bgImageUrl;
    private int bgOpacity = 15; // 0-100

    // ── Hero strip ───────────────────────────────────────────────────────
    private boolean heroEnabled = false;
    private String heroImageUrl;
    private int heroHeight = 160; // px
    private Integer heroImageOpacity = 100; // 0-100

    // ── Sidebar art ──────────────────────────────────────────────────────
    private boolean sidebarImageEnabled = false;
    private String sidebarImageUrl;
    private int sidebarImageOpacity = 30; // 0-100

    // ── Corner: Top-Left ─────────────────────────────────────────────────
    private boolean cornerTLEnabled = false;
    private String cornerTLImageUrl;
    private int cornerTLSize = 300; // px
    private int cornerTLFadeIntensity = 60; // 0-100

    // ── Corner: Top-Right ────────────────────────────────────────────────
    private boolean cornerTREnabled = false;
    private String cornerTRImageUrl;
    private int cornerTRSize = 300;
    private int cornerTRFadeIntensity = 60;

    // ── Corner: Bottom-Left ──────────────────────────────────────────────
    private boolean cornerBLEnabled = false;
    private String cornerBLImageUrl;
    private int cornerBLSize = 300;
    private int cornerBLFadeIntensity = 60;

    // ── Corner: Bottom-Right ─────────────────────────────────────────────
    private boolean cornerBREnabled = false;
    private String cornerBRImageUrl;
    private int cornerBRSize = 300;
    private int cornerBRFadeIntensity = 60;

    // ── Theme ─────────────────────────────────────────────────────────────
    private String theme = "sky"; // sky | floral | forest | neutral

    // ── Constructors ─────────────────────────────────────────────────────
    public NotesPageConfig() {}

    // ── Getters & Setters ─────────────────────────────────────────────────

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public boolean isBgEnabled() {
        return bgEnabled;
    }

    public void setBgEnabled(boolean bgEnabled) {
        this.bgEnabled = bgEnabled;
    }

    public String getBgImageUrl() {
        return bgImageUrl;
    }

    public void setBgImageUrl(String bgImageUrl) {
        this.bgImageUrl = bgImageUrl;
    }

    public int getBgOpacity() {
        return bgOpacity;
    }

    public void setBgOpacity(int bgOpacity) {
        this.bgOpacity = bgOpacity;
    }

    public boolean isHeroEnabled() {
        return heroEnabled;
    }

    public void setHeroEnabled(boolean heroEnabled) {
        this.heroEnabled = heroEnabled;
    }

    public String getHeroImageUrl() {
        return heroImageUrl;
    }

    public void setHeroImageUrl(String heroImageUrl) {
        this.heroImageUrl = heroImageUrl;
    }

    public int getHeroHeight() {
        return heroHeight;
    }

    public void setHeroHeight(int heroHeight) {
        this.heroHeight = heroHeight;
    }

    public Integer getHeroImageOpacity() {
        return heroImageOpacity == null ? 100 : heroImageOpacity;
    }

    public void setHeroImageOpacity(Integer heroImageOpacity) {
        this.heroImageOpacity = heroImageOpacity;
    }

    public boolean isSidebarImageEnabled() {
        return sidebarImageEnabled;
    }

    public void setSidebarImageEnabled(boolean sidebarImageEnabled) {
        this.sidebarImageEnabled = sidebarImageEnabled;
    }

    public String getSidebarImageUrl() {
        return sidebarImageUrl;
    }

    public void setSidebarImageUrl(String sidebarImageUrl) {
        this.sidebarImageUrl = sidebarImageUrl;
    }

    public int getSidebarImageOpacity() {
        return sidebarImageOpacity;
    }

    public void setSidebarImageOpacity(int sidebarImageOpacity) {
        this.sidebarImageOpacity = sidebarImageOpacity;
    }

    public boolean isCornerTLEnabled() {
        return cornerTLEnabled;
    }

    public void setCornerTLEnabled(boolean cornerTLEnabled) {
        this.cornerTLEnabled = cornerTLEnabled;
    }

    public String getCornerTLImageUrl() {
        return cornerTLImageUrl;
    }

    public void setCornerTLImageUrl(String cornerTLImageUrl) {
        this.cornerTLImageUrl = cornerTLImageUrl;
    }

    public int getCornerTLSize() {
        return cornerTLSize;
    }

    public void setCornerTLSize(int cornerTLSize) {
        this.cornerTLSize = cornerTLSize;
    }

    public int getCornerTLFadeIntensity() {
        return cornerTLFadeIntensity;
    }

    public void setCornerTLFadeIntensity(int cornerTLFadeIntensity) {
        this.cornerTLFadeIntensity = cornerTLFadeIntensity;
    }

    public boolean isCornerTREnabled() {
        return cornerTREnabled;
    }

    public void setCornerTREnabled(boolean cornerTREnabled) {
        this.cornerTREnabled = cornerTREnabled;
    }

    public String getCornerTRImageUrl() {
        return cornerTRImageUrl;
    }

    public void setCornerTRImageUrl(String cornerTRImageUrl) {
        this.cornerTRImageUrl = cornerTRImageUrl;
    }

    public int getCornerTRSize() {
        return cornerTRSize;
    }

    public void setCornerTRSize(int cornerTRSize) {
        this.cornerTRSize = cornerTRSize;
    }

    public int getCornerTRFadeIntensity() {
        return cornerTRFadeIntensity;
    }

    public void setCornerTRFadeIntensity(int cornerTRFadeIntensity) {
        this.cornerTRFadeIntensity = cornerTRFadeIntensity;
    }

    public boolean isCornerBLEnabled() {
        return cornerBLEnabled;
    }

    public void setCornerBLEnabled(boolean cornerBLEnabled) {
        this.cornerBLEnabled = cornerBLEnabled;
    }

    public String getCornerBLImageUrl() {
        return cornerBLImageUrl;
    }

    public void setCornerBLImageUrl(String cornerBLImageUrl) {
        this.cornerBLImageUrl = cornerBLImageUrl;
    }

    public int getCornerBLSize() {
        return cornerBLSize;
    }

    public void setCornerBLSize(int cornerBLSize) {
        this.cornerBLSize = cornerBLSize;
    }

    public int getCornerBLFadeIntensity() {
        return cornerBLFadeIntensity;
    }

    public void setCornerBLFadeIntensity(int cornerBLFadeIntensity) {
        this.cornerBLFadeIntensity = cornerBLFadeIntensity;
    }

    public boolean isCornerBREnabled() {
        return cornerBREnabled;
    }

    public void setCornerBREnabled(boolean cornerBREnabled) {
        this.cornerBREnabled = cornerBREnabled;
    }

    public String getCornerBRImageUrl() {
        return cornerBRImageUrl;
    }

    public void setCornerBRImageUrl(String cornerBRImageUrl) {
        this.cornerBRImageUrl = cornerBRImageUrl;
    }

    public int getCornerBRSize() {
        return cornerBRSize;
    }

    public void setCornerBRSize(int cornerBRSize) {
        this.cornerBRSize = cornerBRSize;
    }

    public int getCornerBRFadeIntensity() {
        return cornerBRFadeIntensity;
    }

    public void setCornerBRFadeIntensity(int cornerBRFadeIntensity) {
        this.cornerBRFadeIntensity = cornerBRFadeIntensity;
    }

    public String getTheme() {
        return theme;
    }

    public void setTheme(String theme) {
        this.theme = theme;
    }
}
