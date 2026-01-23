package com.hackathon.sentiment;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@SpringBootApplication
@EnableJpaRepositories(basePackages = "com.hackathon.sentiment.repository")
public class SentimentApiApplication {

	public static void main(String[] args) {
		SpringApplication.run(SentimentApiApplication.class, args);
	}

}
