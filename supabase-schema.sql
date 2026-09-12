-- ========================================================
-- DENTAL HOSPITAL MANAGEMENT SYSTEM - SUPABASE SQL SCHEMA
-- Copy and paste this script into your Supabase SQL Editor and click "Run".
-- ========================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. PATIENTS TABLE
CREATE TABLE IF NOT EXISTS public.patients (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    age INT,
    dob DATE,
    gender TEXT,
    phone TEXT,
    email TEXT,
    address TEXT,
    last_visit DATE,
    next_appointment TEXT,
    treatment_status TEXT DEFAULT 'New',
    outstanding_balance NUMERIC DEFAULT 0,
    medical_history JSONB DEFAULT '[]'::jsonb,
    allergies JSONB DEFAULT '[]'::jsonb,
    current_medications JSONB DEFAULT '[]'::jsonb,
    dental_history TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. APPOINTMENTS TABLE
CREATE TABLE IF NOT EXISTS public.appointments (
    id TEXT PRIMARY KEY,
    patient_id TEXT REFERENCES public.patients(id) ON DELETE CASCADE,
    patient_name TEXT,
    dentist_id TEXT,
    dentist_name TEXT,
    date DATE,
    time TEXT,
    duration TEXT,
    type TEXT,
    status TEXT DEFAULT 'Scheduled',
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. ODONTOGRAM / TEETH DATA TABLE
CREATE TABLE IF NOT EXISTS public.teeth_records (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    patient_id TEXT REFERENCES public.patients(id) ON DELETE CASCADE,
    tooth_number TEXT NOT NULL,
    condition TEXT NOT NULL,
    notes TEXT,
    surfaces JSONB DEFAULT '[]'::jsonb,
    updated_by TEXT,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(patient_id, tooth_number)
);

-- 4. LABORATORY CASES TABLE
CREATE TABLE IF NOT EXISTS public.lab_cases (
    id TEXT PRIMARY KEY,
    patient_name TEXT NOT NULL,
    dentist_name TEXT,
    lab_name TEXT,
    work_required TEXT,
    sent_date DATE,
    expected_date DATE,
    actual_date DATE,
    status TEXT DEFAULT 'SENT',
    cost NUMERIC DEFAULT 0,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. INVOICES TABLE
CREATE TABLE IF NOT EXISTS public.invoices (
    id TEXT PRIMARY KEY,
    patient_id TEXT REFERENCES public.patients(id) ON DELETE SET NULL,
    patient_name TEXT NOT NULL,
    date DATE,
    items JSONB DEFAULT '[]'::jsonb,
    subtotal NUMERIC DEFAULT 0,
    discount NUMERIC DEFAULT 0,
    tax NUMERIC DEFAULT 0,
    grand_total NUMERIC DEFAULT 0,
    paid_amount NUMERIC DEFAULT 0,
    balance NUMERIC DEFAULT 0,
    status TEXT DEFAULT 'UNPAID',
    payment_method TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. AUDIT LOGS TABLE
CREATE TABLE IF NOT EXISTS public.audit_logs (
    id TEXT PRIMARY KEY,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    user_id TEXT,
    user_name TEXT,
    device TEXT,
    module TEXT,
    action TEXT,
    details TEXT
);

-- ENABLE ROW LEVEL SECURITY (RLS) & ALLOW ANONYMOUS READ/WRITE FOR DEMO
ALTER TABLE public.patients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.teeth_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lab_cases ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access on patients" ON public.patients FOR SELECT USING (true);
CREATE POLICY "Allow public insert/update access on patients" ON public.patients FOR ALL USING (true);

CREATE POLICY "Allow public read access on appointments" ON public.appointments FOR SELECT USING (true);
CREATE POLICY "Allow public insert/update access on appointments" ON public.appointments FOR ALL USING (true);

CREATE POLICY "Allow public read access on teeth_records" ON public.teeth_records FOR SELECT USING (true);
CREATE POLICY "Allow public insert/update access on teeth_records" ON public.teeth_records FOR ALL USING (true);

CREATE POLICY "Allow public read access on lab_cases" ON public.lab_cases FOR SELECT USING (true);
CREATE POLICY "Allow public insert/update access on lab_cases" ON public.lab_cases FOR ALL USING (true);

CREATE POLICY "Allow public read access on invoices" ON public.invoices FOR SELECT USING (true);
CREATE POLICY "Allow public insert/update access on invoices" ON public.invoices FOR ALL USING (true);

CREATE POLICY "Allow public read access on audit_logs" ON public.audit_logs FOR SELECT USING (true);
CREATE POLICY "Allow public insert/update access on audit_logs" ON public.audit_logs FOR ALL USING (true);

-- SEED MOCK DATA INTO PATIENTS
INSERT INTO public.patients (id, name, age, dob, gender, phone, email, address, last_visit, next_appointment, treatment_status, outstanding_balance, medical_history, allergies, current_medications, dental_history)
VALUES 
('PAT-1001', 'Anita Roy', 34, '1992-05-14', 'Female', '+91 98765 43210', 'anita.roy@example.com', '42 Park Street, Metro City', '2026-09-02', '2026-09-15 10:30 AM', 'In Progress', 3450, '["Hypertension (Controlled)"]'::jsonb, '["Penicillin", "Sulfa drugs"]'::jsonb, '["Amlodipine 5mg"]'::jsonb, 'Restoration on tooth 16, Root Canal on 26 in 2024.'),
('PAT-1002', 'Vikram Malhotra', 48, '1978-11-20', 'Male', '+91 98123 76543', 'v.malhotra@example.com', '108 Commercial Avenue', '2026-08-28', '2026-09-12 02:00 PM', 'Scheduled', 0, '["Type 2 Diabetes"]'::jsonb, '["None known"]'::jsonb, '["Metformin 500mg"]'::jsonb, 'Crown placement required on tooth 46.'),
('PAT-1003', 'Sophia Chen', 26, '2000-02-18', 'Female', '+91 97541 23890', 'sophia.c@example.com', '77 Silicon Heights', '2026-09-08', '2026-09-20 11:00 AM', 'Completed', 0, '["Asthma"]'::jsonb, '["Latex"]'::jsonb, '["Inhaler as needed"]'::jsonb, 'Composite fillings on teeth 14, 15, 24.'),
('PAT-1004', 'Rajesh Sharma', 55, '1971-08-04', 'Male', '+91 99001 12233', 'r.sharma55@example.com', '15 Green Wood Colony', '2026-09-10', '2026-09-11 04:30 PM', 'In Progress', 12800, '["Heart Stent (2021)"]'::jsonb, '["Aspirin"]'::jsonb, '["Clopidogrel", "Atorvastatin"]'::jsonb, 'Full mouth scaling & multiple implants planned.')
ON CONFLICT (id) DO NOTHING;
