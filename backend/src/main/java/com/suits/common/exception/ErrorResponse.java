package com.suits.common.exception;

import com.fasterxml.jackson.annotation.JsonInclude;

import java.time.LocalDateTime;
import java.util.List;

@JsonInclude(JsonInclude.Include.NON_NULL)
public class ErrorResponse {
    private String code;
    private String message;
    private List<FieldError> details;
    private LocalDateTime timestamp;
    private String requestId;

    public ErrorResponse() {}
    
    public ErrorResponse(String code, String message, String requestId) {
        this.code = code;
        this.message = message;
        this.requestId = requestId;
        this.timestamp = LocalDateTime.now();
    }

    public ErrorResponse(String code, String message, List<FieldError> details, String requestId) {
        this.code = code;
        this.message = message;
        this.details = details;
        this.requestId = requestId;
        this.timestamp = LocalDateTime.now();
    }

    public String getCode() { return code; }
    public void setCode(String code) { this.code = code; }
    
    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }
    
    public List<FieldError> getDetails() { return details; }
    public void setDetails(List<FieldError> details) { this.details = details; }
    
    public LocalDateTime getTimestamp() { return timestamp; }
    public void setTimestamp(LocalDateTime timestamp) { this.timestamp = timestamp; }
    
    public String getRequestId() { return requestId; }
    public void setRequestId(String requestId) { this.requestId = requestId; }

    @JsonInclude(JsonInclude.Include.NON_NULL)
    public static class FieldError {
        private String field;
        private String message;

        public FieldError() {}
        
        public FieldError(String field, String message) {
            this.field = field;
            this.message = message;
        }

        public String getField() { return field; }
        public void setField(String field) { this.field = field; }
        
        public String getMessage() { return message; }
        public void setMessage(String message) { this.message = message; }
    }
}
