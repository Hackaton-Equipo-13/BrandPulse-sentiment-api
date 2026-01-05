package com.hackathon.sentiment.controller;

import com.hackathon.sentiment.dto.SentimentRequest;
import com.hackathon.sentiment.dto.SentimentResponse;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.List;
import com.hackathon.sentiment.dto.SentimentStatsResponse;
import com.hackathon.sentiment.service.SentimentStatsService;

@RestController
@RequestMapping("/api/sentiment")
public class SentimentController {
    private final com.hackathon.sentiment.service.SentimentService sentimentService;
    private final SentimentStatsService sentimentStatsService;

    public SentimentController(com.hackathon.sentiment.service.SentimentService sentimentService, SentimentStatsService sentimentStatsService) {
        this.sentimentService = sentimentService;
        this.sentimentStatsService = sentimentStatsService;
    }


    @PostMapping
    public ResponseEntity<SentimentResponse> analyzeSentiment(@Valid @RequestBody SentimentRequest request) {
        SentimentResponse response = sentimentService.predict(request);
        return ResponseEntity.ok(response);
    }

    // Endpoint para procesamiento por lote (CSV)
    @PostMapping(value = "/batch", consumes = "multipart/form-data")
    public ResponseEntity<List<SentimentResponse>> analyzeBatch(@RequestParam("file") MultipartFile file) {
        List<SentimentResponse> results = new ArrayList<>();
        String filename = file.getOriginalFilename() != null ? file.getOriginalFilename().toLowerCase() : "";
        try {
            if (filename.endsWith(".csv")) {
                try (BufferedReader reader = new BufferedReader(new InputStreamReader(file.getInputStream(), StandardCharsets.UTF_8))) {
                    String line;
                    boolean first = true;
                    while ((line = reader.readLine()) != null) {
                        if (first) { first = false; continue; } // Saltar encabezado
                        String text = line.split(",")[0].replaceAll("\"", "").trim();
                        if (!text.isEmpty() && text.length() >= 3) {
                            SentimentRequest req = new SentimentRequest();
                            req.setText(text);
                            results.add(sentimentService.predict(req));
                        }
                    }
                }
            } else if (filename.endsWith(".xlsx")) {
                try (Workbook workbook = new XSSFWorkbook(file.getInputStream())) {
                    Sheet sheet = workbook.getSheetAt(0);
                    boolean first = true;
                    for (Row row : sheet) {
                        if (first) { first = false; continue; } // Saltar encabezado
                        Cell cell = row.getCell(0);
                        if (cell != null) {
                            String text = cell.getStringCellValue().trim();
                            if (!text.isEmpty() && text.length() >= 3) {
                                SentimentRequest req = new SentimentRequest();
                                req.setText(text);
                                results.add(sentimentService.predict(req));
                            }
                        }
                    }
                }
            } else {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new ArrayList<>());
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new ArrayList<>());
        }
        return ResponseEntity.ok(results);
    }

    @GetMapping("/stats")
    public ResponseEntity<SentimentStatsResponse> getStats() {
        SentimentStatsResponse stats = sentimentStatsService.getStats();
        return ResponseEntity.ok(stats);
    }
}
