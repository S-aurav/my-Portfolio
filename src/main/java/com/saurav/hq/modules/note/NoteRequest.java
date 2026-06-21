package com.saurav.hq.modules.note;

import com.saurav.hq.common.Visibility;

public record NoteRequest(
        String title,
        String content,
        String category,
        Visibility visibility
) {}
