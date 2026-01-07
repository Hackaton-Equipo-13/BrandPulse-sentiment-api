package com.hackathon.sentiment.exception;

import com.hackathon.sentiment.dto.Breakdown;
import com.hackathon.sentiment.dto.SentimentResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.context.request.WebRequest;

@RestControllerAdvice
public class GlobalExceptionHandler {

    private static final Breakdown DEFAULT_BREAKDOWN = new Breakdown(0, 1, 0);

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<SentimentResponse> handleValidationException(MethodArgumentNotValidException ex, WebRequest request) {
        String errorMsg = ex.getBindingResult().getFieldError().getDefaultMessage();
        SentimentResponse response = new SentimentResponse("NEUTRAL", 0, errorMsg, errorMsg, errorMsg, DEFAULT_BREAKDOWN);
        return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<SentimentResponse> handleGeneralException(Exception ex, WebRequest request) {
        String msg = "Error interno del servidor";
        SentimentResponse response = new SentimentResponse("NEUTRAL", 0, msg, msg, msg, DEFAULT_BREAKDOWN);
        return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
    }
}
