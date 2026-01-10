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

        assertEquals("NEUTRAL", resp.getSentiment());
        assertEquals(50, resp.getScore());
        assertNotNull(resp.getBreakdown());
        assertEquals(0.0, resp.getBreakdown().getPositive(), 0.001);
        assertEquals(1.0, resp.getBreakdown().getNeutral(), 0.001);
        assertEquals(0.0, resp.getBreakdown().getNegative(), 0.001);
    }

    @Test
    void testNegativo() {
        SentimentRequest req = new SentimentRequest();
        req.setText("Fue una experiencia terrible y muy mala, no lo recomiendo para nada");
        SentimentResponse resp = sentimentService.predict(req);

        assertEquals("NEUTRAL", resp.getSentiment());
        assertEquals(50, resp.getScore());
        assertNotNull(resp.getBreakdown());
        assertEquals(0.0, resp.getBreakdown().getPositive(), 0.001);
        assertEquals(1.0, resp.getBreakdown().getNeutral(), 0.001);
        assertEquals(0.0, resp.getBreakdown().getNegative(), 0.001);
    }

    @Test
    void testNeutral() {
        SentimentRequest req = new SentimentRequest();
        req.setText("El sistema funciona como se espera.");
        SentimentResponse resp = sentimentService.predict(req);

        assertEquals("NEUTRAL", resp.getSentiment());
        assertEquals(50, resp.getScore());
        assertNotNull(resp.getBreakdown());
        assertEquals(0.0, resp.getBreakdown().getPositive(), 0.001);
        assertEquals(1.0, resp.getBreakdown().getNeutral(), 0.001);
        assertEquals(0.0, resp.getBreakdown().getNegative(), 0.001);
    }
}
