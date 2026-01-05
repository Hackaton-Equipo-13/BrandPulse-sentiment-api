package com.hackathon.sentiment.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SentimentStatsResponse {
    private long total;
    private long positivos;
    private long negativos;
    private double porcentajePositivos;
    private double porcentajeNegativos;
}
