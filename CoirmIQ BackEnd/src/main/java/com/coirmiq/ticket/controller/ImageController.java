package com.coirmiq.ticket.controller;

import com.coirmiq.ticket.dto.response.ApiResponse;
import com.coirmiq.ticket.service.ImageService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@Slf4j
@RestController
@RequestMapping("/api/v1/images")
@RequiredArgsConstructor
public class ImageController {

    private final ImageService imageService;

    @GetMapping("/signature")
    @PreAuthorize("hasAnyRole('HOST', 'ADMIN')")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getSignature(
            @RequestParam(defaultValue = "ticket_events") String folder) {
        
        log.info("Generating Cloudinary signature for folder: {}", folder);
        Map<String, Object> signatureData = imageService.generateCloudinarySignature(folder);
        
        return ResponseEntity.ok(ApiResponse.success(signatureData, "Signature generated successfully"));
    }
}