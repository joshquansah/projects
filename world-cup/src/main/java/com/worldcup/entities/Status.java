package com.worldcup.entities;

import com.fasterxml.jackson.annotation.JsonProperty;

public record Status(@JsonProperty("short") String shortStatus, Integer elapsed) {
}
