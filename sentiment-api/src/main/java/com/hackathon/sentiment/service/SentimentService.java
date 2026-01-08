package com.hackathon.sentiment.service;

import com.hackathon.sentiment.dto.UrlSentimentRequest;
import com.hackathon.sentiment.dto.SentimentRequest;
import com.hackathon.sentiment.dto.SentimentResponse;
import com.hackathon.sentiment.dto.Breakdown;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.springframework.stereotype.Service;
import com.hackathon.sentiment.onnx.OnnxModelHandler;
import org.springframework.beans.factory.annotation.Autowired;
import com.hackathon.sentiment.entity.SentimentLog;
import com.hackathon.sentiment.repository.SentimentLogRepository;

import java.io.IOException;
import java.time.LocalDateTime;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardOpenOption;
import java.nio.charset.StandardCharsets;
import java.util.Base64;
import java.util.List;

import ai.onnxruntime.OrtException;

@Service
public class SentimentService {
    private final OnnxModelHandler onnxModelHandler;
    private final SentimentLogRepository sentimentLogRepository;

    @Autowired
    public SentimentService(OnnxModelHandler onnxModelHandler, SentimentLogRepository sentimentLogRepository) {
        this.onnxModelHandler = onnxModelHandler;
        this.sentimentLogRepository = sentimentLogRepository;
    }

    public SentimentResponse predict(SentimentRequest request) {
        String sentiment = "NEUTRAL";
        double probability = 0.5; // Probabilidad neutral por defecto
        String text = request.getText();

        // Handle uploaded base64 files with the prefix format:
        // __BASE64_FILE__<filename>\n<base64data>
        if (text != null && text.startsWith("__BASE64_FILE__")) {
            try {
                int nl = text.indexOf('\n');
                String header = nl > 0 ? text.substring(0, nl) : text;
                String filename = header.substring("__BASE64_FILE__".length());
                String base64 = nl > 0 ? text.substring(nl + 1) : "";
                byte[] bytes = Base64.getDecoder().decode(base64);

                // Try to interpret as UTF-8 text; if it's readable, use it as input text.
                String asText = new String(bytes, StandardCharsets.UTF_8).trim();
                if (asText.length() >= 3) {
                    text = asText;
                } else {
                    // Persist the binary to a temp file so it can be inspected/processed later.
                    Path tmp = Files.createTempDirectory("sentiment_upload_");
                    Path out = tmp.resolve(filename);
                    Files.write(out, bytes, StandardOpenOption.CREATE, StandardOpenOption.WRITE);
                    text = String.format("[BINARY_FILE:%s SAVED:%s]", filename, out.toString());
                }
            } catch (Exception e) {
                // If anything goes wrong decoding, fall back to an empty placeholder
                System.err.println("Error decoding uploaded file: " + e.getMessage());
                text = "";
            }
        }

        try {
            float[] output = onnxModelHandler.predict(text);
            if (output != null && output.length > 0) {
                probability = output[0];
                // Rango neutro más pequeño para mayor precisión
                if (probability > 0.55) {
                    sentiment = "POSITIVE";
                } else if (probability < 0.45) {
                    sentiment = "NEGATIVE";
                } else {
                    sentiment = "NEUTRAL";
                }
            }
        } catch (OrtException e) {
            // Log the error, but we can still return a neutral response
             System.err.println("Error executing ONNX model: " + e.getMessage());
        }

        int score = (int) Math.round(probability * 100);

        // Create a simplified breakdown
        Breakdown breakdown;
        if ("POSITIVE".equals(sentiment)) {
            breakdown = new Breakdown(probability, 1.0 - probability, 0);
        } else if ("NEGATIVE".equals(sentiment)) {
            breakdown = new Breakdown(0, 1.0 - probability, probability);
        } else {
            breakdown = new Breakdown(0, 1.0, 0);
        }
        
        // Placeholder snippets - using full text for now
        String snippet = text.substring(0, Math.min(text.length(), 120));

        // Save the log to the database
        SentimentLog log = new SentimentLog();
        log.setText(text);
        log.setPrevision(sentiment);
        log.setProbabilidad(probability);
        log.setFecha(LocalDateTime.now());
        sentimentLogRepository.save(log);

        return new SentimentResponse(sentiment, score, snippet, snippet, snippet, breakdown);
    }

    public SentimentResponse predictFromUrl(UrlSentimentRequest request) {
        try {
            Document doc = Jsoup.connect(request.getUrl()).get();
            String text = doc.body().text();
            SentimentRequest sentimentRequest = new SentimentRequest();
            sentimentRequest.setText(text);
            return predict(sentimentRequest);
        } catch (IOException e) {
            System.err.println("Error fetching URL: " + e.getMessage());
            // Consider a more specific error response
            SentimentRequest sentimentRequest = new SentimentRequest();
            sentimentRequest.setText(""); // Empty text for error case
            return predict(sentimentRequest);
        }
    }

    public List<SentimentLog> getHistory() {
        return sentimentLogRepository.findAllByOrderByFechaDesc();
    }
}
