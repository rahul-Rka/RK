package com.edutech.logisticsmanagementandtrackingsystem.service;

import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class PendingLoginStore {

    // challengeId -> pending login
    private final Map<String, PendingLogin> store = new ConcurrentHashMap<>();

    public void put(String challengeId, String token, Object role) {
        store.put(challengeId, new PendingLogin(token, role, Instant.now()));
    }

    public PendingLogin get(String challengeId) {
        return store.get(challengeId);
    }

    public void remove(String challengeId) {
        store.remove(challengeId);
    }

    public static class PendingLogin {
        private final String token;
        private final Object role;
        private final Instant createdAt;

        public PendingLogin(String token, Object role, Instant createdAt) {
            this.token = token;
            this.role = role;
            this.createdAt = createdAt;
        }

        public String getToken() { return token; }
        public Object getRole() { return role; }
        public Instant getCreatedAt() { return createdAt; }
    }
}
