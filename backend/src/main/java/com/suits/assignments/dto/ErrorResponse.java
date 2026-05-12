package com.suits.assignments.dto;

import java.time.LocalDateTime;
import java.util.Map;

public class ErrorResponse {
    private LocalDateTime timestamp;
    private Integer status;
    private String message;
    private Map<String, String> errors;
    private String path;
}
