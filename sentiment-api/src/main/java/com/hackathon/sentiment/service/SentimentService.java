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

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.IOException;
import java.time.LocalDateTime;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardOpenOption;
import java.nio.charset.StandardCharsets;
import java.util.Base64;
import java.util.List;
import java.util.Objects; // Import Objects for null check
import java.util.Arrays; // Re-import Arrays for logging float[]

import ai.onnxruntime.OrtException;

@Service
public class SentimentService {
    private static final Logger logger = LoggerFactory.getLogger(SentimentService.class);

    private final OnnxModelHandler onnxModelHandler;
    private final SentimentLogRepository sentimentLogRepository;

    public SentimentService(OnnxModelHandler onnxModelHandler, SentimentLogRepository sentimentLogRepository) {
        this.onnxModelHandler = onnxModelHandler;
        this.sentimentLogRepository = sentimentLogRepository;
    }

    public SentimentResponse predict(SentimentRequest request) {
        String sentiment = "NEUTRAL";
        double probability = 0.5; // Probabilidad neutral por defecto
        String text = request.getText();
        logger.info("Received sentiment analysis request for text: {}", text);

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

        float[] allProbabilities = new float[0];
        try {
            // Ensure text is not null before passing to ONNX model
            if (text == null) {
                text = ""; // Fallback to empty string if null
            }
            float[][] output = onnxModelHandler.predict(text);
            if (output != null && output.length > 0 && output[0].length == 3) { // Ensure we have 3 probabilities
                allProbabilities = output[0]; // Store all probabilities
                float[] probabilities = output[0];
                int maxIndex = 0;
                for (int i = 1; i < probabilities.length; i++) {
                    if (probabilities[i] > probabilities[maxIndex]) {
                        maxIndex = i;
                    }
                }

                probability = probabilities[maxIndex];
                switch (maxIndex) {
                    case 0:
                        sentiment = "NEGATIVE";
                        break;
                    case 1:
                        sentiment = "NEUTRAL";
                        break;
                    case 2:
                        sentiment = "POSITIVE";
                        break;
                    default:
                        sentiment = "NEUTRAL";
                        break;
                }
            }
        } catch (OrtException e) {
            // Log the error, but we can still return a neutral response
             System.err.println("Error executing ONNX model: " + e.getMessage());
        }

        int score = (int) Math.round(probability * 100);

        // Create a simplified breakdown using all probabilities
        Breakdown breakdown;
        if (allProbabilities.length == 3) {
            logger.info("Raw probabilities from ONNX model: {}", Arrays.toString(allProbabilities));
            // Assuming order: NEGATIVE, NEUTRAL, POSITIVE
            breakdown = new Breakdown(
                allProbabilities[2], // Positive
                allProbabilities[1], // Neutral
                allProbabilities[0]  // Negative
            );
        } else {
            // Fallback if probabilities are not as expected
            if ("POSITIVE".equals(sentiment)) {
                breakdown = new Breakdown(probability, 1.0 - probability, 0);
            } else if ("NEGATIVE".equals(sentiment)) {
                breakdown = new Breakdown(0, 1.0 - probability, probability);
            } else {
                breakdown = new Breakdown(0, 1.0, 0);
            }
        }
        
        // Placeholder snippets - using full text for now
        String snippet = (text != null) ? text.substring(0, Math.min(text.length(), 120)) : "";

        // Save the log to the database
        SentimentLog log = new SentimentLog();
        log.setText(Objects.requireNonNullElse(text, ""));
        log.setPrevision(sentiment);
        log.setProbabilidad(probability);
        log.setFecha(LocalDateTime.now());
        sentimentLogRepository.save(log);

        logger.info("Sentiment Analysis Result for text: '{}'", text);
        logger.info("  -> Predicted Sentiment: {}", sentiment);
        logger.info("  -> Score: {}", score);
        if (breakdown != null) {
            logger.info("  -> Breakdown: Positive={}, Neutral={}, Negative={}",
                    String.format("%.4f", breakdown.getPositive()),
                    String.format("%.4f", breakdown.getNeutral()),
                    String.format("%.4f", breakdown.getNegative()));
        }

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
