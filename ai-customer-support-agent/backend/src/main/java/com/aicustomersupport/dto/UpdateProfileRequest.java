package com.aicustomersupport.dto;

import jakarta.validation.constraints.Size;

public class UpdateProfileRequest {

    @Size(min = 2, max = 100, message = "Name must be between 2 and 100 characters")
    private String name;

    private String phone;

    @Size(min = 6, max = 50, message = "Password must be at least 6 characters")
    private String currentPassword;

    @Size(min = 6, max = 50, message = "New password must be at least 6 characters")
    private String newPassword;

    public UpdateProfileRequest() {
    }

    public UpdateProfileRequest(String name, String phone, String currentPassword, String newPassword) {
        this.name = name;
        this.phone = phone;
        this.currentPassword = currentPassword;
        this.newPassword = newPassword;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getCurrentPassword() {
        return currentPassword;
    }

    public void setCurrentPassword(String currentPassword) {
        this.currentPassword = currentPassword;
    }

    public String getNewPassword() {
        return newPassword;
    }

    public void setNewPassword(String newPassword) {
        this.newPassword = newPassword;
    }
}
