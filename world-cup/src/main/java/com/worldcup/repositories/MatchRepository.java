package com.worldcup.repositories;

import com.worldcup.entities.Match;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface MatchRepository extends JpaRepository<Match, Long> {
    List<Match> findByStatus(String status);
}
