package com.hackathon.sentiment.repository;

import com.hackathon.sentiment.entity.SentimentLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SentimentLogRepository extends JpaRepository<SentimentLog, Long> {
	long countByPrevision(String prevision);
}
