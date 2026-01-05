package com.hackathon.sentiment.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class Breakdown {
    private double positive;
    private double neutral;
    private double negative;
}
