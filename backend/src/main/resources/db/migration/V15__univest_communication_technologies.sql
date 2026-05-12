-- V15: Insert Univest Communication Technologies Private Limited
-- Source: MCA / Zaubacorp (as on 2024-07-04) + univest.in
-- CIN: U67190HR2022PTC102061

INSERT INTO legal_entity (
    id, entity_name, entity_type, cin_llpin,
    pan, tan, gstin,
    incorporation_date, financial_year_end, roc_code,
    registered_office, city, state, pincode,
    email, phone, website,
    authorized_capital, paid_up_capital,
    compliance_status, status, ai_risk_score, ai_summary,
    next_due_date, notes,
    created_at, updated_at
) VALUES (
    '00000000-0031-0031-0031-000000000031',
    'Univest Communication Technologies Private Limited',
    'PRIVATE_LIMITED',
    'U67190HR2022PTC102061',
    NULL,   -- PAN not publicly disclosed
    NULL,   -- TAN not publicly disclosed
    NULL,   -- GSTIN not publicly disclosed
    '2022-03-16',
    '31-Mar',
    'RoC-Delhi',
    'Building Number 10, 1st Floor, Poorvi Marg, DLF Phase 2, Gurugram, Haryana 122008',
    'Gurugram',
    'Haryana',
    '122008',
    'hello@univest.in',
    NULL,
    'https://www.univest.in',
    2500000,   -- Authorised capital: ₹25,00,000
    122810,    -- Paid-up capital: ₹1,22,810
    'AT_RISK',
    'ACTIVE',
    45,
    'Univest Communication Technologies is the holding entity behind Univest, a SEBI-registered stock advisory and brokerage platform trusted by 50 lakh+ users in India. Subsidiaries include Uniresearch Global Pvt Ltd (SEBI RA: INH000013776), Uniapps Investment Adviser Pvt Ltd (SEBI IA: INA000017639), and Univest Stock Broking Pvt Ltd (SEBI: INZ000317437). Last balance sheet filed for FY2022-23; FY2023-24 and FY2024-25 annual filings status unconfirmed. SEBI subsidiary registrations are active and in good standing. Google for Startups Accelerator 2024 participant; awarded No.1 by Economic Times.',
    '2026-09-30',
    'Registration Number: 102061. NIC Code 6719 - Financial intermediation services. AGM last held: 30 Dec 2023 (FY2022-23). Incorporation date confirmed per MCA records: 16 March 2022. Director DINs: Pranit Arora (09537940), Avneet Dhamija (07341746), Vikash Kumar Agrawal (09847431). Subsidiary Uniresearch holds SEBI RA license INH000013776.',
    NOW(),
    NOW()
);

-- Directors
INSERT INTO entity_director (
    id, entity_id, director_name, designation, din,
    pan, email, appointment_date, is_active,
    created_at, updated_at
) VALUES
(
    'd0031001-0031-0031-0031-000000000001',
    '00000000-0031-0031-0031-000000000031',
    'Pranit Arora',
    'Director',
    '09537940',
    NULL,
    NULL,
    '2022-03-16',
    true,
    NOW(), NOW()
),
(
    'd0031002-0031-0031-0031-000000000002',
    '00000000-0031-0031-0031-000000000031',
    'Avneet Dhamija',
    'Director',
    '07341746',
    NULL,
    NULL,
    '2022-03-16',
    true,
    NOW(), NOW()
),
(
    'd0031003-0031-0031-0031-000000000003',
    '00000000-0031-0031-0031-000000000031',
    'Vikash Kumar Agrawal',
    'Director',
    '09847431',
    NULL,
    NULL,
    '2023-01-04',
    true,
    NOW(), NOW()
);

-- Compliance records
INSERT INTO entity_compliance (
    id, entity_id, compliance_name, form_name, category,
    due_date, status, risk_level, notes,
    created_at, updated_at
) VALUES
(
    'cf310001-0031-0031-0031-000000000001',
    '00000000-0031-0031-0031-000000000031',
    'Annual Return FY2024-25',
    'MGT-7',
    'ROC',
    '2026-11-29',
    'PENDING',
    'MEDIUM',
    'Annual return for FY2024-25 due within 60 days of AGM. Last filed return was for FY2022-23.',
    NOW(), NOW()
),
(
    'cf310002-0031-0031-0031-000000000002',
    '00000000-0031-0031-0031-000000000031',
    'Financial Statements FY2024-25',
    'AOC-4',
    'ROC',
    '2026-10-29',
    'PENDING',
    'MEDIUM',
    'AOC-4 for FY2024-25. Last filed balance sheet was FY2022-23 (March 2023). FY2023-24 status unconfirmed — needs verification.',
    NOW(), NOW()
),
(
    'cf310003-0031-0031-0031-000000000003',
    '00000000-0031-0031-0031-000000000031',
    'AGM FY2024-25',
    'MGT-15',
    'ROC',
    '2026-09-30',
    'PENDING',
    'MEDIUM',
    'AGM for FY2024-25 to be held within 6 months of financial year end (Sept 30, 2026). Last AGM was Dec 30, 2023.',
    NOW(), NOW()
),
(
    'cf310004-0031-0031-0031-000000000004',
    '00000000-0031-0031-0031-000000000031',
    'SEBI RA License Renewal - Uniresearch',
    'SEBI-RA-ANNUAL',
    'FEMA_RBI',
    '2026-06-30',
    'PENDING',
    'LOW',
    'Annual compliance for SEBI Research Analyst registration INH000013776 held by subsidiary Uniresearch Global Pvt Ltd. Currently active.',
    NOW(), NOW()
),
(
    'cf310005-0031-0031-0031-000000000005',
    '00000000-0031-0031-0031-000000000031',
    'SEBI Stock Broker Annual Compliance',
    'SEBI-SB-ANNUAL',
    'FEMA_RBI',
    '2026-06-30',
    'PENDING',
    'LOW',
    'Annual compliance for Univest Stock Broking Pvt Ltd (SEBI INZ000317437, NSE TM: 90392, BSE TM: 6866). DP registration IN-DP-779-2024, NSDL DP ID IN304748.',
    NOW(), NOW()
),
(
    'cf310006-0031-0031-0031-000000000006',
    '00000000-0031-0031-0031-000000000031',
    'DIR-3 KYC — All Directors',
    'DIR-3 KYC',
    'ROC',
    '2026-09-30',
    'PENDING',
    'LOW',
    'Annual DIR-3 KYC for all 3 directors (Pranit Arora DIN 09537940, Avneet Dhamija DIN 07341746, Vikash Kumar Agrawal DIN 09847431). Due by 30 Sept each year.',
    NOW(), NOW()
);
