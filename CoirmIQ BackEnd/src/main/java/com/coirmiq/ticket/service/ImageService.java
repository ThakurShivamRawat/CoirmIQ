package com.coirmiq.ticket.service;

import com.cloudinary.Cloudinary;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class ImageService {

    private final Cloudinary cloudinary;

    @Value("${cloudinary.api-key}")
    private String apiKey;

    @Value("${cloudinary.api-secret}")
    private String apiSecret;

    private final List<String> ALLOWED_FOLDERS = List.of(
            "ticket_events",
            "ticket_venues",
            "ticket_categories"
    );

    public Map<String, Object> generateCloudinarySignature(String folderName) {
        if (!ALLOWED_FOLDERS.contains(folderName)) {
            throw new IllegalArgumentException("Invalid target folder for image upload.");
        }

        long timestamp = System.currentTimeMillis() / 1000L;
        Map<String, Object> paramsToSign = new HashMap<>();
        paramsToSign.put("timestamp", timestamp);
        paramsToSign.put("folder", folderName);

        String signature = cloudinary.apiSignRequest(paramsToSign, apiSecret);

        Map<String, Object> signatureData = new HashMap<>();
        signatureData.put("signature", signature);
        signatureData.put("timestamp", timestamp);
        signatureData.put("api_key", apiKey);
        signatureData.put("cloud_name", cloudinary.config.cloudName);
        signatureData.put("folder", folderName); 

        return signatureData;
    }
}