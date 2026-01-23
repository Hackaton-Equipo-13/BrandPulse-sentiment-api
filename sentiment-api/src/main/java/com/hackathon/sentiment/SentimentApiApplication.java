package com.hackathon.sentiment;

import com.hackathon.sentiment.config.OnnxProperties;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@SpringBootApplication
@EnableJpaRepositories(basePackages = "com.hackathon.sentiment.repository")
@EnableConfigurationProperties(OnnxProperties.class)
public class SentimentApiApplication {

	public static void main(String[] args) {
		SpringApplication.run(SentimentApiApplication.class, args);
	}

}
