package com.suits.clients.dto;

import com.suits.clients.entity.Client;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import java.util.List;

public class ClientRequest {

    @NotBlank(message = "Client name is required")
    @Size(min = 2, max = 255, message = "Client name must be between 2 and 255 characters")
    private String name;

    private String cin;
    private String pan;
    private String gst;

    @Email(message = "Email should be valid")
    private String email;

    private String phone;

    @NotBlank(message = "Address is required")
    private String address;

    private String city;
    private String state;
    private String pincode;

    @NotBlank(message = "Entity type is required")
    private String entityType;

    private String assignedManagerId;
    private String status;
    private List<String> tags;

    public ClientRequest() {}

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

    public String getAssignedManagerId() { return assignedManagerId; }
    public void setAssignedManagerId(String assignedManagerId) { this.assignedManagerId = assignedManagerId; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public List<String> getTags() { return tags; }
    public void setTags(List<String> tags) { this.tags = tags; }
}
