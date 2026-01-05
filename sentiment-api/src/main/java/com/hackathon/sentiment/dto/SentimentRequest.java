package com.hackathon.sentiment.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class SentimentRequest {
    @NotBlank(message = "El campo 'text' es obligatorio.")
    @Size(min = 3, message = "El texto debe tener al menos 3 caracteres.")
    private String text;
}
