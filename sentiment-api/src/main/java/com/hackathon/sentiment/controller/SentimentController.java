package com.hackathon.sentiment.controller;

import com.hackathon.sentiment.dto.UrlSentimentRequest;
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

import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.slf4j.Slf4j;

@RestController
@RequestMapping("/api/sentiment")
@Slf4j
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

    @PostMapping("/url")
    public ResponseEntity<SentimentResponse> analyzeUrlSentiment(@Valid @RequestBody UrlSentimentRequest request) {
        SentimentResponse response = sentimentService.predictFromUrl(request);
        return ResponseEntity.ok(response);
    }

    // Endpoint para procesamiento por lote (CSV)
    @PostMapping(value = "/batch", consumes = "multipart/form-data")
    public ResponseEntity<List<SentimentResponse>> analyzeBatch(@RequestParam("file") MultipartFile file) {
        List<SentimentResponse> results = new ArrayList<>();
        String filename = file.getOriginalFilename() != null ? file.getOriginalFilename().toLowerCase() : "";
        log.info("Processing batch file: {}", filename); // Log filename
        log.debug("Filename: '{}', endsWith .csv: {}, endsWith .xlsx: {}, endsWith .json: {}",
                  filename, filename.endsWith(".csv"), filename.endsWith(".xlsx"), filename.endsWith(".json"));
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
                        Cell cell = row.getCell(0); // Get the first cell
                        if (cell != null) {
                            String text;
                            // Handle different cell types
                            switch (cell.getCellType()) {
                                case STRING:
                                    text = cell.getStringCellValue();
                                    break;
                                case NUMERIC:
                                    if (DateUtil.isCellDateFormatted(cell)) {
                                        text = cell.getDateCellValue().toString();
                                    } else {
                                        text = String.valueOf(cell.getNumericCellValue());
                                    }
                                    break;
                                case BOOLEAN:
                                    text = String.valueOf(cell.getBooleanCellValue());
                                    break;
                                case FORMULA:
                                    text = cell.getCellFormula(); // May need further evaluation
                                    break;
                                default:
                                    text = "";
                            }
                            text = text.trim(); // Trim whitespace
                            if (!text.isEmpty() && text.length() >= 3) { // Ensure text is not too short
                                SentimentRequest req = new SentimentRequest();
                                req.setText(text);
                                results.add(sentimentService.predict(req));
                            }
                        }
                    }
                }
            } else if (filename.endsWith(".json")) {
                ObjectMapper objectMapper = new ObjectMapper();
                // Expecting a JSON array of objects with a "text" or "comment" field
                List<java.util.Map<String, String>> texts = objectMapper.readValue(file.getInputStream(),
                        objectMapper.getTypeFactory().constructCollectionType(List.class, java.util.Map.class));
                for (java.util.Map<String, String> map : texts) {
                    String text = map.getOrDefault("text", map.getOrDefault("comment", ""));
                    text = text.trim();
                    if (!text.isEmpty() && text.length() >= 3) {
                        SentimentRequest req = new SentimentRequest();
                        req.setText(text);
                        results.add(sentimentService.predict(req));
                    }
                }
            } else {
                log.error("Unsupported file type for batch analysis: {}", filename); // Log unsupported file type
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new ArrayList<>());
            }
        } catch (Exception e) {
            log.error("Error during batch file processing for {}: {}", filename, e.getMessage(), e); // Log general exception
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new ArrayList<>());
        }
        return ResponseEntity.ok(results);
    }

    @GetMapping("/history")
    public ResponseEntity<List<com.hackathon.sentiment.entity.SentimentLog>> getHistory() {
        List<com.hackathon.sentiment.entity.SentimentLog> history = sentimentService.getHistory();
        return ResponseEntity.ok(history);
    }

    @GetMapping("/stats")
    public ResponseEntity<SentimentStatsResponse> getStats() {
        SentimentStatsResponse stats = sentimentStatsService.getStats();
        return ResponseEntity.ok(stats);
    }
}
