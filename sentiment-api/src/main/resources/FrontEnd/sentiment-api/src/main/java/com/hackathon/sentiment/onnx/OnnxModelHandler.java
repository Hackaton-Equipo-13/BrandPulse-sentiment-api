package com.hackathon.sentiment.onnx;

import ai.onnxruntime.OnnxTensor;
import ai.onnxruntime.OrtEnvironment;
import ai.onnxruntime.OrtSession;
import ai.onnxruntime.OrtException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.context.annotation.Profile;

import jakarta.annotation.PostConstruct;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.Collections;
import java.util.Map;

@Component
public class OnnxModelHandler {
    private OrtEnvironment env;
    private OrtSession session;

    @Value("${onnx.model.path:model/sentiment_pipeline.onnx}")
    private String modelPath;

    @Value("${onnx.simulation:false}")
    private boolean simulation;

    @PostConstruct
    public void init() {
        if (simulation) {
            // Modo simulación, no carga modelo
            return;
        }
        try {
            env = OrtEnvironment.getEnvironment();
            byte[] modelBytes = Files.readAllBytes(Paths.get(modelPath));
            session = env.createSession(modelBytes);
        } catch (Exception e) {
            throw new RuntimeException("No se pudo cargar el modelo ONNX", e);
        }
    }

    public float[] predict(String text) throws OrtException {
        if (simulation) {
            // Simulación: prioriza palabras negativas sobre positivas
            String lower = text.toLowerCase();
            if (lower.contains("malo") || lower.contains("horrible") || lower.contains("pésimo") || lower.contains("no recomiendo")) {
                return new float[]{0.1f};
            } else if (lower.contains("excelente") || lower.contains("encantó") || lower.contains("bueno") || (lower.contains("recomiendo") && !lower.contains("no recomiendo"))) {
                return new float[]{0.9f};
            } else {
                return new float[]{0.5f};
            }
        }
        // ...código real ONNX...
        OnnxTensor inputTensor = OnnxTensor.createTensor(env, new String[]{text});
        Map<String, OnnxTensor> inputs = Collections.singletonMap("input", inputTensor);
        OrtSession.Result result = session.run(inputs);
        float[] output = (float[]) result.get(0).getValue();
        inputTensor.close();
        result.close();
        return output;
    }
}
