package com.hackathon.sentiment.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Entity
public class SentimentLog {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String text;
    private String prevision;
    private double probabilidad;
    private LocalDateTime fecha;
}
