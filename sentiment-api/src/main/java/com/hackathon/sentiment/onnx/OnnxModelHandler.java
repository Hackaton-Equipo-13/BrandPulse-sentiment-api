package com.hackathon.sentiment.onnx;

import ai.onnxruntime.OnnxTensor;
import ai.onnxruntime.OrtEnvironment;
import ai.onnxruntime.OrtSession;
import ai.onnxruntime.OrtException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.InputStream;
import java.io.ByteArrayOutputStream;

import jakarta.annotation.PostConstruct;
import java.util.Collections;
import java.util.Map;

@Component
public class OnnxModelHandler {
    private static final Logger logger = LoggerFactory.getLogger(OnnxModelHandler.class);

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
            logger.info("⚠️ ONNX Model Handler está en modo simulación. No se cargará ningún modelo.");
            return;
        }
        try {
            env = OrtEnvironment.getEnvironment();
            InputStream modelStream = getClass().getClassLoader().getResourceAsStream(modelPath);
            if (modelStream == null) {
                throw new RuntimeException("No se pudo encontrar el modelo ONNX en la ruta del classpath: " + modelPath);
            }

            ByteArrayOutputStream buffer = new ByteArrayOutputStream();
            int nRead;
            byte[] data = new byte[1024];
            while ((nRead = modelStream.read(data, 0, data.length)) != -1) {
                buffer.write(data, 0, nRead);
            }

            session = env.createSession(buffer.toByteArray());
            logger.info("✅ El modelo ONNX se cargó correctamente desde: {}", modelPath);
        } catch (Exception e) {
            throw new RuntimeException("No se pudo cargar el modelo ONNX", e);
        }
    }

    public float[][] predict(String text) throws OrtException {
        OnnxTensor inputTensor = null;
        OrtSession.Result result = null;
        try {
            // El pipeline de ONNX espera un tensor de string para el input
            inputTensor = OnnxTensor.createTensor(env, new String[][]{{text}});
            Map<String, OnnxTensor> inputs = Collections.singletonMap("input_text", inputTensor);

            // Ejecuta el modelo
            result = session.run(inputs);

            // Procesa la salida, que puede tener múltiples tensores (label, probabilities)
            // Asumimos que el segundo output son las probabilidades
            OnnxTensor probabilitiesTensor = (OnnxTensor) result.get(1);
            return (float[][]) probabilitiesTensor.getValue();
        } finally {
            if (inputTensor != null) {
                inputTensor.close();
            }
            if (result != null) {
                result.close();
            }
        }
    }
}
