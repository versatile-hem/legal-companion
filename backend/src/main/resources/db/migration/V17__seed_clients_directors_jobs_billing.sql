-- ============================================================
-- V17: Seed Directors, ComplianceJobs, Invoices
-- ============================================================

-- ── Seed Directors ─────────────────────────────────────────
INSERT INTO directors (id, full_name, din, pan, email, phone, designation, kyc_status, kyc_due_date, is_active)
VALUES
  ('f1000001-0000-0000-0000-000000000001','Narayan Murthy','00214250','AABPN1234K','narayana.murthy@infosys.com','9876543210','Chairman Emeritus','COMPLETED','2026-06-30',TRUE),
  ('f1000001-0000-0000-0000-000000000002','Salil Parekh','07506862','AGKPP5678L','salil.parekh@infosys.com','9876543211','MD & CEO','COMPLETED','2026-06-30',TRUE),
  ('f1000001-0000-0000-0000-000000000003','N Chandrasekaran','00121863','ACFPN2345M','chandra@tcs.com','9876543212','Executive Chairman','COMPLETED','2026-09-30',TRUE),
  ('f1000001-0000-0000-0000-000000000004','K Krithivasan','06409463','BKPKK3456N','krithivasan@tcs.com','9876543213','MD & CEO','COMPLETED','2026-09-30',TRUE),
  ('f1000001-0000-0000-0000-000000000005','Mukesh Ambani','00001209','AABPA1234B','mukesh.ambani@ril.com','9876543214','Chairman & MD','COMPLETED','2026-12-31',TRUE),
  ('f1000001-0000-0000-0000-000000000006','Harshil Mathur','07610914','ABCPH1234C','harshil@razorpay.com','9876543215','CEO & Co-Founder','PENDING','2025-12-31',TRUE),
  ('f1000001-0000-0000-0000-000000000007','Shashank Kumar','07610915','ABCSK2345D','shashank@razorpay.com','9876543216','CTO & Co-Founder','PENDING','2025-12-31',TRUE),
  ('f1000001-0000-0000-0000-000000000008','Sriharsha Majety','07210916','ABCSM3456E','sriharsha@swiggy.com','9876543217','MD & CEO','COMPLETED','2026-03-31',TRUE),
  ('f1000001-0000-0000-0000-000000000009','Sameer Nigam','07410917','ABCSN4567F','sameer@phonepe.com','9876543218','MD & CEO','COMPLETED','2026-03-31',TRUE),
  ('f1000001-0000-0000-0000-000000000010','Pranit Arora','09537940','ABCPA5678G','pranit@univest.in','9876543219','Director','COMPLETED','2026-06-30',TRUE),
  ('f1000001-0000-0000-0000-000000000011','Avneet Dhamija','07341746','ABCAD6789H','avneet@univest.in','9876543220','Director','COMPLETED','2026-06-30',TRUE),
  ('f1000001-0000-0000-0000-000000000012','Vikash Kumar Agrawal','09847431','ABCVK7890I','vikash@univest.in','9876543221','Director','PENDING','2025-09-30',TRUE);

-- ── Seed Compliance Jobs ────────────────────────────────────
-- Use a cross-join trick to pick real entity ids
DO $$
DECLARE
  e1 UUID; e2 UUID; e3 UUID; e4 UUID; e5 UUID;
  c1 UUID;
  u1 UUID;
BEGIN
  SELECT id INTO e1 FROM legal_entity WHERE entity_name ILIKE '%Infosys%' LIMIT 1;
  SELECT id INTO e2 FROM legal_entity WHERE entity_name ILIKE '%TCS%' LIMIT 1;
  SELECT id INTO e3 FROM legal_entity WHERE entity_name ILIKE '%Razorpay%' LIMIT 1;
  SELECT id INTO e4 FROM legal_entity WHERE entity_name ILIKE '%Swiggy%' LIMIT 1;
  SELECT id INTO e5 FROM legal_entity WHERE entity_name ILIKE '%Univest%' LIMIT 1;
  SELECT id INTO c1 FROM clients LIMIT 1;
  SELECT id INTO u1 FROM users WHERE role = 'ADMIN' LIMIT 1;

  IF e1 IS NOT NULL THEN
    INSERT INTO compliance_jobs (job_number,title,job_type,status,priority,due_date,financial_year,entity_id,client_id,assigned_to,billing_amount,remarks)
    VALUES
      ('JOB-2025-001','MGT-7 Annual Return Filing','MGT7','IN_PROGRESS','HIGH','2025-11-30','2024-25',e1,c1,u1,25000,'Documents received. Verification in progress.'),
      ('JOB-2025-002','AOC-4 Financial Statements','AOC4','PENDING_DOCS','HIGH','2025-10-31','2024-25',e1,c1,u1,18000,'Awaiting audited balance sheet.'),
      ('JOB-2025-003','GST Annual Return GSTR-9','GST_FILING','COMPLETED','MEDIUM','2025-12-31','2024-25',e1,c1,u1,12000,'Filed successfully on 28-Nov-2025.');
  END IF;

  IF e2 IS NOT NULL THEN
    INSERT INTO compliance_jobs (job_number,title,job_type,status,priority,due_date,financial_year,entity_id,client_id,assigned_to,billing_amount,remarks)
    VALUES
      ('JOB-2025-004','MGT-7 Annual Return Filing','MGT7','REVIEW','HIGH','2025-11-30','2024-25',e2,c1,u1,25000,'Under partner review.'),
      ('JOB-2025-005','Director KYC - N Chandrasekaran','DIR_KYC','COMPLETED','MEDIUM','2025-09-30','2024-25',e2,c1,u1,5000,'KYC completed and filed.'),
      ('JOB-2025-006','TDS Q2 Return','TDS_RETURN','FILED','MEDIUM','2025-10-31','2024-25',e2,c1,u1,8000,'TDS return filed for Q2 FY25.');
  END IF;

  IF e3 IS NOT NULL THEN
    INSERT INTO compliance_jobs (job_number,title,job_type,status,priority,due_date,financial_year,entity_id,client_id,assigned_to,billing_amount,remarks)
    VALUES
      ('JOB-2025-007','Annual Compliance Audit','AUDIT','IN_PROGRESS','CRITICAL','2025-09-30','2024-25',e3,c1,u1,75000,'FEMA compliance audit underway.'),
      ('JOB-2025-008','GST Monthly Return Oct','GST_FILING','PENDING_DOCS','MEDIUM','2025-11-20','2024-25',e3,c1,u1,6000,'Awaiting Oct sales data.');
  END IF;

  IF e4 IS NOT NULL THEN
    INSERT INTO compliance_jobs (job_number,title,job_type,status,priority,due_date,financial_year,entity_id,client_id,assigned_to,billing_amount,remarks)
    VALUES
      ('JOB-2025-009','AOC-4 Financial Statements','AOC4','DRAFT','HIGH','2025-10-31','2024-25',e4,c1,u1,22000,'Not started.'),
      ('JOB-2025-010','ITR-6 Income Tax Return','ITR_FILING','IN_PROGRESS','HIGH','2025-10-31','2024-25',e4,c1,u1,35000,'Computation in progress.');
  END IF;

  IF e5 IS NOT NULL THEN
    INSERT INTO compliance_jobs (job_number,title,job_type,status,priority,due_date,financial_year,entity_id,client_id,assigned_to,billing_amount,remarks)
    VALUES
      ('JOB-2025-011','Annual Return LLP Form11','FORM11','PENDING_DOCS','HIGH','2026-05-30','2025-26',e5,c1,u1,8000,'Awaiting partner consent.'),
      ('JOB-2025-012','DIR-3 KYC for all Directors','DIR_KYC','DRAFT','MEDIUM','2026-09-30','2025-26',e5,c1,u1,6000,'Three directors to complete.');
  END IF;
END $$;

-- ── Seed Invoices ───────────────────────────────────────────
DO $$
DECLARE
  c1 UUID; j1 UUID; j2 UUID; j4 UUID;
BEGIN
  SELECT id INTO c1 FROM clients LIMIT 1;
  SELECT id INTO j1 FROM compliance_jobs WHERE job_number='JOB-2025-001';
  SELECT id INTO j2 FROM compliance_jobs WHERE job_number='JOB-2025-003';
  SELECT id INTO j4 FROM compliance_jobs WHERE job_number='JOB-2025-005';

  INSERT INTO invoices (invoice_number,client_id,job_id,amount,gst_amount,total_amount,status,issue_date,due_date,paid_date,notes)
  VALUES
    ('INV-2025-001',c1,j2,12000,2160,14160,'PAID','2025-12-01','2025-12-15','2025-12-10','GST Annual Return GSTR-9 — Payment received.'),
    ('INV-2025-002',c1,j4,5000,900,5900,'PAID','2025-10-01','2025-10-15','2025-10-12','Director KYC filing.'),
    ('INV-2025-003',c1,j1,25000,4500,29500,'SENT','2025-11-20','2025-12-05',NULL,'MGT-7 Annual Return. Payment pending.'),
    ('INV-2025-004',c1,NULL,18000,3240,21240,'OVERDUE','2025-09-01','2025-09-30',NULL,'Retainer fee Q3 FY25.'),
    ('INV-2025-005',c1,NULL,35000,6300,41300,'DRAFT','2026-01-01','2026-01-31',NULL,'Annual audit and compliance package FY25.');
END $$;

-- ── Seed client_code on clients ─────────────────────────────
ALTER TABLE clients ADD COLUMN IF NOT EXISTS client_code VARCHAR(20);
UPDATE clients SET client_code = 'CLT-' || LPAD(CAST(ROW_NUMBER() OVER(ORDER BY created_at) AS TEXT), 3, '0')
WHERE client_code IS NULL;
