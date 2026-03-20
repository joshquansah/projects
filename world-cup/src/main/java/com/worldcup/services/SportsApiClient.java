package com.worldcup.services;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.worldcup.entities.MatchResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.HttpHeaders;
import tools.jackson.databind.ObjectMapper;


@Component
public class SportsApiClient {
    @Value("${api.football.key}")
    private String apiKey;
    private final RestTemplate restTemplate = new RestTemplate();




    public MatchResponse fetchLiveMatches(String season) throws JsonProcessingException {
        HttpHeaders headers = new HttpHeaders();
        headers.set("x-apisports-key", apiKey);
        String url = "https://v3.football.api-sports.io/fixtures?league=39&season=" + season;

        HttpEntity<Void> entity = new HttpEntity<>(headers);
        ResponseEntity<String> raw = restTemplate.exchange(
                url,
                HttpMethod.GET,
                entity,
                String.class);
        System.out.println("Raw response: " + raw.getBody());
        return new ObjectMapper().readValue(raw.getBody(), MatchResponse.class);
    }
}
