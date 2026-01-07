package com.hackathon.sentiment.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SentimentResponse {
    private String sentiment;
    private int score;
    private String bestSnippet;
    private String worstSnippet;
    private String randomNeutral;
    private Breakdown breakdown;
}
