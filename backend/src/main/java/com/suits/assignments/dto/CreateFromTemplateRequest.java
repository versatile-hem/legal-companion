package com.suits.assignments.dto;

import java.util.UUID;

public class CreateFromTemplateRequest {
    private UUID templateId;
    private String name;
    private UUID clientId;

    public UUID getTemplateId() { return templateId; }
    public void setTemplateId(UUID templateId) { this.templateId = templateId; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public UUID getClientId() { return clientId; }
    public void setClientId(UUID clientId) { this.clientId = clientId; }
}
