package com.hackathon.sentiment.service;

import com.hackathon.sentiment.dto.SentimentStatsResponse;
import com.hackathon.sentiment.repository.SentimentLogRepository;
import org.springframework.stereotype.Service;

@Service
public class SentimentStatsService {
    private final SentimentLogRepository sentimentLogRepository;

    public SentimentStatsService(SentimentLogRepository sentimentLogRepository) {
        this.sentimentLogRepository = sentimentLogRepository;
    }

    public SentimentStatsResponse getStats() {
        long total = sentimentLogRepository.count();
        long positivos = sentimentLogRepository.countByPrevision("Positivo");
        long negativos = sentimentLogRepository.countByPrevision("Negativo");
        double porcentajePositivos = total > 0 ? (double) positivos / total * 100 : 0;
        double porcentajeNegativos = total > 0 ? (double) negativos / total * 100 : 0;
        return new SentimentStatsResponse(total, positivos, negativos, porcentajePositivos, porcentajeNegativos);
    }
}
