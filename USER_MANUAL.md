# Dental Hospital Management System (DHMS)
## Comprehensive User Manual & Operating Instructions

Welcome to the **Dental Hospital Management System (DHMS)** user manual. This document provides step-by-step instructions for operating every feature and workflow in the application, from routine receptionist tasks to clinical consultation, dental laboratory tracking, billing, and system administration.

---

## Table of Contents
1. [Overview & Navigation](#1-overview--navigation)
2. [Role Switcher & Simulator Toolbar](#2-role-switcher--simulator-toolbar)
3. [Patients Registry & EHR Management](#3-patients-registry--ehr-management)
4. [Interactive FDI Odontogram & Dental Charting](#4-interactive-fdi-odontogram--dental-charting)
5. [Appointment Scheduling & Queue Management](#5-appointment-scheduling--queue-management)
6. [Clinical Consultations & Prescriptions](#6-clinical-consultations--prescriptions)
7. [Dental Laboratory Kanban Workflow](#7-dental-laboratory-kanban-workflow)
8. [Digital X-Rays & Imaging Vault](#8-digital-x-rays--imaging-vault)
9. [Billing, Invoicing & Receipts](#9-billing-invoicing--receipts)
10. [Access Control (RBAC) & Compliance Audit Logs](#10-access-control-rbac--compliance-audit-logs)
11. [Supabase Cloud Synchronization & Local Storage](#11-supabase-cloud-synchronization--local-storage)
12. [Cloudflare Pages Deployment Guide](#12-cloudflare-pages-deployment-guide)

---

## 1. Overview & Navigation

The DHMS interface consists of three primary regions:
- **Top Bar**: Displays the hospital logo, active clinic location, live connectivity status (Local / Supabase Cloud), search bar, and active user profile.
- **Sidebar Menu**: Quick navigation between all 9 operational modules (Dashboard, Patients, Odontogram, Appointments, Consultations, Lab Cases, X-Rays, Billing, Access Control).
- **Simulator / Admin Toolbar**: Positioned at the top of the screen to simulate user roles, device viewports (Desktop, Tablet, Mobile), and configure cloud credentials.

---

## 2. Role Switcher & Simulator Toolbar

DHMS includes built-in Role-Based Access Control (RBAC). You can switch user personas on the fly to test permissions:

1. **User Role Selector** (`sim-user-select`):
   - **Dr. Sarah Jenkins** (Senior Dentist / Admin): Full system access, clinical notes, treatment plans, billing, & audit logs.
   - **Priya Sharma** (Front Desk / Receptionist): Patient registration, appointments scheduling, invoice generation (cannot edit clinical diagnosis).
   - **David Miller** (Dental Assistant): Patient intake, X-Ray file uploads, lab order tracking.
   - **Dr. Robert Vance** (Practice Manager): Analytics, lab billing, user permission configuration.
2. **Device Viewport Simulator** (`sim-device-select`):
   - Toggle between **Desktop**, **Tablet**, and **Mobile** views to preview how the layout adjusts responsively.
3. **Supabase Cloud Configuration Button**:
   - Opens the database setup modal to connect a live Supabase PostgreSQL database.

---

## 3. Patients Registry & EHR Management

### Registering a New Patient
1. Click **Patients** in the sidebar menu.
2. Click the **+ Register New Patient** button at the top right.
3. Complete the patient details form:
   - **Personal Info**: Full Name, Age, Date of Birth, Gender, Phone, Email, Address.
   - **Medical History**: Check applicable systemic conditions (Diabetes, Hypertension, Heart Condition, Bleeding Disorders, Asthma, Pregnancy, etc.).
   - **Allergies & Current Medications**: List known drug allergies (e.g., Penicillin, Latex) and active medications.
   - **Dental History**: Add notes regarding past restorations, surgeries, or orthodontic treatments.
4. Click **Save Patient Record**.

### Patient Search & Filtering
- Use the **Search Bar** to instantly find patients by Name, Patient ID (e.g., `PAT-1001`), Phone Number, or Email.
- Filter by status (**In Progress**, **Scheduled**, **Completed**) or view outstanding balances.

---

## 4. Interactive FDI Odontogram & Dental Charting

The FDI World Dental Federation two-digit numbering system is used for charting (11-18, 21-28, 31-38, 41-48 for adult teeth, and 51-55, 61-65, 71-75, 81-85 for primary teeth).

### Charting Teeth Conditions & Surfaces
1. Select a patient from the dropdown list in the **Odontogram** view.
2. Click on any individual tooth in the upper or lower arch diagram.
3. In the tooth popup editor:
   - Select the **Condition**: *Sound (Healthy)*, *Caries (Decay)*, *Filled (Composite/Amalgam)*, *Crown Placement*, *Extraction Needed*, *Missing Tooth*, or *Root Canal Treated (RCT)*.
   - Select affected **Tooth Surfaces**: **M** (Mesial), **D** (Distal), **O/I** (Occlusal/Incisal), **B/L** (Buccal/Labial), **L/P** (Lingual/Palatal).
   - Enter specific clinical notes for the tooth.
4. Click **Update Tooth Record**. The visual chart will immediately update with color-coded status badges and surface highlights.

---

## 5. Appointment Scheduling & Queue Management

### Booking an Appointment
1. Click **Appointments** in the sidebar.
2. Click **+ Schedule Appointment**.
3. Fill in appointment fields:
   - **Patient**: Select existing patient or type candidate name.
   - **Dentist**: Select attending practitioner.
   - **Date & Time**: Select appointment date and slot.
   - **Procedure Type**: Consultation, Scaling & Polishing, Root Canal, Crown Preparation, Extraction, Surgical, Ortho Adjustment.
   - **Duration**: 15 min, 30 min, 45 min, 60 min, or 90 min.
4. Click **Book Appointment**.

### Queue & Status Management
- Update appointment status with one click: **Scheduled** ➔ **In Progress** ➔ **Completed** (or **Cancelled**).
- Filter calendar views by day, week, or practitioner.

---

## 6. Clinical Consultations & Prescriptions

### Conducting a Consultation
1. Navigate to **Consultations**.
2. Select the patient currently in the dental chair.
3. Record clinical notes:
   - **Chief Complaint**: Patient's primary symptom or request (e.g., "Severe pain in lower right quadrant").
   - **Clinical Examination**: Intraoral findings, probing depths, soft tissue evaluation.
   - **Diagnosis**: Formulated diagnosis (e.g., "Symptomatic Irreversible Pulpitis #46").
   - **Proposed Treatment Plan**: Recommended dental procedures.

### Building Digital Prescriptions
1. In the Consultation window, use the **Prescription Builder**.
2. Add medications:
   - Select/Type **Drug Name** (e.g., *Amoxicillin 500mg*, *Ibuprofen 400mg*, *Chlorhexidine Mouthwash*).
   - Set **Dosage**: e.g., 1 tablet.
   - Set **Frequency**: *TDS (3x daily)*, *BD (2x daily)*, *OD (1x daily)*, *PRN (as needed)*.
   - Set **Duration**: 3 Days, 5 Days, 7 Days.
3. Click **Add Medication**.
4. Click **Print / Save Prescription** to generate a clean, official prescription PDF/printout.

---

## 7. Dental Laboratory Kanban Workflow

Track custom dental restorations sent to external commercial dental laboratories.

### Creating & Managing Lab Cases
1. Go to **Lab Cases** in the sidebar.
2. View the visual **Kanban Board** with 5 stages:
   - 📤 **Lab Order Sent**
   - ⚙️ **Work In Progress**
   - 🔍 **Quality Check**
   - 📦 **Received at Clinic**
   - ✅ **Delivered to Patient**
3. Click **+ New Lab Order** to register a new case (Patient Name, Lab Name, Restoration Type e.g., *Zirconia Crown*, *PFM Bridge*, *Acrylic Denture*, Sent Date, Expected Return Date, Lab Cost).
4. Drag and drop cards across columns or use the action menu to advance status.

---

## 8. Digital X-Rays & Imaging Vault

### Uploading & Viewing Radiographs
1. Go to **X-Rays & Imaging**.
2. Select a patient.
3. Upload intraoral or extraoral radiographs (Periapical, Bitewing, Panoramic OPG, CBCT 3D Scan).
4. Click any radiograph thumbnail to open the high-resolution lightbox viewer.
5. Add radiograph diagnostic tags (e.g., *"Periapical radiolucency #36"*, *"Impacted wisdom tooth #48"*).

---

## 9. Billing, Invoicing & Receipts

### Generating an Invoice
1. Click **Billing** in the sidebar menu.
2. Click **+ Create New Invoice**.
3. Select Patient Name.
4. Add line items:
   - Select procedure from treatment catalog (e.g., *Root Canal Therapy*, *Composite Filling*, *Porcelain Crown*, *Scaling & Polishing*).
   - Enter quantity and unit price.
5. Apply **Discounts** (%) and **Taxes** (GST/VAT if applicable).
6. Select **Payment Method**: Cash, Credit/Debit Card, UPI / QR Code, Net Banking, or Dental Insurance.
7. Record **Paid Amount** and remaining **Balance**.
8. Click **Generate Invoice**. You can click **Print Receipt** for a formal patient bill.

---

## 10. Access Control (RBAC) & Compliance Audit Logs

### Permission Matrix Management
1. Navigate to **Access Control**.
2. View the permission grid across all system roles (*Dentist*, *Hygienist*, *Receptionist*, *Practice Manager*, *Admin*).
3. System privileges are enforced for:
   - Reading/Writing Patient Records
   - Modifying Clinical Notes & Odontograms
   - Generating Invoices & Financial Reports
   - Configuring System Settings & Users

### HIPAA/DPA Audit Trail
- Every critical action (Patient creation, medical record update, billing transaction, user sign-in, X-ray viewing) is automatically recorded in the immutable **Audit Log**.
- View timestamp, user identity, module, action type, and client device details in the **Audit Logs** tab.

---

## 11. Supabase Cloud Synchronization & Local Storage

DHMS operates seamlessly offline using browser **LocalStorage** by default. To sync data across multiple clinic computers or devices in real time:

1. Click **Supabase Config** in the top simulator bar.
2. Enter your **Supabase URL** and **Anon API Key**.
3. Execute [`supabase-schema.sql`](file:///c:/Users/Ratna%20Prasad/Desktop/dental%20hospital%20managrement%20system/supabase-schema.sql) in your Supabase SQL Editor.
4. Click **Save Credentials & Connect**.

---

## 12. Cloudflare Pages & Workers Deployment & Troubleshooting Guide

### Why You Might Not Get a URL or Why the Page Doesn't Open Properly

If you tried deploying and did **not get a URL** or the URL **opened to a blank page / error**, here are the common causes and solutions:

#### 1. Command Line Authentication Issue (No URL output)
When deploying via CLI (`npx wrangler deploy` or `npx wrangler pages deploy`), Wrangler requires active login credentials.
- **Fix**: Run `npx wrangler login` in your terminal first to authenticate with Cloudflare in your web browser. Once authorized, re-run `npx wrangler pages deploy .`.

#### 2. Blank Screen / MIME Type / 404 Errors on Deployed URL
When hosting single-page web apps with JavaScript ES modules (`type="module"`), static asset routers can block nested paths or respond with HTML (causing `Unexpected token '<'` errors).
- **Fix**: We have configured `wrangler.jsonc` with `"html_handling": "single-page-app"` and `"not_found_handling": "single-page-app"`, as well as file exclusions (`.git`, `node_modules`, etc.).

---

### Step-by-Step Deployment Methods

#### Method A: Deploying via Cloudflare Dashboard (Recommended - 100% Reliable & Automatic URL)
1. Push your repository to **GitHub**.
2. Log into the [Cloudflare Dashboard](https://dash.cloudflare.com/).
3. Navigate to **Workers & Pages** ➔ **Create application** ➔ **Pages** tab ➔ **Connect to Git**.
4. Select your `dental-hospital-management-system` repository.
5. In build settings:
   - **Framework preset**: *None*
   - **Build command**: *(leave blank or `npm run build`)*
   - **Build output directory**: `/`
6. Click **Save and Deploy**.
7. Cloudflare will automatically generate your live public URL: `https://<your-project>.pages.dev`.

#### Method B: Deploying via Terminal (Wrangler CLI)
1. Log in to Cloudflare CLI:
   ```bash
   npx wrangler login
   ```
2. Deploy to Cloudflare Pages:
   ```bash
   npx wrangler pages deploy . --project-name=dental-hospital-management-system
   ```
   *(Or for Cloudflare Workers Assets: `npx wrangler deploy`)*
3. The terminal will display your live deployment URL at the end of the upload process:
   `✨ Deployment complete! Take a look: https://dental-hospital-management-system.pages.dev`

---
*Dental Hospital Management System v2.5 — Built for modern dental practices.*
