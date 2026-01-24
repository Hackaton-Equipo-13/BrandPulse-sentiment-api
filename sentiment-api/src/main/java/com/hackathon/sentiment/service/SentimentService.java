package com.hackathon.sentiment.service;

import com.hackathon.sentiment.dto.UrlSentimentRequest;
import com.hackathon.sentiment.dto.SentimentRequest;
import com.hackathon.sentiment.dto.SentimentResponse;
import com.hackathon.sentiment.dto.Breakdown;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.springframework.stereotype.Service;
import com.hackathon.sentiment.onnx.OnnxModelHandler;
import com.hackathon.sentiment.entity.SentimentLog;
import com.hackathon.sentiment.repository.SentimentLogRepository;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.transaction.annotation.Transactional;

import java.io.IOException;
import java.time.LocalDateTime;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardOpenOption;
import java.nio.charset.StandardCharsets;
import java.util.Base64;
import java.util.List;
import java.util.Objects;
import java.util.Arrays;

import ai.onnxruntime.OrtException;

@Service
public class SentimentService {
    private static final Logger logger = LoggerFactory.getLogger(SentimentService.class);

    private final OnnxModelHandler onnxModelHandler;
    private final SentimentLogRepository sentimentLogRepository;

    private static final double NEUTRAL_THRESHOLD = 0.2; // Define a threshold for neutrality


    public SentimentService(OnnxModelHandler onnxModelHandler, SentimentLogRepository sentimentLogRepository) {
        this.onnxModelHandler = onnxModelHandler;
        this.sentimentLogRepository = sentimentLogRepository;
    }

    public SentimentResponse predict(SentimentRequest request) {
        String sentiment = "NEUTRAL";
        double probability = 0.5;
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
                System.err.println("Error decoding uploaded file: " + e.getMessage());
                text = "";
            }
        }

        Breakdown breakdown = new Breakdown(0.0, 1.0, 0.0); // Default to neutral

        try {
            if (text == null) {
                text = "";
            }
            float[][] output = onnxModelHandler.predict(text);

            if (output != null && output.length > 0 && output[0].length == 2) {
                float[] allProbabilities = output[0]; // [Negative, Positive]
                float negProb = allProbabilities[0];
                float posProb = allProbabilities[1];

                logger.info("Raw probabilities from ONNX model: [Negative: {}, Positive: {}]", negProb, posProb);

                double neutralProb = 1.0 - (negProb + posProb);


                if (Math.abs(posProb - negProb) < NEUTRAL_THRESHOLD) {
                    sentiment = "NEUTRAL";
                    probability = Math.max(posProb, negProb); // Use higher of two for neutral confidence
                } else if (posProb > negProb) {
                    sentiment = "POSITIVE";
                    probability = posProb;
                } else {
                    sentiment = "NEGATIVE";
                    probability = negProb;
                }
                
                breakdown = new Breakdown(posProb, neutralProb, negProb);

            } else {
                logger.warn("ONNX model output is not in the expected format (float[1][2]). Received: {}", Arrays.deepToString(output));
            }
        } catch (OrtException e) {
            System.err.println("Error executing ONNX model: " + e.getMessage());
        }

        int score = (int) Math.round(probability * 100);
        
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
        logger.info("  -> Breakdown: Positive={}, Neutral={}, Negative={}",
                String.format("%.4f", breakdown.getPositive()),
                String.format("%.4f", breakdown.getNeutral()),
                String.format("%.4f", breakdown.getNegative()));

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
            SentimentRequest sentimentRequest = new SentimentRequest();
            sentimentRequest.setText("");
            return predict(sentimentRequest);
        }
    }

    public List<SentimentLog> getHistory() {
        return sentimentLogRepository.findAllByOrderByFechaDesc();
    }

    @Transactional
    public void clearHistory() {
        sentimentLogRepository.deleteAll();
        logger.info("Sentiment history cleared from database.");
    }
}
