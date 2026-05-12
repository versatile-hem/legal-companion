-- ============================================================
-- V13: Seed 30 realistic legal entities
-- ============================================================

INSERT INTO legal_entity (
    id, entity_name, entity_type, incorporation_date,
    cin_llpin, pan, tan, gstin, roc_code, financial_year_end,
    registered_office, city, state, pincode, email, phone,
    authorized_capital, paid_up_capital,
    compliance_status, next_due_date, status, ai_risk_score, ai_summary
) VALUES

-- 1. Earendel Online Services Private Limited
('00000000-0001-0001-0001-000000000001', 'Earendel Online Services Private Limited', 'PRIVATE_LIMITED', '2019-03-15',
 'U72900KA2019PTC112233', 'AACCE1234A', 'BLRE12345A', '29AACCE1234A1Z5', 'RoC-Bangalore', 'March',
 '#42, MG Road, Indiranagar', 'Bengaluru', 'Karnataka', '560038', 'admin@earendel.in', '9876543210',
 10000000, 5000000, 'HEALTHY', '2026-09-30', 'ACTIVE', 12, 'Company is in good standing. Next ROC filing due in 4 months.'),

-- 2. Zenith Healthcare LLP
('00000000-0002-0002-0002-000000000002', 'Zenith Healthcare LLP', 'LLP', '2017-08-22',
 'AAA-0012', 'AACZH5678B', NULL, '07AACZH5678B1Z3', 'RoC-Delhi', 'March',
 'F-12, Connaught Place', 'New Delhi', 'Delhi', '110001', 'info@zenithhealthcare.com', '9123456789',
 5000000, 3000000, 'AT_RISK', '2026-06-30', 'ACTIVE', 45, 'Director KYC overdue for 1 partner. GST returns pending for Q4.'),

-- 3. Alpha Retail India Pvt Ltd
('00000000-0003-0003-0003-000000000003', 'Alpha Retail India Private Limited', 'PRIVATE_LIMITED', '2015-11-10',
 'U52100MH2015PTC220011', 'AABCA9876C', 'MUME98765C', '27AABCA9876C1Z8', 'RoC-Mumbai', 'March',
 'Unit 501, Bandra Kurla Complex', 'Mumbai', 'Maharashtra', '400051', 'cs@alpharetail.in', '9988776655',
 50000000, 20000000, 'OVERDUE', '2026-05-15', 'ACTIVE', 78, '3 overdue ROC filings. MGT-7 and AOC-4 pending for FY 2024-25.'),

-- 4. Horizon Tech Solutions LLP
('00000000-0004-0004-0004-000000000004', 'Horizon Tech Solutions LLP', 'LLP', '2020-01-05',
 'AAA-1234', 'AADCH1111D', NULL, '29AADCH1111D1Z2', 'RoC-Bangalore', 'March',
 '3rd Floor, Embassy Tech Village', 'Bengaluru', 'Karnataka', '560103', 'hello@horizontech.in', '9871234560',
 2000000, 1500000, 'HEALTHY', '2026-10-31', 'ACTIVE', 8, 'All compliances up to date. Next LLP Form-11 due October 2026.'),

-- 5. Meridian Constructions Pvt Ltd
('00000000-0005-0005-0005-000000000005', 'Meridian Constructions Private Limited', 'PRIVATE_LIMITED', '2010-06-18',
 'U45200DL2010PTC190444', 'AABCM4321E', 'DELM43210E', '07AABCM4321E1Z9', 'RoC-Delhi', 'March',
 'Plot 88, Sector 44', 'Gurugram', 'Haryana', '122003', 'legal@meridiancon.com', '9911223344',
 100000000, 75000000, 'CRITICAL', '2026-05-01', 'ACTIVE', 91, 'Critical: 5 overdue filings. Penalty notices received from ROC. Immediate action required.'),

-- 6. Sunrise Foods OPC Private Limited
('00000000-0006-0006-0006-000000000006', 'Sunrise Foods OPC Private Limited', 'OPC', '2022-04-01',
 'U15100TN2022OPC123456', 'AABCS5555F', NULL, '33AABCS5555F1Z0', 'RoC-Chennai', 'March',
 '14/2, Anna Salai', 'Chennai', 'Tamil Nadu', '600002', 'opc@sunrisefoods.in', '9444556677',
 1000000, 500000, 'HEALTHY', '2026-09-30', 'ACTIVE', 5, 'OPC compliance is on track. Single director KYC completed.'),

-- 7. Vertex Partners LLP
('00000000-0007-0007-0007-000000000007', 'Vertex Partners LLP', 'LLP', '2016-03-25',
 'AAA-5678', 'AACVP6789G', NULL, '27AACVP6789G1Z4', 'RoC-Mumbai', 'March',
 'Nariman Point, 2nd Floor', 'Mumbai', 'Maharashtra', '400021', 'partners@vertexllp.com', '9022334455',
 3000000, 2500000, 'AT_RISK', '2026-07-15', 'ACTIVE', 38, 'Partner DSC expired. Form LLP-11 pending. Risk medium.'),

-- 8. NovaStar Technology Pvt Ltd
('00000000-0008-0008-0008-000000000008', 'NovaStar Technology Private Limited', 'PRIVATE_LIMITED', '2018-09-12',
 'U72200MH2018PTC300123', 'AABCN7890H', 'MUMN78901H', '27AABCN7890H1Z5', 'RoC-Mumbai', 'March',
 'Powai, Hiranandani Gardens', 'Mumbai', 'Maharashtra', '400076', 'info@novastar.tech', '9833445566',
 25000000, 10000000, 'HEALTHY', '2026-10-31', 'ACTIVE', 10, 'Strong compliance posture. All filings current.'),

-- 9. BlueStar Manufacturing Ltd
('00000000-0009-0009-0009-000000000009', 'BlueStar Manufacturing Limited', 'PUBLIC_LIMITED', '2005-07-30',
 'L26100GJ2005PLC050001', 'AABCB2345I', 'AHME23450I', '24AABCB2345I1Z6', 'RoC-Ahmedabad', 'March',
 'Plot 23, GIDC Estate', 'Ahmedabad', 'Gujarat', '380025', 'secretarial@bluestar.com', '9925336677',
 500000000, 200000000, 'AT_RISK', '2026-06-15', 'ACTIVE', 42, 'AGM notice pending. Q3 board meeting minutes not filed.'),

-- 10. Coastal Fisheries Pvt Ltd
('00000000-0010-0010-0010-000000000010', 'Coastal Fisheries Private Limited', 'PRIVATE_LIMITED', '2014-02-14',
 'U05000KL2014PTC080234', 'AABCC3456J', NULL, '32AABCC3456J1Z7', 'RoC-Ernakulam', 'March',
 'Willingdon Island', 'Kochi', 'Kerala', '682003', 'admin@coastalfisheries.in', '9447112233',
 5000000, 2000000, 'HEALTHY', '2026-09-30', 'ACTIVE', 15, 'Seasonal business. All annual filings completed for FY 2024-25.'),

-- 11. PeakPoint Consulting LLP
('00000000-0011-0011-0011-000000000011', 'PeakPoint Consulting LLP', 'LLP', '2021-11-08',
 'AAA-9012', 'AADCP9012K', NULL, '29AADCP9012K1Z8', 'RoC-Bangalore', 'March',
 'Whitefield, ITPL Road', 'Bengaluru', 'Karnataka', '560066', 'cs@peakpoint.in', '9886677889',
 1000000, 800000, 'HEALTHY', '2026-10-31', 'ACTIVE', 6, 'New LLP. Compliance framework being set up.'),

-- 12. Crown Jewellers Pvt Ltd
('00000000-0012-0012-0012-000000000012', 'Crown Jewellers Private Limited', 'PRIVATE_LIMITED', '2008-05-19',
 'U36900RJ2008PTC070567', 'AABCC4567L', 'JPRC45671L', '08AABCC4567L1Z9', 'RoC-Jaipur', 'March',
 'MI Road, Sindhi Camp', 'Jaipur', 'Rajasthan', '302001', 'secretarial@crownjewels.com', '9413344556',
 20000000, 15000000, 'OVERDUE', '2026-05-10', 'ACTIVE', 68, 'AGM overdue. Director KYC pending for 2 directors. MSME filing missed.'),

-- 13. GreenPath Energy Solutions Pvt Ltd
('00000000-0013-0013-0013-000000000013', 'GreenPath Energy Solutions Private Limited', 'PRIVATE_LIMITED', '2020-10-20',
 'U40100AP2020PTC120789', 'AABCG5678M', 'HYDB56781M', '37AABCG5678M1Z0', 'RoC-Hyderabad', 'March',
 'Madhapur, HiTec City', 'Hyderabad', 'Telangana', '500081', 'legal@greenpath.energy', '9640012345',
 8000000, 4000000, 'HEALTHY', '2026-09-30', 'ACTIVE', 18, 'Renewable energy startup. 2 compliance items due in Q3.'),

-- 14. SwiftCargo Logistics Pvt Ltd
('00000000-0014-0014-0014-000000000014', 'SwiftCargo Logistics Private Limited', 'PRIVATE_LIMITED', '2013-08-05',
 'U63000MH2013PTC160890', 'AABCS6789N', 'MUMR67891N', '27AABCS6789N1Z1', 'RoC-Mumbai', 'March',
 'JNPT Road, Nhava Sheva', 'Navi Mumbai', 'Maharashtra', '400707', 'compliance@swiftcargo.in', '9222334455',
 15000000, 10000000, 'AT_RISK', '2026-06-28', 'ACTIVE', 50, 'GST notices pending. 2 directors have expired DIN.'),

-- 15. Pinnacle Education Trust
('00000000-0015-0015-0015-000000000015', 'Pinnacle Education Trust', 'TRUST', '2012-01-30',
 NULL, 'AABTP7890O', NULL, '36AABTP7890O1Z2', NULL, 'March',
 'Jubilee Hills, Road No 36', 'Hyderabad', 'Telangana', '500033', 'admin@pinnacleedu.org', '9849001234',
 NULL, NULL, 'HEALTHY', '2026-03-31', 'ACTIVE', 20, 'Non-profit trust. Annual accounts filed.'),

-- 16. PropTech Ventures LLP
('00000000-0016-0016-0016-000000000016', 'PropTech Ventures LLP', 'LLP', '2019-06-01',
 'AAA-3456', 'AABCP8901P', NULL, '29AABCP8901P1Z3', 'RoC-Bangalore', 'March',
 'Koramangala 5th Block', 'Bengaluru', 'Karnataka', '560095', 'cs@proptechventures.in', '9741234567',
 5000000, 3000000, 'HEALTHY', '2026-10-31', 'ACTIVE', 22, 'Real estate tech LLP. Partnership deed amended FY 2024.'),

-- 17. Bharat Steel Works Pvt Ltd
('00000000-0017-0017-0017-000000000017', 'Bharat Steel Works Private Limited', 'PRIVATE_LIMITED', '2001-09-15',
 'U27100WB2001PTC030001', 'AABCB9012Q', 'CALB90120Q', '19AABCB9012Q1Z4', 'RoC-Kolkata', 'March',
 'Durgapur Industrial Area', 'Durgapur', 'West Bengal', '713203', 'cs@bharatsteel.in', '9434223344',
 200000000, 150000000, 'CRITICAL', '2026-05-05', 'ACTIVE', 88, 'Critical compliance failure. Accounts not filed for FY 2023-24. ROC show cause notice received.'),

-- 18. SkyView Real Estate Pvt Ltd
('00000000-0018-0018-0018-000000000018', 'SkyView Real Estate Private Limited', 'PRIVATE_LIMITED', '2016-12-28',
 'U70100DL2016PTC200234', 'AABCS1011R', 'DELS10110R', '07AABCS1011R1Z5', 'RoC-Delhi', 'March',
 'DLF Cyber Hub, Sector 24', 'Gurugram', 'Haryana', '122022', 'legal@skyviewrealty.com', '9810001122',
 30000000, 20000000, 'AT_RISK', '2026-07-31', 'ACTIVE', 44, 'RERA compliance due. 2 shareholders not updated in register.'),

-- 19. Citrus Beverages India Pvt Ltd
('00000000-0019-0019-0019-000000000019', 'Citrus Beverages India Private Limited', 'PRIVATE_LIMITED', '2018-04-22',
 'U15420TN2018PTC250345', 'AABCC1112S', 'CHER11121S', '33AABCC1112S1Z6', 'RoC-Chennai', 'March',
 'Ambattur Industrial Estate', 'Chennai', 'Tamil Nadu', '600058', 'finance@citrusbeverages.in', '9444001234',
 10000000, 6000000, 'HEALTHY', '2026-09-30', 'ACTIVE', 14, 'FSSAI renewal due. All corporate filings current.'),

-- 20. Indus Pharma Pvt Ltd
('00000000-0020-0020-0020-000000000020', 'Indus Pharma Private Limited', 'PRIVATE_LIMITED', '2006-03-08',
 'U24230GJ2006PTC060567', 'AABCI1213T', 'SURE12130T', '24AABCI1213T1Z7', 'RoC-Ahmedabad', 'March',
 'Vatva GIDC, Phase 2', 'Ahmedabad', 'Gujarat', '382445', 'secretarial@induspharma.com', '9979334455',
 50000000, 35000000, 'HEALTHY', '2026-09-30', 'ACTIVE', 11, 'Pharma company. CDSCO license renewed. All ROC filings current.'),

-- 21. Falcon Finserv OPC Pvt Ltd
('00000000-0021-0021-0021-000000000021', 'Falcon Finserv OPC Private Limited', 'OPC', '2023-01-15',
 'U65100MH2023OPC380678', 'AABCF1314U', NULL, '27AABCF1314U1Z8', 'RoC-Mumbai', 'March',
 'Lower Parel, Phoenix Market City', 'Mumbai', 'Maharashtra', '400013', 'founder@falconfinserv.in', '9820112233',
 1000000, 800000, 'HEALTHY', '2026-09-30', 'ACTIVE', 7, 'Recently incorporated OPC. First annual return due September 2026.'),

-- 22. MapleLeaf IT Solutions LLP
('00000000-0022-0022-0022-000000000022', 'MapleLeaf IT Solutions LLP', 'LLP', '2018-07-10',
 'AAA-7890', 'AACML1415V', NULL, '29AACML1415V1Z9', 'RoC-Bangalore', 'March',
 'Electronic City Phase 1', 'Bengaluru', 'Karnataka', '560100', 'corporate@mapleleafit.com', '9900112233',
 4000000, 2500000, 'OVERDUE', '2026-05-20', 'ACTIVE', 62, 'Form-8 overdue. 2 partners not filed KYC. Immediate action needed.'),

-- 23. Arrow Exports Pvt Ltd
('00000000-0023-0023-0023-000000000023', 'Arrow Exports Private Limited', 'PRIVATE_LIMITED', '2011-10-12',
 'U51909GJ2011PTC090789', 'AABCA1516W', 'SURA15160W', '24AABCA1516W1Z0', 'RoC-Ahmedabad', 'March',
 'Sindhu Bhavan Road, Bodakdev', 'Ahmedabad', 'Gujarat', '380054', 'cs@arrowexports.in', '9909001122',
 12000000, 8000000, 'HEALTHY', '2026-10-31', 'ACTIVE', 25, 'Exporter. DGFT license renewed. All MCA filings current.'),

-- 24. Lakewood Hotels Pvt Ltd
('00000000-0024-0024-0024-000000000024', 'Lakewood Hotels Private Limited', 'PRIVATE_LIMITED', '2009-11-20',
 'U55100TN2009PTC100890', 'AABCL1617X', 'CHER16170X', '33AABCL1617X1Z1', 'RoC-Chennai', 'March',
 'Anna Nagar West, 3rd Ave', 'Chennai', 'Tamil Nadu', '600040', 'compliance@lakewoodhotels.in', '9444223344',
 40000000, 30000000, 'AT_RISK', '2026-06-30', 'ACTIVE', 55, 'Hospitality sector. Shop & establishment renewal pending. 1 director KYC expired.'),

-- 25. TerraFirm Agriculture Pvt Ltd
('00000000-0025-0025-0025-000000000025', 'TerraFirm Agriculture Private Limited', 'PRIVATE_LIMITED', '2014-05-05',
 'U01100MP2014PTC110901', 'AABCT1718Y', 'BPLR17180Y', '23AABCT1718Y1Z2', 'RoC-Gwalior', 'March',
 'Hoshangabad Road', 'Bhopal', 'Madhya Pradesh', '462026', 'admin@terrafirm.ag', '9826001234',
 7000000, 4500000, 'HEALTHY', '2026-09-30', 'ACTIVE', 16, 'AgriTech company. APEDA registration renewed.'),

-- 26. ZionSoft Technologies Pvt Ltd (STRUCK OFF)
('00000000-0026-0026-0026-000000000026', 'ZionSoft Technologies Private Limited', 'PRIVATE_LIMITED', '2013-03-01',
 'U72200KA2013PTC120012', 'AABCZ1819Z', NULL, NULL, 'RoC-Bangalore', 'March',
 'HSR Layout, Sector 6', 'Bengaluru', 'Karnataka', '560102', NULL, NULL,
 2000000, 1000000, 'NOT_APPLICABLE', NULL, 'STRUCK_OFF', 0, 'Company struck off from MCA register in 2024.'),

-- 27. DeepBlue Marine LLP
('00000000-0027-0027-0027-000000000027', 'DeepBlue Marine LLP', 'LLP', '2017-12-01',
 'AAA-2109', 'AACDM2010A', NULL, '21AACDM2010A1Z5', 'RoC-Cuttack', 'March',
 'Paradip Port Area', 'Paradip', 'Odisha', '754142', 'cs@deepbluemarine.in', '9437001234',
 3000000, 2000000, 'AT_RISK', '2026-07-31', 'ACTIVE', 35, 'Maritime LLP. 1 partner added in FY 2025, supplementary deed pending.'),

-- 28. NorthStar Capital Partners LLP
('00000000-0028-0028-0028-000000000028', 'NorthStar Capital Partners LLP', 'LLP', '2020-08-15',
 'AAA-4321', 'AABCN2101B', NULL, '07AABCN2101B1Z3', 'RoC-Delhi', 'March',
 'Janpath Lane, Connaught Place', 'New Delhi', 'Delhi', '110001', 'ops@northstarcapital.in', '9810334455',
 10000000, 8000000, 'HEALTHY', '2026-10-31', 'ACTIVE', 9, 'SEBI registered investment manager.'),

-- 29. GlobalFab Textiles Pvt Ltd
('00000000-0029-0029-0029-000000000029', 'GlobalFab Textiles Private Limited', 'PRIVATE_LIMITED', '2007-08-18',
 'U17219TN2007PTC060234', 'AABCG2202C', 'CHER22020C', '33AABCG2202C1Z7', 'RoC-Chennai', 'March',
 'Tirupur, Avinashi Road', 'Tirupur', 'Tamil Nadu', '641603', 'secretarial@globalfabtex.com', '9894112233',
 35000000, 25000000, 'OVERDUE', '2026-05-08', 'ACTIVE', 72, 'Textile exporter. MGT-7 overdue. 3 directors KYC pending.'),

-- 30. SilverBridge Infra Section 8
('00000000-0030-0030-0030-000000000030', 'SilverBridge Infrastructure Foundation', 'SECTION_8', '2016-09-25',
 'U85300MH2016NPL280567', 'AABCS2303D', NULL, '27AABCS2303D1Z4', 'RoC-Mumbai', 'March',
 'Worli, Dr Annie Besant Road', 'Mumbai', 'Maharashtra', '400018', 'csr@silverbridgefoundation.org', '9820445566',
 NULL, NULL, 'HEALTHY', '2026-09-30', 'ACTIVE', 13, 'Section 8 NGO. CSR funds received from 5 corporates. Annual report filed.');


-- ============================================================
-- Seed entity_director entries
-- ============================================================
INSERT INTO entity_director (entity_id, director_name, din, designation, email, phone, pan, kyc_status, kyc_due_date, appointment_date) VALUES
('00000000-0001-0001-0001-000000000001', 'Arjun Mehta', '01234567', 'Managing Director', 'arjun@earendel.in', '9876543210', 'BKMPM1234A', 'COMPLETED', '2026-12-31', '2019-03-15'),
('00000000-0001-0001-0001-000000000001', 'Priya Sharma', '07654321', 'Director', 'priya@earendel.in', '9876543211', 'BKMPS5678B', 'COMPLETED', '2026-12-31', '2021-04-01'),
('00000000-0002-0002-0002-000000000002', 'Dr. Vivek Gupta', '02345678', 'Designated Partner', 'vivek@zenithhealthcare.com', '9123456789', 'CDFPG2345C', 'PENDING', '2026-09-30', '2017-08-22'),
('00000000-0002-0002-0002-000000000002', 'Anita Rao', '08765432', 'Designated Partner', 'anita@zenithhealthcare.com', '9123456790', 'CDFAR3456D', 'COMPLETED', '2026-12-31', '2019-01-01'),
('00000000-0003-0003-0003-000000000003', 'Rahul Singhania', '03456789', 'CEO & Director', 'rahul@alpharetail.in', '9988776655', 'DEFRS3456E', 'OVERDUE', '2025-12-31', '2015-11-10'),
('00000000-0003-0003-0003-000000000003', 'Kavita Patel', '09876543', 'CFO & Director', 'kavita@alpharetail.in', '9988776656', 'DEFKP4567F', 'OVERDUE', '2025-12-31', '2018-05-15'),
('00000000-0005-0005-0005-000000000005', 'Sanjay Kumar Verma', '04567890', 'Managing Director', 'sanjay@meridiancon.com', '9911223344', 'EFGSK4567G', 'PENDING', '2026-06-30', '2010-06-18'),
('00000000-0009-0009-0009-000000000009', 'Ramesh Bhatt', '05678901', 'Chairman & MD', 'ramesh@bluestar.com', '9925336677', 'FGHBR5678H', 'COMPLETED', '2026-12-31', '2005-07-30'),
('00000000-0009-0009-0009-000000000009', 'Neha Bhatt', '06789012', 'Whole-time Director', 'neha@bluestar.com', '9925336678', 'FGHNB6789I', 'COMPLETED', '2026-12-31', '2010-04-01'),
('00000000-0017-0017-0017-000000000017', 'Dilip Chatterjee', '07890123', 'Managing Director', 'dilip@bharatsteel.in', '9434223344', 'GHIDC7890J', 'EXPIRED', '2025-09-30', '2001-09-15');


-- ============================================================
-- Seed entity_compliance entries
-- ============================================================
INSERT INTO entity_compliance (entity_id, compliance_name, form_name, category, status, risk_level, due_date, financial_year, pending_documents) VALUES
-- Earendel
('00000000-0001-0001-0001-000000000001', 'Annual Return', 'MGT-7', 'ROC', 'PENDING', 'LOW', '2026-09-30', '2025-26', '{}'),
('00000000-0001-0001-0001-000000000001', 'Financial Statements', 'AOC-4', 'ROC', 'PENDING', 'LOW', '2026-09-30', '2025-26', '{}'),
('00000000-0001-0001-0001-000000000001', 'GST Annual Return', 'GSTR-9', 'GST', 'COMPLETED', 'LOW', '2025-12-31', '2024-25', '{}'),
-- Alpha Retail (OVERDUE)
('00000000-0003-0003-0003-000000000003', 'Annual Return', 'MGT-7', 'ROC', 'OVERDUE', 'HIGH', '2025-11-30', '2024-25', ARRAY['Signed MGT-7', 'DSC of Directors']),
('00000000-0003-0003-0003-000000000003', 'Financial Statements', 'AOC-4', 'ROC', 'OVERDUE', 'HIGH', '2025-11-30', '2024-25', ARRAY['Audited Balance Sheet', 'P&L Statement']),
('00000000-0003-0003-0003-000000000003', 'Director KYC', 'DIR-3 KYC', 'ROC', 'OVERDUE', 'CRITICAL', '2025-09-30', '2025-26', ARRAY['Aadhaar copy', 'PAN copy', 'Passport photo']),
-- Meridian (CRITICAL)
('00000000-0005-0005-0005-000000000005', 'Annual Return', 'MGT-7', 'ROC', 'OVERDUE', 'CRITICAL', '2025-09-30', '2024-25', ARRAY['MGT-7 signed']),
('00000000-0005-0005-0005-000000000005', 'Income Tax Return', 'ITR-6', 'INCOME_TAX', 'OVERDUE', 'CRITICAL', '2025-10-31', '2024-25', ARRAY['Audit Report', 'Tax Computation']),
-- Zenith LLP
('00000000-0002-0002-0002-000000000002', 'LLP Annual Return', 'LLP-11', 'ROC', 'PENDING', 'MEDIUM', '2026-06-30', '2025-26', ARRAY['Solvency Statement']),
('00000000-0002-0002-0002-000000000002', 'Partner KYC', 'DIR-3 KYC', 'ROC', 'PENDING', 'HIGH', '2026-06-30', '2025-26', ARRAY['Aadhaar', 'PAN']),
-- BlueStar Public
('00000000-0009-0009-0009-000000000009', 'Annual General Meeting', 'MGT-15', 'ROC', 'PENDING', 'MEDIUM', '2026-06-15', '2025-26', ARRAY['Notice draft', 'Annual Report']),
-- Bharat Steel (CRITICAL)
('00000000-0017-0017-0017-000000000017', 'Annual Return', 'MGT-7', 'ROC', 'OVERDUE', 'CRITICAL', '2024-11-30', '2023-24', ARRAY['MGT-7', 'Director DSC']),
('00000000-0017-0017-0017-000000000017', 'Financial Statements', 'AOC-4', 'ROC', 'OVERDUE', 'CRITICAL', '2024-10-31', '2023-24', ARRAY['Audited Accounts', 'Auditor Report']);
