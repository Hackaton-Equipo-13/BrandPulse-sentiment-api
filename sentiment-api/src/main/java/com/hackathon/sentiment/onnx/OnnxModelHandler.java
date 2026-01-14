package com.hackathon.sentiment.onnx;

import ai.onnxruntime.OnnxTensor;
import ai.onnxruntime.OrtEnvironment;
import ai.onnxruntime.OrtSession;
import ai.onnxruntime.OrtException;
import ai.onnxruntime.OnnxValue;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.InputStream;
import java.io.ByteArrayOutputStream;
import java.util.stream.StreamSupport;

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
            logger.info("   Inputs del modelo: {}", session.getInputInfo().keySet());
            logger.info("  Outputs del modelo: {}", session.getOutputInfo().keySet());
        } catch (Exception e) {
            throw new RuntimeException("No se pudo cargar el modelo ONNX", e);
        }
    }

    public float[][] predict(String text) throws OrtException {
        if (simulation) {
            logger.info("ONNX simulation for text: '{}'", text);
            // Simulate a slightly varied neutral response
            return new float[][]{{0.1f, 0.8f, 0.1f}};
        }
        if (session == null) {
            logger.error("ONNX session is not initialized. Check for errors during startup.");
            // Return a default neutral probability to avoid NullPointerException
            return new float[][]{{0.1f, 0.8f, 0.1f}};
        }

        logger.debug("Analizando texto: '{}'", text);
        OnnxTensor inputTensor = null;
        OrtSession.Result result = null;
        try {
            String inputName = session.getInputInfo().keySet().iterator().next();
            inputTensor = OnnxTensor.createTensor(env, new String[][]{{text}});
            Map<String, OnnxTensor> inputs = Collections.singletonMap(inputName, inputTensor);

            // Ejecuta el modelo
            result = session.run(inputs);
            logger.debug("El modelo ONNX se ejecutó correctamente.");

            // Itera sobre todas las salidas para depuración
            for (Map.Entry<String, OnnxValue> entry : result) {
                String outputName = entry.getKey();
                OnnxValue onnxValue = entry.getValue();
                Object value = onnxValue.getValue();
                String valueStr;
                if (value instanceof float[][]) {
                    valueStr = java.util.Arrays.deepToString((float[][]) value);
                } else if (value instanceof long[]) {
                    valueStr = java.util.Arrays.toString((long[]) value);
                } else {
                    valueStr = value.toString();
                }
                logger.info("Salida del modelo [{}]: Tipo: {}, Valor: {}", outputName, onnxValue.getInfo().toString(), valueStr);
            }

            // Intenta encontrar el tensor de probabilidades (float[][])
            java.util.Optional<float[][]> probabilities = java.util.Optional.empty();
            for (java.util.Map.Entry<String, OnnxValue> entry : result) {
                Object value = entry.getValue().getValue();
                if (value instanceof float[][]) {
                    probabilities = java.util.Optional.of((float[][]) value);
                    break;
                }
            }

            if (probabilities.isPresent()) {
                return probabilities.get();
            } else {
                throw new OrtException("No se encontró una salida de tipo float[][] (probabilidades) en el resultado del modelo.");
            }

        } catch (OrtException e) {
            // Re-throw OrtException specifically if we created it
            throw e;
        } catch (Exception e) {
            logger.error("Error durante la predicción de ONNX para el texto: '{}'", text, e);
            // Devuelve neutral en caso de error
            return new float[][]{{0.1f, 0.8f, 0.1f}};
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
