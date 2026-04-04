package com.edutech.logisticsmanagementandtrackingsystem.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import java.security.SecureRandom;
import java.time.Instant;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class GmailServices {

    private final JavaMailSender mailSender;
    private final SecureRandom random = new SecureRandom();

    @Value("${spring.mail.username}")
    private String fromEmail;

    @Value("${app.otp.toEmail:}")
    private String otpToEmail;

    @Value("${app.otp.ttlSeconds:180}")
    private long ttlSeconds;

    private final Map<String, OtpSession> otpStore = new ConcurrentHashMap<>();

    private String lastPublicChallengeId;

    public GmailServices(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    // Called by GET /sendotp
    public void sendOtp() {
        if (otpToEmail == null || otpToEmail.trim().isEmpty()) {
            throw new IllegalStateException("app.otp.toEmail is not set in application.properties");
        }
        this.lastPublicChallengeId = generateAndSendOtp(otpToEmail);
    }

    // Called by POST /verifyotp { "otp": "123456" }
    public boolean validOtp(String otpInput) {
        if (lastPublicChallengeId == null || lastPublicChallengeId.trim().isEmpty()) {
            return false;
        }

        boolean ok = verifyOtp(lastPublicChallengeId, otpInput);

        if (ok) {
            otpStore.remove(lastPublicChallengeId);
            lastPublicChallengeId = null;
        }

        return ok;
    }

    // Use this in /api/login step-1 to send OTP to the user's email
    public String generateAndSendOtp(String toEmail) {
        if (toEmail == null || toEmail.trim().isEmpty()) {
            throw new IllegalArgumentException("Email is empty, cannot send OTP");
        }

        String otp = String.format("%06d", random.nextInt(1_000_000));
        String challengeId = UUID.randomUUID().toString();

        otpStore.put(challengeId, new OtpSession(otp, Instant.now(), false));

        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom(fromEmail);
        message.setTo(toEmail);
        message.setSubject("OTP Verification");
        message.setText("Your OTP for login verification: " + otp + "\nValid for " + ttlSeconds + " seconds.");

        mailSender.send(message);

        return challengeId;
    }

    // Verify with challengeId + otp
    public boolean verifyOtp(String challengeId, String otpInput) {
        if (challengeId == null || otpInput == null) return false;

        OtpSession session = otpStore.get(challengeId);
        if (session == null) return false;

        if (session.used) return false;

        long age = Instant.now().getEpochSecond() - session.createdAt.getEpochSecond();
        if (age > ttlSeconds) {
            otpStore.remove(challengeId);
            return false;
        }

        boolean ok = session.otp.equals(otpInput);

        if (ok) {
            session.used = true;
            otpStore.put(challengeId, session);
        }

        return ok;
    }

    public void removeChallenge(String challengeId) {
        if (challengeId != null) otpStore.remove(challengeId);
    }

    private static class OtpSession {
        String otp;
        Instant createdAt;
        boolean used;

        OtpSession(String otp, Instant createdAt, boolean used) {
            this.otp = otp;
            this.createdAt = createdAt;
            this.used = used;
        }
    }
}
