package com.suits.common.constants;

public class AppConstants {
    
    // JWT
    public static final String JWT_HEADER = "Authorization";
    public static final String JWT_PREFIX = "Bearer ";
    
    // Pagination
    public static final int DEFAULT_PAGE_NUMBER = 0;
    public static final int DEFAULT_PAGE_SIZE = 20;
    public static final int MAX_PAGE_SIZE = 100;
    
    // Roles
    public static final String ROLE_ADMIN = "ROLE_ADMIN";
    public static final String ROLE_PARTNER = "ROLE_PARTNER";
    public static final String ROLE_MANAGER = "ROLE_MANAGER";
    public static final String ROLE_EXECUTIVE = "ROLE_EXECUTIVE";
    public static final String ROLE_VIEWER = "ROLE_VIEWER";
    
    // Permissions
    public static final String PERM_READ_CLIENTS = "READ_CLIENTS";
    public static final String PERM_CREATE_CLIENTS = "CREATE_CLIENTS";
    public static final String PERM_UPDATE_CLIENTS = "UPDATE_CLIENTS";
    public static final String PERM_DELETE_CLIENTS = "DELETE_CLIENTS";
    
    public static final String PERM_READ_JOBS = "READ_JOBS";
    public static final String PERM_CREATE_JOBS = "CREATE_JOBS";
    public static final String PERM_UPDATE_JOBS = "UPDATE_JOBS";
    
    public static final String PERM_READ_INVOICES = "READ_INVOICES";
    public static final String PERM_CREATE_INVOICES = "CREATE_INVOICES";
    
    // Job Types
    public static final String JOB_TYPE_MGT_7 = "MGT_7";
    public static final String JOB_TYPE_AOC_4 = "AOC_4";
    public static final String JOB_TYPE_DIR_3_KYC = "DIR_3_KYC";
    public static final String JOB_TYPE_SHARE_TRANSFER = "SHARE_TRANSFER";
    public static final String JOB_TYPE_INCORPORATION = "INCORPORATION";
    public static final String JOB_TYPE_RBI_FILING = "RBI_FILING";
    public static final String JOB_TYPE_TRADEMARK = "TRADEMARK";
    
    // Job Statuses
    public static final String JOB_STATUS_DRAFT = "DRAFT";
    public static final String JOB_STATUS_PENDING_DOCS = "PENDING_DOCS";
    public static final String JOB_STATUS_IN_PROGRESS = "IN_PROGRESS";
    public static final String JOB_STATUS_REVIEW = "REVIEW";
    public static final String JOB_STATUS_FILED = "FILED";
    public static final String JOB_STATUS_COMPLETED = "COMPLETED";
    public static final String JOB_STATUS_REJECTED = "REJECTED";
    
    // Invoice Statuses
    public static final String INVOICE_STATUS_DRAFT = "DRAFT";
    public static final String INVOICE_STATUS_SENT = "SENT";
    public static final String INVOICE_STATUS_PAID = "PAID";
    public static final String INVOICE_STATUS_OVERDUE = "OVERDUE";
    
    // Entity Types
    public static final String ENTITY_TYPE_COMPANY = "COMPANY";
    public static final String ENTITY_TYPE_LLP = "LLP";
    public static final String ENTITY_TYPE_PARTNERSHIP = "PARTNERSHIP";
    public static final String ENTITY_TYPE_PROPRIETORSHIP = "PROPRIETORSHIP";
    
    // Audit Actions
    public static final String AUDIT_ACTION_CREATE = "CREATE";
    public static final String AUDIT_ACTION_UPDATE = "UPDATE";
    public static final String AUDIT_ACTION_DELETE = "DELETE";
    public static final String AUDIT_ACTION_VIEW = "VIEW";
    public static final String AUDIT_ACTION_LOGIN = "LOGIN";
    public static final String AUDIT_ACTION_LOGOUT = "LOGOUT";
    public static final String AUDIT_ACTION_EXPORT = "EXPORT";
}
