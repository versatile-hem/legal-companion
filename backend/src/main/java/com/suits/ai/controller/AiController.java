package com.suits.ai.controller;

import com.suits.common.dto.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/ai")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3001"})
@Tag(name = "AI", description = "Niyam AI assistant endpoints")
public class AiController {

    @Value("${openai.api-key:}")
    private String openAiKey;

    @Value("${openai.model:gpt-4o-mini}")
    private String model;

    private static final String SYSTEM_PROMPT =
        "You are Niyam AI, an expert assistant for Indian CA/CS compliance management. " +
        "You help with MCA filings, GST compliance, income tax, ROC regulations, " +
        "company law, LLP regulations, and related Indian corporate compliance matters. " +
        "Be concise, accurate, and professional. Format responses with markdown where appropriate.";

    @PostMapping("/chat")
    public ResponseEntity<?> chat(@RequestBody Map<String, Object> body) {
        String message = (String) body.get("message");
        if (message == null || message.isBlank()) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("BAD_REQUEST", "Message is required"));
        }

        // If no real API key, return a smart demo response
        if (openAiKey == null || openAiKey.isBlank() || openAiKey.startsWith("sk-placeholder")) {
            return ResponseEntity.ok(ApiResponse.ok(
                    Map.of("reply", getDemoReply(message)), "OK"));
        }

        try {
            RestTemplate rt = new RestTemplate();
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.setBearerAuth(openAiKey);

            Map<String, Object> payload = Map.of(
                    "model", model,
                    "messages", List.of(
                            Map.of("role", "system", "content", SYSTEM_PROMPT),
                            Map.of("role", "user", "content", message)
                    ),
                    "max_tokens", 1000,
                    "temperature", 0.7
            );

            HttpEntity<Map<String, Object>> req = new HttpEntity<>(payload, headers);
            ResponseEntity<Map> resp = rt.postForEntity(
                    "https://api.openai.com/v1/chat/completions", req, Map.class);

            @SuppressWarnings("unchecked")
            var choices = (List<Map<String, Object>>) resp.getBody().get("choices");
            @SuppressWarnings("unchecked")
            var msgObj = (Map<String, String>) choices.get(0).get("message");
            String reply = msgObj.get("content");
            return ResponseEntity.ok(ApiResponse.ok(Map.of("reply", reply), "OK"));
        } catch (Exception e) {
            return ResponseEntity.ok(ApiResponse.ok(
                    Map.of("reply", getDemoReply(message)), "OK"));
        }
    }

    private String getDemoReply(String message) {
        String lower = message.toLowerCase();
        if (lower.contains("mgт7") || lower.contains("mgt-7") || lower.contains("annual return"))
            return "**MGT-7 Annual Return** must be filed within 60 days of the AGM. For FY 2024-25, the AGM must be held by 30 Sep 2025, making the MGT-7 deadline **29 Nov 2025**. Late filing attracts ₹100 per day penalty with no maximum limit.";
        if (lower.contains("din") || lower.contains("director identification"))
            return "**Director Identification Number (DIN)** is a unique 8-digit number allotted by MCA. KYC for DIN holders must be completed annually by **30 Sep** via Form DIR-3 KYC. Non-compliance leads to DIN deactivation and ₹5,000 penalty.";
        if (lower.contains("gst") || lower.contains("goods and service"))
            return "**GST Compliance Key Dates:**\n- GSTR-1: 11th of next month\n- GSTR-3B: 20th of next month\n- GSTR-9 Annual Return: 31 Dec\n\nLate filing attracts ₹50/day (₹20/day for NIL) up to ₹5,000 per return.";
        if (lower.contains("llp") || lower.contains("form 11") || lower.contains("form11"))
            return "**LLP Annual Compliance:**\n- Form 8 (Statement of Accounts): 30 Oct\n- Form 11 (Annual Return): 30 May\n- Income Tax Return (no audit): 31 Jul\n- Income Tax Return (with audit): 30 Sep\n\nPenalty for late filing: ₹100 per day per form.";
        if (lower.contains("aoc") || lower.contains("financial statement"))
            return "**AOC-4** (Financial Statements filing) must be filed within **30 days** of the AGM. For companies with financial year ending 31 Mar, this is typically by **29 Oct 2025**. Late filing penalty: ₹100 per day, no maximum.";
        return "I'm **Niyam AI**, your CA/CS compliance assistant. I can help with:\n\n" +
               "- **ROC filings** (MGT-7, AOC-4, DIR-3 KYC)\n" +
               "- **GST compliance** (GSTR-1, GSTR-3B, GSTR-9)\n" +
               "- **Income Tax** (ITR-6, TDS returns)\n" +
               "- **LLP compliance** (Form 8, Form 11)\n" +
               "- **Company Law** queries\n\n" +
               "What specific compliance matter can I help you with today?";
    }
}
