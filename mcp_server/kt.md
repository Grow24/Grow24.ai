# 📘 Knowledge Transfer Document - HBMP Form Manager & McGraw Hill Scraper

## 📑 Table of Contents

1. [Quick Start Commands](#-quick-start-commands)
2. [Project Overview](#project-overview)
3. [Business Context & Purpose](#business-context--purpose)
4. [Architecture & Tech Stack](#architecture--tech-stack)
5. [How to Run Locally](#how-to-run-locally)
6. [Common Workflows](#common-workflows)
7. [Troubleshooting](#troubleshooting)

---

## ⚡ Quick Start Commands

### **Run Form Manager (Backend + Frontend)**

```bash
# Terminal 1: Start Backend
cd /Users/abhinavrai/DST/play_mcp/hbmp-form-manager/backend
npm run dev
# Runs on: http://localhost:5001

# Terminal 2: Start Frontend (new window)
cd /Users/abhinavrai/DST/play_mcp/hbmp-form-manager/frontend
npm run dev
# Runs on: http://localhost:3000

# Browser: Open http://localhost:3000
# Token: Check backend/.env for SECRET_TOKEN
```

### **Run Scraper (Extract Questions)**

```bash
# Setup (one-time)
cd /Users/abhinavrai/DST/mcp_server/mcp
python3 -m venv venv
source venv/bin/activate
python3 -m pip install -r requirements.txt
python3 -m playwright install chromium

# For QA (Quantitative Aptitude) - Complete Pipeline
python scrape.py                # Select option 1
python fix.py && python add_latex_v2.py && python add_themes.py && python upload.py

# For VARC (Verbal Ability) - Complete Pipeline
python scrape.py                # Select option 2
python extract_passages.py && python fix.py && python upload.py

# For DI & LR (Data Interpretation) - Complete Pipeline
python scrape.py                # Select option 3
python extract_passages.py && python fix.py && python upload.py
```

### **Quick Test**

```bash
# Backend health
curl http://localhost:5001/health

# Get questions (replace YOUR_TOKEN)
curl -H "x-secret-token: YOUR_TOKEN" http://localhost:5001/api/admin/questions
```

---

## 🎯 Project Overview

This is a **dual-purpose system** consisting of two interconnected projects:

### **1. HBMP Form Manager**

A modern, full-stack form management system that replaces Google Apps Script for creating and managing Google Forms from spreadsheet data. It provides advanced features like LaTeX math rendering, image support, and custom validation.

### **2. McGraw Hill Edge Scraper (MCP)**

An automated web scraping tool that extracts exam questions from McGraw Hill Edge platform and uploads them directly to Google Sheets, which then feeds into the Form Manager.

**Key Integration:** Scraped questions from MCP → Google Sheets → Form Manager → Google Forms

---

## 🏢 Business Context & Purpose

### Why Was This Created?

**Problems Solved:**

- ❌ Google Apps Script 6-minute timeout → ✅ Node.js unlimited execution
- ❌ Manual question entry from McGraw Hill → ✅ Automated scraping
- ❌ No LaTeX math support → ✅ KaTeX rendering
- ❌ Limited image handling → ✅ Google Drive integration
- ❌ No form preview → ✅ Live preview before deployment
- ❌ No version control → ✅ Form versioning system

---

## 📍 Where It Has Been Used

### **Primary Use Case: Educational Assessment System**

#### **1. CAT (Common Admission Test) Preparation**

- Scraping and managing CAT exam questions across sections:
  - **QA (Quantitative Aptitude)** - Mathematics questions
  - **VARC (Verbal Ability & Reading Comprehension)** - Passage-based questions
  - **DI & LR (Data Interpretation & Logical Reasoning)** - Data analysis questions

#### **2. HBMP (Hypothesized Business Management Program)**

- Creating practice tests and assessments
- Managing question banks with 500+ questions
- Deploying timed examinations with automatic grading

#### **3. Educational Institutions**

- Creating custom forms for student assessments
- Managing large question databases
- Automated deployment of periodic tests

### **Real-World Application:**

```
McGraw Hill Edge (Source)
    ↓
Scraper (Automated Extraction)
    ↓
Google Sheets (Question Bank - 500+ questions)
    ↓
Form Manager (Create & Deploy Forms)
    ↓
Google Forms (Student Assessment)
    ↓
Response Collection (Automated Analysis)
```

---

## 🏗️ Architecture & Tech Stack

### **High-Level Architecture**

```
┌─────────────────────────────────────────────────────────────┐
│                    CLIENT LAYER                              │
├─────────────────────────────────────────────────────────────┤
│  React Admin Dashboard     │    React Form Viewer           │
│  (Port 3000)               │    (Port 3001)                 │
│  - Question Management     │    - Form Display              │
│  - Form Deployment         │    - LaTeX Rendering           │
│  - Preview Generation      │    - Image Display             │
└──────────────┬──────────────────────────────┬───────────────┘
               │                              │
               │         REST API             │
               ↓                              ↓
┌─────────────────────────────────────────────────────────────┐
│                    SERVER LAYER                              │
├─────────────────────────────────────────────────────────────┤
│          Node.js Express Server (Port 5000/5001)            │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  Routes:                                             │   │
│  │  - /api/questions  - Question CRUD                   │   │
│  │  - /api/forms      - Form deployment & listing       │   │
│  │  - /api/preview    - Preview generation              │   │
│  │  - /api/admin      - Admin operations                │   │
│  │  - /api/auth       - Authentication                  │   │
│  │  - /api/images     - Image upload/management         │   │
│  └──────────────────────────────────────────────────────┘   │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  Services:                                           │   │
│  │  - googleSheets.js  - Sheets API integration         │   │
│  │  - googleForms.js   - Forms API integration          │   │
│  │  - googleDrive.js   - Drive API integration          │   │
│  │  - oauth2.js        - Authentication service         │   │
│  └──────────────────────────────────────────────────────┘   │
└──────────────┬───────────────────────────────────┬──────────┘
               │                                   │
               ↓                                   ↓
┌─────────────────────────────────────────────────────────────┐
│                    DATA LAYER                                │
├─────────────────────────────────────────────────────────────┤
│  Google Sheets          │  Google Forms  │  Google Drive    │
│  (Question Bank)        │  (Deployed)    │  (Images)        │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                 SCRAPER COMPONENT (MCP)                      │
├─────────────────────────────────────────────────────────────┤
│  Playwright Automation → McGraw Hill Edge                   │
│           ↓                                                  │
│  Question Extraction (scrape.py)                            │
│           ↓                                                  │
│  Data Processing Pipeline:                                  │
│    1. fix.py           - Clean & normalize                  │
│    2. add_latex_v2.py  - Math equation conversion           │
│    3. add_themes.py    - Auto-categorization                │
│    4. extract_passages.py - Passage extraction (VARC)       │
│           ↓                                                  │
│  upload.py → Google Sheets                                  │
└─────────────────────────────────────────────────────────────┘
```

### **Technology Stack**

**Backend (Form Manager)**
| Technology | Purpose |
|------------|---------|
| Node.js 18+ | Runtime environment |
| Express | Web framework |
| Google APIs | Sheets, Forms, Drive integration |
| Multer | File upload handling |
| Helmet | Security headers |
| CORS | Cross-origin resource sharing |

**Frontend (Form Manager)**
| Technology | Purpose |
|------------|---------|---------|
| React 18+ | UI framework |
| TypeScript | Type safety |
| Vite | Build tool |
| KaTeX | LaTeX rendering |

**Scraper (MCP)**
| Technology | Purpose |
|------------|---------|---------|
| Python 3.9+ | Runtime environment |
| Playwright | Browser automation |
| BeautifulSoup4 | HTML parsing |
| google-auth | Google API authentication |
| gspread | Google Sheets API wrapper |

---

## 🚀 How to Run Locally

### **Prerequisites**

Before starting, ensure you have:

- **Node.js 18+** and npm
- **Python 3.9+** and pip
- **Google Cloud Console** account
- **McGraw Hill Edge** account (for scraping)
- **Git** (for version control)

---

### **Part 1: Google Cloud Setup (One-Time)**

#### **Step 1: Create Google Cloud Project**

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click "Create Project"
3. Name: `HBMP-Form-Manager`
4. Click "Create"

#### **Step 2: Enable Required APIs**

1. In your project, navigate to **APIs & Services** → **Library**
2. Enable the following APIs:
   - ✅ Google Sheets API
   - ✅ Google Forms API
   - ✅ Google Drive API

#### **Step 3: Create Service Account**

1. Go to **IAM & Admin** → **Service Accounts**
2. Click **Create Service Account**
3. Enter details:
   - Name: `hbmp-form-manager-sa`
   - Description: `Service account for form manager`
4. Click **Create and Continue**
5. Grant role: **Editor**
6. Click **Done**

#### **Step 4: Generate Service Account Key**

1. Click on the created service account
2. Go to **Keys** tab
3. Click **Add Key** → **Create New Key**
4. Select **JSON** format
5. Download the file (this is your `service-account.json`)

#### **Step 5: Share Google Sheet**

1. Open your Google Sheet (or create new)
2. Click **Share**
3. Add the service account email from JSON (`client_email` field)
4. Grant **Editor** access
5. Copy the Spreadsheet ID from URL:
   ```
   https://docs.google.com/spreadsheets/d/YOUR_SPREADSHEET_ID/edit
   ```

---

### **Part 2: Setup HBMP Form Manager**

#### **Step 1: Clone & Setup Backend**

```bash
# Navigate to backend directory
cd /Users/abhinavrai/DST/play_mcp/hbmp-form-manager/backend

# Install dependencies
npm install

# Create credentials directory
mkdir -p credentials

# Copy your service account JSON file
cp ~/Downloads/service-account.json credentials/

# Create .env file from example
cp env.example .env
```

#### **Step 2: Configure Backend Environment**

Edit `.env` file:

```bash
# Server configuration
PORT=5001
NODE_ENV=development

# Google Sheets
SPREADSHEET_ID=your_spreadsheet_id_here

# Security
SECRET_TOKEN=MySecretToken#123

# Frontend URLs (for CORS)
FRONTEND_ADMIN_URL=http://localhost:3000
FRONTEND_FORM_URL=http://localhost:3001

# Google Cloud
GOOGLE_APPLICATION_CREDENTIALS=./credentials/service-account.json
```

#### **Step 3: Setup Google Sheet Structure**

Your Google Sheet needs **3 sheets**:

**Sheet 1: "Questions"** (Headers in Row 1)

```
QuestionId | Section | Order | Type | QuestionText | Required | Option1 | Option2 | Option3 | Option4 | Option5 | GoToSectionOnOption | ImageUrl | LaTeX | Constraints
```

**Sheet 2: "RespondentDetails"** (Headers in Row 1)

```
Field | Label | Type | Required | Order
```

**Sheet 3: "FormMetadata"** (Headers in Row 1)

```
Key | Value
```

Add these rows:

- formTitle | Your Form Title
- formDescription | Form description here

#### **Step 4: Start Backend Server**

```bash
# Development mode (with auto-reload)
npm run dev

# Production mode
npm start
```

Server will start on: `http://localhost:5001`

#### **Step 5: Test Backend**

```bash
# Health check
curl http://localhost:5001/health

# Get questions (requires auth)
curl -H "x-secret-token: MySecretToken#123" \
  http://localhost:5001/api/admin/questions
```

#### **Step 6: Setup Frontend**

```bash
# Navigate to frontend directory
cd /Users/abhinavrai/DST/play_mcp/hbmp-form-manager/frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

Frontend will start on: `http://localhost:3000`

#### **Step 7: Build for Production (Optional)**

```bash
# Build frontend
cd frontend
npm run build

# Output in: dist/ directory
```

---

### **Part 3: Setup McGraw Hill Scraper (MCP)**

#### **Step 1: Setup Python Environment**

```bash
# Navigate to MCP directory
cd /Users/abhinavrai/DST/mcp_server/mcp

# Create virtual environment
python3 -m venv venv

# Activate virtual environment
source venv/bin/activate

# Install dependencies (use python3 -m pip to avoid "command not found" errors)
python3 -m pip install -r requirements.txt

# Install Playwright browsers
python3 -m playwright install chromium
```

#### **Step 2: Configure MCP Environment**

Create `.env` file in MCP directory:

```bash
# McGraw Hill Edge Credentials
MCGRAW_EMAIL=your_email@example.com
MCGRAW_PASSWORD=your_password
BASE_URL=https://edge.mheducation.co.in

# Google Sheets (same as form manager)
SPREADSHEET_ID=your_spreadsheet_id_here
```

#### **Step 3: Copy Service Account**

```bash
# Create credentials directory
mkdir -p credentials

# Copy service account JSON
cp ~/Downloads/service-account.json credentials/
```

---

## 📋 Common Workflows

### **Workflow 1: Scrape Questions from McGraw Hill**

#### **For QA (Quantitative Aptitude) Questions:**

```bash
cd /Users/abhinavrai/DST/play_mcp/mcp
source venv/bin/activate

# Step 1: Scrape questions
python scrape.py
# Select option: 1 (QA)
# Browser opens: Log in manually to McGraw Hill Edge
# Navigate to question page
# Press Enter to scrape
# Press 's' to save and exit

# Step 2: Clean and process data
python3 fix.py

# Step 3: Add LaTeX math expressions
python3 add_latex_v2.py

# Step 4: Add theme categorization
python3 add_themes.py

# Step 5: Upload to Google Sheets
python3 upload.py
# Enter name when prompted: "CAT 2024 - QA Slot 1"

# Verify: Check Google Sheet for new questions
```

#### **For VARC (Verbal Ability) Questions:**

```bash
cd /Users/abhinavrai/DST/mcp_server/mcp
source venv/bin/activate

# Step 1: Scrape questions
python3 scrape.py
# Select option: 2 (VARC)

# Step 2: Extract passages
python3 extract_passages.py

# Step 3: Clean data
python3 fix.py

# Step 4: Add themes (inline processing)
python3 -c "import json; questions = json.load(open('cleaned_questions.json')); [q.update({'theme': 'Reading Comprehension'}) for q in questions if 'theme' not in q]; json.dump(questions, open('cleaned_questions_latex_themed.json', 'w'), indent=2, ensure_ascii=False)"

# Step 5: Upload to Sheets
python3 upload.py
# Enter name: "CAT 2024 - VARC Slot 1"
```

#### **Quick Command (After Scraping QA):**

```bash
python3 fix.py && python3 add_latex_v2.py && python3 add_themes.py && python3 upload.py
```

---

### **Workflow 2: Create and Deploy Form**

#### **Using Admin Dashboard (Recommended):**

1. **Access Admin Panel:**
   - Open browser: `http://localhost:3000`
   - Enter secret token: `MySecretToken#123`

2. **View Questions:**
   - Click "Questions" tab
   - Browse available questions from Google Sheet

3. **Generate Preview:**
   - Click "Preview" tab
   - Select questions to include
   - Click "Generate Preview"
   - Review form appearance

4. **Deploy Form:**
   - Click "Deploy" tab
   - Configure form settings:
     - Form title
     - Description
     - Question selection
   - Click "Deploy to Google Forms"
   - Form URL will be generated

#### **Using API (Programmatic):**

```bash
# 1. Get all questions
curl -H "x-secret-token: MySecretToken#123" \
  http://localhost:5001/api/admin/questions

# 2. Generate preview
curl -X POST -H "Content-Type: application/json" \
  -H "x-secret-token: MySecretToken#123" \
  -d '{"questionIds": ["Q001", "Q002"], "version": "v1"}' \
  http://localhost:5001/api/preview

# 3. Deploy form
curl -X POST -H "Content-Type: application/json" \
  -H "x-secret-token: MySecretToken#123" \
  -d '{"title": "Practice Test", "questionIds": ["Q001", "Q002"]}' \
  http://localhost:5001/api/forms/deploy
```

---

### **Workflow 3: Update Existing Questions**

1. **Edit in Google Sheets:**
   - Open your Google Sheet
   - Navigate to "Questions" sheet
   - Edit question text, options, or metadata
   - Save changes

2. **Refresh in System:**
   - Backend automatically reads latest data
   - No restart required
   - Changes reflected immediately in API

3. **Verify Changes:**
   ```bash
   curl -H "x-secret-token: MySecretToken#123" \
     http://localhost:5001/api/admin/questions
   ```

---

### **Workflow 4: Add Images to Questions**

#### **Option 1: Upload via API**

```bash
curl -X POST -H "x-secret-token: MySecretToken#123" \
  -F "image=@/path/to/image.png" \
  -F "questionId=Q001" \
  http://localhost:5001/api/images/upload
```

#### **Option 2: Manual Upload to Drive**

1. Upload image to Google Drive
2. Get shareable link
3. Extract file ID from URL
4. Update Google Sheet:
   - Column: `ImageUrl`
   - Value: `https://drive.google.com/file/d/FILE_ID/view`

---

### **Workflow 5: Monitor and Debug**

#### **Check Backend Logs:**

```bash
# Backend terminal will show:
# - API requests
# - Google API calls
# - Errors and warnings
```

#### **Check Frontend Console:**

```bash
# Browser DevTools Console (F12) shows:
# - API responses
# - React component errors
# - LaTeX rendering issues
```

#### **Validate Scraped Data:**

```bash
cd /Users/abhinavrai/DST/mcp_server/mcp
source venv/bin/activate

# Check data quality
python3 check.py

# View latest scrape
cat debug_screenshots/scrape_*/scraped_questions.json | jq
```

---

## 🔍 Troubleshooting

### **Common Issues & Solutions**

#### **1. Backend Won't Start**

**Error:** `Cannot find module 'googleapis'`

```bash
# Solution:
cd backend
rm -rf node_modules package-lock.json
npm install
```

**Error:** `GOOGLE_APPLICATION_CREDENTIALS not found`

```bash
# Solution: Check .env file
cat backend/.env | grep GOOGLE_APPLICATION_CREDENTIALS

# Verify file exists
ls -la backend/credentials/service-account.json

# Fix path in .env if needed
```

#### **2. Google Sheets API Errors**

**Error:** `The caller does not have permission`

```bash
# Solution:
# 1. Check service account email in JSON
# 2. Verify it's shared with Editor access on Sheet
# 3. Check Spreadsheet ID in .env matches URL
```

**Error:** `Requested entity was not found`

```bash
# Solution: Verify sheet names are exactly:
# - "Questions"
# - "RespondentDetails"
# - "FormMetadata"
# (Case-sensitive)
```

#### **3. Scraper Issues**

**Error:** `zsh: command not found: pip`

```bash
# Solution: Use python3 -m pip instead
python3 -m pip install -r requirements.txt

# Or recreate venv if needed:
deactivate  # if venv is active
rm -rf venv
python3 -m venv venv
source venv/bin/activate
python3 -m pip install -r requirements.txt
python3 -m playwright install chromium
```

**Error:** `Playwright browser not found`

```bash
# Solution:
source venv/bin/activate
python3 -m playwright install chromium
```

**Error:** `Login failed to McGraw Hill`

```bash
# Solution:
# 1. Check .env credentials
# 2. Try manual login first
# 3. Check if website structure changed
```

**Error:** `No questions scraped`

```bash
# Solution:
# 1. Verify you're on the correct page
# 2. Check debug_screenshots/ for clues
# 3. Wait longer after navigation
```

#### **4. Frontend Issues**

**Error:** `API calls return 401 Unauthorized`

```bash
# Solution: Check secret token
# Must match between:
# - backend/.env (SECRET_TOKEN)
# - Frontend API calls (x-secret-token header)
```

**Error:** `LaTeX not rendering`

```bash
# Solution:
# 1. Check if KaTeX CSS is loaded
# 2. Verify LaTeX syntax in Sheet
# 3. Test with simple expression: $x^2$
```

#### **5. Deployment Issues**

**Error:** `Form creation failed`

```bash
# Solution:
# 1. Check Google Forms API is enabled
# 2. Verify service account has Forms API access
# 3. Check quota limits in Google Cloud Console
```

---

## 📊 Quick Reference

### **Data Flow:**

```
McGraw Hill Edge → scrape.py → Process (fix/latex/themes) →
Google Sheets → Backend API → Admin Dashboard → Google Forms
```

### **Key Files:**

- `backend/.env` - Backend configuration
- `mcp/.env` - Scraper credentials
- `credentials/service-account.json` - Google API access
- `cleaned_questions.json` - Processed questions

### **Scraping Pipeline:**

```
QA:   scrape → fix → add_latex → add_themes → upload
VARC: scrape → extract_passages → fix → upload
DI:   scrape → extract_passages → fix → upload
```

---

## 📝 Important Notes

**Security:**

- Never commit service-account.json (add to .gitignore)
- Use environment variables for credentials
- Keep secret tokens secure

**Best Practices:**

- Always activate venv before scraping: `source venv/bin/activate`
- Follow pipeline order: scrape → process → verify → upload
- Test locally before production
- Monitor Google API quotas in Cloud Console

---

**Document Version:** 1.0  
**Last Updated:** January 30, 2026  
**Maintained By:** Development Team

---

_This knowledge transfer document is a living document and should be updated as the project evolves._
