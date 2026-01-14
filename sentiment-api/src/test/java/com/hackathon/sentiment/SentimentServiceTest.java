package com.hackathon.sentiment;

import com.hackathon.sentiment.dto.SentimentRequest;
import com.hackathon.sentiment.dto.SentimentResponse;
import com.hackathon.sentiment.service.SentimentService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
public class SentimentServiceTest {

    @Autowired
    private SentimentService sentimentService;

    @Test
    void testPositivo() {
        SentimentRequest req = new SentimentRequest();
        req.setText("Me encantó el servicio, todo excelente y maravilloso");
        SentimentResponse resp = sentimentService.predict(req);

        assertEquals("POSITIVE", resp.getSentiment());
        assertTrue(resp.getScore() > 50);
        assertNotNull(resp.getBreakdown());
        assertTrue(resp.getBreakdown().getPositive() > resp.getBreakdown().getNegative());
        assertTrue(resp.getBreakdown().getPositive() > resp.getBreakdown().getNeutral());
    }

    @Test
    void testNegativo() {
        SentimentRequest req = new SentimentRequest();
        req.setText("Fue una experiencia terrible y muy mala, no lo recomiendo para nada");
        SentimentResponse resp = sentimentService.predict(req);

        assertEquals("NEGATIVE", resp.getSentiment());
        assertTrue(resp.getScore() > 50); // Score is confidence, can be high for strong negative
        assertNotNull(resp.getBreakdown());
        assertTrue(resp.getBreakdown().getNegative() > resp.getBreakdown().getPositive());
        assertTrue(resp.getBreakdown().getNegative() > resp.getBreakdown().getNeutral());
    }

    @Test
    void testNeutral() {
        SentimentRequest req = new SentimentRequest();
        req.setText("El servicio es regular.");
        SentimentResponse resp = sentimentService.predict(req);

        assertEquals("NEUTRAL", resp.getSentiment());
        assertNotNull(resp.getBreakdown());
    }
}

