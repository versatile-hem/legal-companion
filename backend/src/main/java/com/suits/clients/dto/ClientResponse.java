package com.suits.clients.dto;

import com.suits.auth.dto.LoginResponse;
import com.suits.clients.entity.Client;

import java.time.LocalDateTime;
import java.util.List;

public class ClientResponse {

    private String id;
    private String name;
    private String cin;
    private String pan;
    private String gst;
    private String email;
    private String phone;
    private String address;
    private String city;
    private String state;
    private String pincode;
    private String entityType;
    private AssignedManagerDto assignedManager;
    private String status;
    private List<String> tags;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public ClientResponse() {}
    
    public ClientResponse(String id, String name, String cin, String pan, String gst, String email,
                         String phone, String address, String city, String state, String pincode,
                         String entityType, AssignedManagerDto assignedManager, String status,
                         List<String> tags, LocalDateTime createdAt, LocalDateTime updatedAt) {
        this.id = id;
        this.name = name;
        this.cin = cin;
        this.pan = pan;
        this.gst = gst;
        this.email = email;
        this.phone = phone;
        this.address = address;
        this.city = city;
        this.state = state;
        this.pincode = pincode;
        this.entityType = entityType;
        this.assignedManager = assignedManager;
        this.status = status;
        this.tags = tags;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    
    public String getCin() { return cin; }
    public void setCin(String cin) { this.cin = cin; }
    
    public String getPan() { return pan; }
    public void setPan(String pan) { this.pan = pan; }
    
    public String getGst() { return gst; }
    public void setGst(String gst) { this.gst = gst; }
    
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    
    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }
    
    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }
    
    public String getCity() { return city; }
    public void setCity(String city) { this.city = city; }
    
    public String getState() { return state; }
    public void setState(String state) { this.state = state; }
    
    public String getPincode() { return pincode; }
    public void setPincode(String pincode) { this.pincode = pincode; }
    
    public String getEntityType() { return entityType; }
    public void setEntityType(String entityType) { this.entityType = entityType; }
    
    public AssignedManagerDto getAssignedManager() { return assignedManager; }
    public void setAssignedManager(AssignedManagerDto assignedManager) { this.assignedManager = assignedManager; }
    
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    
    public List<String> getTags() { return tags; }
    public void setTags(List<String> tags) { this.tags = tags; }
    
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }

    public static class AssignedManagerDto {
        private String id;
        private String firstName;
        private String lastName;
        private String fullName;
        private String email;

        public AssignedManagerDto() {}
        
        public AssignedManagerDto(String id, String firstName, String lastName, String fullName, String email) {
            this.id = id;
            this.firstName = firstName;
            this.lastName = lastName;
            this.fullName = fullName;
            this.email = email;
        }

        public String getId() { return id; }
        public void setId(String id) { this.id = id; }
        
        public String getFirstName() { return firstName; }
        public void setFirstName(String firstName) { this.firstName = firstName; }
        
        public String getLastName() { return lastName; }
        public void setLastName(String lastName) { this.lastName = lastName; }
        
        public String getFullName() { return fullName; }
        public void setFullName(String fullName) { this.fullName = fullName; }
        
        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }
    }

    public static ClientResponse fromEntity(Client client) {
        AssignedManagerDto managerDto = null;
        if (client.getAssignedManager() != null) {
            managerDto = new AssignedManagerDto(
                    client.getAssignedManager().getId().toString(),
                    client.getAssignedManager().getFirstName(),
                    client.getAssignedManager().getLastName(),
                    client.getAssignedManager().getFullName(),
                    client.getAssignedManager().getEmail()
            );
        }

        ClientResponse response = new ClientResponse();
        response.setId(client.getId().toString());
        response.setName(client.getName());
        response.setCin(client.getCin());
        response.setPan(client.getPan());
        response.setGst(client.getGst());
        response.setEmail(client.getEmail());
        response.setPhone(client.getPhone());
        response.setAddress(client.getAddress());
        response.setCity(client.getCity());
        response.setState(client.getState());
        response.setPincode(client.getPincode());
        response.setEntityType(client.getEntityType().toString());
        response.setAssignedManager(managerDto);
        response.setStatus(client.getStatus().toString());
        response.setCreatedAt(client.getCreatedAt());
        response.setUpdatedAt(client.getUpdatedAt());
        return response;
    }
}
