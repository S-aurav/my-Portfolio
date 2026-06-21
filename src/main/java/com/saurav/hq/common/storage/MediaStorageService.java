package com.saurav.hq.common.storage;

import org.springframework.web.multipart.MultipartFile;

public interface MediaStorageService {
    /**
     * Uploads a file and returns its public accessible URL.
     */
    String uploadFile(MultipartFile file);
}
