package com.worldcup.services;

import com.worldcup.entities.MatchResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.HttpHeaders;




@Component
public class SportsApiClient {
    @Value("${api.football.key}")
    private String apiKey;
    private final RestTemplate restTemplate = new RestTemplate();




    public MatchResponse fetchLiveMatches() {
        HttpHeaders headers = new HttpHeaders();
        headers.set("x-apisports-key", apiKey);
        String url = "https://v3.football.api-sports.io/fixtures?league=39&season=2024";

        HttpEntity<Void> entity = new HttpEntity<>(headers);
        ResponseEntity<MatchResponse> response = restTemplate.exchange(
                url,
                HttpMethod.GET,
                entity,
                MatchResponse.class);
        return response.getBody();
    }
}
