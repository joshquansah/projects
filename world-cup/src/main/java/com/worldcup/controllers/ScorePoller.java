package com.worldcup.controllers;


import com.worldcup.entities.Match;
import com.worldcup.repositories.MatchRepository;
import com.worldcup.entities.MatchResponse;
import com.worldcup.services.SportsApiClient;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.util.List;


@Component
@EnableScheduling
public class ScorePoller {
    @Autowired
    private SportsApiClient sportsApiClient;

    @Autowired
    private MatchRepository matchRepository;

    @Scheduled(fixedRate = 30000)
    public void pollScores(){
        System.out.println("polling...");
        try{
            MatchResponse response = sportsApiClient.fetchLiveMatches();
            System.out.println(response.response().size());

        List<Match> matches = response.response().stream()
                        .map(fw -> {Match m = new Match();
                        m.setFixtureId(fw.fixture().id());
                        m.setHomeTeam(fw.teams().home().name());
                        m.setAwayTeam(fw.teams().away().name());
                        m.setHomeScore(fw.goals().home());
                        m.setAwayScore(fw.goals().away());
                        m.setStatus(fw.fixture().status().shortStatus());
                        m.setElapsed(fw.fixture().status().elapsed());
                        return m;
                        }).toList();
        matchRepository.saveAll(matches);
        } catch (Exception e) {
            System.err.println("poll failed: " + e.getMessage());
        }
    }


}

