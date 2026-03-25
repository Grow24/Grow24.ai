# AutoDocX - Quick Start Guide

## What It Does
AI-powered document processor that extracts structured data from invoices/receipts using OCR + AI.

## Tech Stack
- **Frontend:** HTML/CSS/JS (vanilla)
- **Backend:** n8n workflows
- **OCR:** Tesseract.js
- **AI:** OpenAI GPT-4o
- **Processing:** Node.js (n8n Code nodes)

## Data Flow
```
Frontend → Webhook → Tesseract (OCR) → OpenAI (AI) → Code (Validation) → Merge → Respond → Frontend
```

## How to Run

### 1. Start n8n
```bash
npx n8n start
```
Access: http://localhost:5678

### 2. Import Workflow
- n8n UI → Workflows → Import from File
- Select: `AutoDocX copy.json`
- Configure OpenAI API key in "Message a model" node
- Activate workflow

### 3. Start Frontend
```bash
cd frontend
python3 -m http.server 5500
```
Access: http://localhost:5500

### 4. Configure
- Open frontend
- Enter n8n webhook URL (from webhook node)
- Upload document → Process

## Key Settings
- **Webhook:** Respond = "Using Respond to Webhook Node"
- **CORS:** Set to `*` or your frontend URL
- **Tesseract:** Input field = `data0` (matches webhook output)

## Troubleshooting
- **CORS Error:** Update webhook CORS settings
- **Empty Response:** Check "Respond to Webhook" node has data
- **Tesseract Fails:** Ensure binary data field matches (`data0`)
