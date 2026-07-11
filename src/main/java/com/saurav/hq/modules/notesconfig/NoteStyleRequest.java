package com.saurav.hq.modules.notesconfig;

public record NoteStyleRequest(
        String name,
        boolean bgEnabled,
        String bgImageUrl,
        Integer bgOpacity,
        boolean heroEnabled,
        String heroImageUrl,
        Integer heroImageOpacity,
        boolean sidebarImageEnabled,
        String sidebarImageUrl,
        Integer sidebarImageOpacity,

        boolean cornerTLEnabled,
        String cornerTLImageUrl,
        Integer cornerTLSize,
        Integer cornerTLFadeIntensity,

        boolean cornerTREnabled,
        String cornerTRImageUrl,
        Integer cornerTRSize,
        Integer cornerTRFadeIntensity,

        boolean cornerBLEnabled,
        String cornerBLImageUrl,
        Integer cornerBLSize,
        Integer cornerBLFadeIntensity,

        boolean cornerBREnabled,
        String cornerBRImageUrl,
        Integer cornerBRSize,
        Integer cornerBRFadeIntensity,

        String theme
) {}
