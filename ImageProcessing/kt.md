# Knowledge Transfer: AutoDocX - AI-Powered Document Processor

## 📌 Project Overview

**AutoDocX** is an intelligent document processing system that extracts structured data from invoices and receipts using OCR and AI. The system automatically validates the extracted data and returns it in a formatted JSON structure.

### Why Was This Created?

- **Problem**: Manual data entry from invoices/receipts is time-consuming and error-prone
- **Solution**: Automated extraction using AI that processes documents in under a minute
- **Business Value**: Reduces data entry time by 90%, improves accuracy, and scales easily

### Where It Has Been Used

- **grow24.ai**: Integrated into the company website (hosted on GoDaddy cPanel)
- **Internal Tools**: Used for processing vendor invoices and expense receipts
- **Demo/POC**: Showcased to potential clients for document automation needs

---

## 🏗️ System Architecture

```
┌─────────────┐      ┌──────────────────────────────────────┐      ┌──────────┐
│   Frontend  │──────▶│           n8n Workflow              │──────▶│ Response │
│ (HTML/JS)   │ POST │                                       │ JSON  │  Display │
└─────────────┘      └──────────────────────────────────────┘      └──────────┘
                             │         │         │
                             ▼         ▼         ▼
                        Tesseract  OpenAI   Validation
                          (OCR)    (GPT-4o)   (Node.js)
```

**Key Components:**

1. **Frontend**: Single-page HTML interface for document upload
2. **n8n Backend**: Workflow automation platform orchestrating the entire pipeline
3. **Tesseract OCR**: Extracts text from images
4. **OpenAI GPT-4o**: Structures the extracted text into JSON
5. **Validation Logic**: Ensures data accuracy and completeness

---

## 🔄 Workflow Step-by-Step

### 1. **Webhook Node** (Entry Point)

- **Purpose**: Receives document upload from frontend
- **Method**: POST request with multipart/form-data
- **Input**: Binary image file (JPEG, PNG, PDF)
- **Configuration**:
  - Path: `/webhook/your-unique-path`
  - CORS: Enabled for frontend domain
  - Binary Property: `data`

### 2. **Tesseract Node** (OCR Processing)

- **Purpose**: Converts image to raw text using Optical Character Recognition
- **Input**: Binary image from webhook (`data0`)
- **Output**: Extracted text as plain string
- **Processing Time**: 5-15 seconds depending on image quality

### 3. **OpenAI Node** (AI Structuring)

- **Purpose**: Converts unstructured OCR text into structured JSON
- **Model**: GPT-4o (chatgpt-4o-latest)
- **Prompt Strategy**:
  - System prompt defines expected JSON schema
  - User prompt provides the OCR text
  - Instructs AI to extract: vendor, date, invoice number, line items, totals
- **Output**: JSON object with structured data
- **Processing Time**: 10-20 seconds

### 4. **Code Node** (JSON Cleaning)

- **Purpose**: Cleans AI response (removes markdown code blocks)
- **Logic**:
  ````javascript
  - Strips ```json and ``` markers
  - Parses string to JSON object
  - Returns clean data structure
  ````

### 5. **Code1 Node** (Line Item Validation)

- **Purpose**: Validates each line item against business rules
- **Validation Checks**:
  - ✓ Required fields (description, quantity, amount)
  - ✓ Format validation (quantity: integers, prices: decimal)
  - ✓ Calculation accuracy (unit_price × quantity = amount)
- **Output**: Two arrays - valid and invalid items

### 6. **If Node** (Total Amount Check)

- **Purpose**: Flags invoices exceeding threshold
- **Condition**: `total < 5000`
- **Use Case**: High-value invoices may need additional approval

### 7. **If1 Node** (Item Status Routing)

- **Purpose**: Separates valid from invalid line items
- **Condition**: `status === "Valid"`
- **Output**: Sends items to different branches for processing

### 8. **Merge Node** (Data Consolidation)

- **Purpose**: Combines all validated data streams
- **Input**: Valid items, invalid items, metadata
- **Output**: Complete dataset ready for response

### 9. **Respond to Webhook Node** (Final Response)

- **Purpose**: Sends processed data back to frontend
- **Format**: JSON with status code 200
- **Structure**:
  ```json
  {
    "vendor": "Company Name",
    "invoice_number": "INV-12345",
    "date": "2026-01-30",
    "line_items": [...],
    "subtotal": "1500.00",
    "tax": "135.00",
    "total": "1635.00"
  }
  ```

---

## 🛠️ n8n Integration Details

### What is n8n?

n8n is an **open-source workflow automation tool** that connects different services and APIs. Think of it as a visual programming platform where you create workflows by connecting nodes.

### Key n8n Concepts:

- **Nodes**: Building blocks that perform specific actions (API calls, data transformation, etc.)
- **Connections**: Data flows from one node to another
- **Execution**: Workflows can be triggered manually, on schedule, or via webhooks
- **Credentials**: Secure storage for API keys and authentication

### Why n8n for This Project?

- ✓ **Visual Interface**: Easy to understand and modify workflow
- ✓ **No Code Required**: Connects Tesseract, OpenAI without writing integration code
- ✓ **Built-in Nodes**: Pre-built connectors for common services
- ✓ **Scalable**: Can handle multiple requests concurrently
- ✓ **Self-Hosted**: Full control over data and infrastructure

### n8n Workflow Components Used:

1. **Webhook Node**: RESTful API endpoint creation
2. **Tesseract Node**: Community node for OCR processing
3. **OpenAI Node**: Official integration with OpenAI API
4. **Code Node**: Custom JavaScript for data manipulation
5. **If Node**: Conditional logic and routing
6. **Merge Node**: Data aggregation and combination
7. **Respond to Webhook Node**: HTTP response handling

---

## 🚀 Running the Project Locally

### Prerequisites

- Node.js (v18 or higher)
- OpenAI API key
- Modern web browser

### Step 1: Install and Start n8n

```bash
# Install n8n globally
npm install n8n -g

# Start n8n
n8n start
```

Access n8n at: `http://localhost:5678`

**First Time Setup:**

1. Create an account (stored locally)
2. Set a password for your n8n instance

### Step 2: Import the Workflow

1. In n8n UI → Click **"Workflows"** in sidebar
2. Click **"Add workflow"** → **"Import from file"**
3. Select: `n8n_backend/workflow.json`
4. Workflow will open in editor

### Step 3: Configure OpenAI Credentials

1. Click on **"Message a model"** node (the OpenAI node)
2. Under **Credentials** → Click **"Create New"**
3. Select **"OpenAI API"**
4. Enter your OpenAI API key (get from platform.openai.com)
5. Name it (e.g., "OpenAI-AutoDocX")
6. Click **"Save"**

### Step 4: Configure Webhook Settings (IMPORTANT!)

1. Click on **"Webhook"** node
2. Note the **Test URL** (used for development)
3. **⚠️ CRITICAL - Configure CORS to avoid errors:**
   - Scroll down to **Options** section
   - Click **Add Option** → Select **Allowed Origins (CORS)**
   - Enter: `http://127.0.0.1:5500` (for local testing)
   - Or use `*` to allow all origins (testing only, not recommended for production)
   - Set **Binary Property Name** to: `data`
4. Copy the **Test Webhook URL** (e.g., `http://localhost:5678/webhook-test/abc123...`)

**Why CORS matters**: Without proper CORS configuration, your browser will block requests from the frontend to n8n, resulting in "CORS Error" messages.

### Step 5: Activate the Workflow

1. Click **"Save"** (top right)
2. Toggle **"Active"** switch to ON
3. Workflow is now listening for requests

### Step 6: Start the Frontend

```bash
# Navigate to frontend directory
cd frontend

# Start a simple HTTP server
python3 -m http.server 5500
# OR use Node.js
npx http-server -p 5500
# OR use VS Code Live Server extension
```

Access frontend at: `http://127.0.0.1:5500`

### Step 7: Configure and Test

1. Open `http://127.0.0.1:5500` in browser
2. In **Configuration** section:
   - Paste the **n8n webhook URL** (from Step 4)
   - Leave Bearer Token empty (not required for local testing)
3. Click **"Save Configuration"**
4. Upload a test invoice/receipt image
5. Click **"Process Document"**
6. View extracted data in the results table

---

## 📁 Project Structure

```
AutoDocs(ImageProcessing)/
│
├── frontend/               # Frontend application
│   ├── index.html         # Main UI (1100+ lines, includes CSS/JS)
│   └── readme.md          # Frontend documentation
│
├── n8n_backend/           # Backend workflow
│   └── workflow.json      # n8n workflow configuration (exportable)
│
├── assets/                # Demo assets
│   ├── front.jpg          # Frontend screenshot
│   ├── back.jpg           # Backend screenshot
│   ├── thumbnail.jpg      # Video thumbnail
│   └── demovideo.mp4      # Demo video
│
├── README.md              # Main project documentation
├── QUICK_START.md         # Quick setup guide
├── Website_Integration    # GoDaddy deployment guide
├── eng.traineddata        # Tesseract language data (English)
├── n8nWorkflow.json       # Backup workflow file
└── kt.md                  # This knowledge transfer document
```

---

## 🔧 Common Troubleshooting

### Issue: CORS Error in Browser Console ⚠️ MOST COMMON

**Error Message**:

```json
{
  "error": "CORS Error: Please configure N8N webhook to allow your domain",
  "solution": "Configure CORS in N8N webhook node settings"
}
```

**Root Cause**: Browser security prevents frontend from making requests to n8n backend due to missing CORS headers.

**Solution**:

1. Open your n8n workflow
2. Click the **"Webhook"** node to select it
3. Scroll to **Options** section on the right panel
4. Click **"Add Option"** dropdown
5. Select **"Allowed Origins (CORS)"**
6. Enter your frontend URL: `http://127.0.0.1:5500` (must include `http://`)
7. Click **"Save"** at the top
8. Ensure workflow is **Active** (toggle switch)
9. Refresh your frontend page and try again

**Quick Fix for Testing**: Use `*` to allow all origins (NOT recommended for production)

**Production**: Replace with your actual domain: `https://grow24.ai`

### Issue: "Empty response from n8n"

**Solution**:

- Ensure "Respond to Webhook" node is connected
- Check workflow is ACTIVE (toggle in top right)
- Verify webhook node is set to "responseNode" mode

### Issue: Tesseract fails with "Cannot read property"

**Solution**:

- Check "Input Data Field Name" is set to `data0`
- Ensure webhook node has "Binary Property Name" set to `data`
- Verify image file is being uploaded correctly

### Issue: OpenAI returns error

**Solution**:

- Verify API key is valid and has credits
- Check OpenAI node is using model `chatgpt-4o-latest`
- Review API rate limits in your OpenAI dashboard

### Issue: Frontend shows "Processing..." forever

**Solution**:

- Open browser DevTools (F12) → Network tab
- Check if request reaches n8n (look for webhook URL)
- In n8n, click workflow → View "Executions" to see errors

---

## 📝 Key Learning Points for Interns

1. **Workflow Thinking**: Break complex tasks into discrete steps (nodes)
2. **Error Handling**: Always validate data at each stage
3. **API Integration**: Use n8n credentials for secure API key management
4. **Testing**: Use n8n's "Test Workflow" button to debug individual nodes
5. **Monitoring**: Check "Executions" tab in n8n to see workflow history
6. **Modularity**: Each node does ONE thing well (separation of concerns)

---

## 🎯 Next Steps for Enhancement

- Add support for multi-page documents
- Implement database storage for processed documents
- Add user authentication and session management
- Build admin dashboard for reviewing flagged invoices
- Support additional languages (update Tesseract config)
- Add PDF text extraction (non-image PDFs)

---

## 📞 Support & Resources

- **n8n Documentation**: https://docs.n8n.io/
- **Tesseract.js**: https://tesseract.projectnaptha.com/
- **OpenAI API Docs**: https://platform.openai.com/docs/
- **Project Repository**: Check README.md for updates

---

_Last Updated: January 2026_
