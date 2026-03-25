# Website Integration Guide: AutoDocs for grow24.ai (GoDaddy cPanel)

This guide walks you through integrating the AutoDocs document processing feature into your grow24.ai website hosted on GoDaddy cPanel.

---

## 📋 Prerequisites

- GoDaddy cPanel access for grow24.ai
- n8n instance (cloud or self-hosted)
- OpenAI API key
- FTP/SFTP access or cPanel File Manager access

---

## 🏗️ Architecture Overview

```
grow24.ai (GoDaddy) → Frontend Files → n8n Webhook → Processing Pipeline → Response
```

**Components:**
1. **Frontend**: HTML/CSS/JS files hosted on GoDaddy
2. **Backend**: n8n workflow (hosted separately - see options below)
3. **Integration**: Frontend communicates with n8n via webhook URL

---

## Part 1: n8n Backend Setup

### Option A: n8n Cloud (Recommended for Production)

1. **Sign up for n8n Cloud**
   - Visit [n8n.io](https://n8n.io) and create an account
   - Choose a plan (free tier available for testing)

2. **Import Workflow**
   - In n8n Cloud dashboard, go to **Workflows** → **Import from File**
   - Upload `n8n_backend/workflow.json` or `n8nWorkflow.json`
   - The workflow will be imported

3. **Configure OpenAI Credentials**
   - Open the **"Message a model"** node
   - Click **Credentials** → **Create New**
   - Select **OpenAI API**
   - Enter your OpenAI API key
   - Save credentials

4. **Configure Webhook**
   - Open the **Webhook** node
   - Set **HTTP Method** to `POST`
   - Set **Path** to your desired endpoint (e.g., `document-processor`)
   - In **Options**:
     - Set **Allowed Origins (CORS)** to: `https://grow24.ai` and `https://www.grow24.ai`
     - Set **Binary Property Name** to: `data`
   - Save the workflow

5. **Activate Workflow**
   - Toggle the **Active** switch to enable the workflow
   - Copy the **Production Webhook URL** (format: `https://your-instance.n8n.cloud/webhook/document-processor`)

### Option B: Self-Hosted n8n (Advanced)

1. **Deploy n8n on a VPS/Server**
   - Use Docker: `docker run -it --rm --name n8n -p 5678:5678 n8nio/n8n`
   - Or use n8n's installation guide for your server

2. **Configure Domain & SSL**
   - Point a subdomain (e.g., `n8n.grow24.ai`) to your server
   - Set up SSL certificate (Let's Encrypt recommended)

3. **Import and Configure Workflow**
   - Follow steps 2-5 from Option A
   - Update CORS to allow `https://grow24.ai`

---

## Part 2: Frontend Deployment to GoDaddy cPanel

### Step 1: Prepare Frontend Files

1. **Modify `index.html`**
   - Update the default webhook URL in the configuration section
   - Change line 683 from:
     ```html
     value="http://localhost:5678/webhook/bc7e87f9-c710-4b1f-a635-fa6811985db1"
     ```
     To:
     ```html
     value="https://your-n8n-instance.n8n.cloud/webhook/your-webhook-path"
     ```

2. **Optional: Create a Subdirectory Structure**
   - If integrating as a sub-page: `public_html/autodocs/`
   - If integrating into existing page: merge with your existing HTML

### Step 2: Upload Files via cPanel File Manager

1. **Access cPanel**
   - Log into GoDaddy cPanel
   - Navigate to **File Manager**

2. **Navigate to Website Root**
   - Go to `public_html/` (or your website's root directory)

3. **Create Directory (if needed)**
   - Create folder: `autodocs` or `document-processor` (optional)
   - Or upload directly to root if integrating into existing page

4. **Upload Files**
   - Upload `frontend/index.html` to your chosen location
   - If using a subdirectory: `public_html/autodocs/index.html`
   - Or rename to match your site structure (e.g., `document-processor.html`)

5. **Set Permissions**
   - Right-click `index.html` → **Change Permissions**
   - Set to `644` (readable by web server)

### Step 3: Upload via FTP/SFTP (Alternative Method)

1. **Connect via FTP Client**
   - Use FileZilla, WinSCP, or similar
   - Host: `ftp.grow24.ai` (or your FTP hostname)
   - Username/Password: Your cPanel credentials

2. **Upload Files**
   ```bash
   # Navigate to public_html
   cd public_html
   
   # Create directory (optional)
   mkdir autodocs
   
   # Upload index.html
   put frontend/index.html autodocs/index.html
   ```

---

## Part 3: Integration into Existing Website

### Option A: Standalone Page

1. **Direct Access**
   - Accessible at: `https://grow24.ai/autodocs/` or `https://grow24.ai/document-processor.html`

2. **Add Navigation Link**
   - Add a link in your main navigation:
     ```html
     <a href="/autodocs/">Document Processor</a>
     ```

### Option B: Embed into Existing Page

1. **Extract Components**
   - Copy the `<style>` section from `index.html`
   - Copy the JavaScript `DocumentProcessor` class
   - Copy the HTML structure (container, upload area, etc.)

2. **Merge with Your Page**
   - Add styles to your existing CSS or `<style>` tag
   - Add the JavaScript before closing `</body>`
   - Add HTML structure where you want the feature to appear

3. **Update Webhook URL**
   - Ensure the webhook URL input field points to your n8n instance

### Option C: Iframe Integration

1. **Create Standalone Page**
   - Upload `index.html` as a separate page

2. **Embed via Iframe**
   ```html
   <iframe 
     src="/autodocs/" 
     width="100%" 
     height="800px" 
     frameborder="0"
     style="border-radius: 12px;">
   </iframe>
   ```

---

## Part 4: Configuration & Testing

### Step 1: Update Webhook URL

1. **In Production**
   - Users can manually enter the webhook URL in the frontend
   - Or hardcode it in the HTML (recommended for production)

2. **Hardcode Webhook URL (Recommended)**
   - Edit `index.html` line 683:
     ```html
     <input
       type="url"
       id="webhookUrl"
       class="form-input"
       placeholder="Enter n8n webhook URL"
       value="https://your-n8n-instance.n8n.cloud/webhook/your-path"
       readonly
     />
     ```
   - Add `readonly` attribute to prevent users from changing it

### Step 2: CORS Configuration

1. **Verify n8n CORS Settings**
   - In n8n webhook node, ensure **Allowed Origins** includes:
     - `https://grow24.ai`
     - `https://www.grow24.ai`
     - `http://grow24.ai` (if using HTTP)
   - Or use `*` for development (not recommended for production)

2. **Test CORS**
   - Open browser console on grow24.ai
   - Upload a test document
   - Check for CORS errors in console

### Step 3: SSL/HTTPS Requirements

1. **Ensure HTTPS**
   - GoDaddy should provide SSL certificate
   - Verify `https://grow24.ai` is accessible
   - n8n webhook must also use HTTPS (n8n Cloud uses HTTPS by default)

2. **Mixed Content Warning**
   - If your site is HTTPS, n8n webhook must also be HTTPS
   - Browsers block HTTP requests from HTTPS pages

### Step 4: File Upload Limits

1. **Check GoDaddy Limits**
   - GoDaddy typically allows up to 50MB file uploads
   - Verify in cPanel → **PHP Configuration** → `upload_max_filesize`
   - Current frontend limit: 10MB (can be adjusted in `index.html` line 811)

2. **Adjust if Needed**
   ```javascript
   const maxSize = 10 * 1024 * 1024; // 10MB - adjust as needed
   ```

---

## Part 5: Testing Checklist

### ✅ Pre-Deployment Tests

- [ ] n8n workflow is active and accessible
- [ ] Webhook URL is correct and returns expected response
- [ ] OpenAI API key is configured and working
- [ ] CORS is properly configured in n8n

### ✅ Post-Deployment Tests

1. **Basic Functionality**
   - [ ] Page loads without errors
   - [ ] File upload area is visible and clickable
   - [ ] Drag-and-drop works
   - [ ] File preview displays correctly

2. **Processing Tests**
   - [ ] Upload a test receipt/invoice image
   - [ ] Click "Process Document"
   - [ ] Loading indicator appears
   - [ ] Results display correctly
   - [ ] Line items table renders properly
   - [ ] Total amount displays correctly

3. **Error Handling**
   - [ ] Invalid file type shows error
   - [ ] File too large shows error
   - [ ] Network errors display user-friendly messages
   - [ ] CORS errors are handled gracefully

4. **Cross-Browser Testing**
   - [ ] Chrome/Edge
   - [ ] Firefox
   - [ ] Safari
   - [ ] Mobile browsers (iOS Safari, Chrome Mobile)

---

## Part 6: Security Considerations

### 1. API Key Protection

- ✅ **Do NOT** expose OpenAI API key in frontend code
- ✅ Keep API key in n8n credentials only
- ✅ Use environment variables in n8n if self-hosting

### 2. Webhook Security (Optional)

1. **Add Bearer Token Authentication**
   - In n8n webhook node, enable **Authentication** → **Header Auth**
   - Set a secret token
   - Update frontend to send token:
     ```javascript
     const response = await fetch(webhookUrl, {
       method: "POST",
       headers: {
         'Authorization': 'Bearer YOUR_SECRET_TOKEN'
       },
       body: formData,
     });
     ```

2. **Rate Limiting**
   - Configure rate limiting in n8n if needed
   - Or use GoDaddy's built-in protection

### 3. File Validation

- ✅ Frontend validates file type and size
- ✅ Consider adding server-side validation in n8n if needed

---

## Part 7: Performance Optimization

### 1. Minify Assets (Optional)

1. **Minify HTML/CSS/JS**
   - Use tools like [HTMLMinifier](https://kangax.github.io/html-minifier/)
   - Or use build tools (Webpack, Vite, etc.)

2. **Compress Images**
   - Optimize any images used in the UI
   - Use WebP format for better compression

### 2. Caching

1. **Browser Caching**
   - Add cache headers in `.htaccess`:
     ```apache
     <IfModule mod_expires.c>
       ExpiresActive On
       ExpiresByType text/css "access plus 1 year"
       ExpiresByType application/javascript "access plus 1 year"
     </IfModule>
     ```

2. **CDN (Optional)**
   - Consider using GoDaddy's CDN or Cloudflare
   - Improves global load times

---

## Part 8: Troubleshooting

### Common Issues

#### Issue 1: CORS Error
**Symptoms:** Browser console shows CORS error  
**Solution:**
- Verify n8n webhook CORS settings include `https://grow24.ai`
- Ensure both frontend and backend use HTTPS

#### Issue 2: 404 on Webhook
**Symptoms:** Network error, 404 response  
**Solution:**
- Verify webhook URL is correct
- Ensure n8n workflow is active
- Check webhook path matches exactly

#### Issue 3: File Upload Fails
**Symptoms:** File doesn't upload or process  
**Solution:**
- Check file size (must be < 10MB by default)
- Verify file type is supported (PNG, JPG, PDF)
- Check browser console for errors

#### Issue 4: Empty Response
**Symptoms:** Processing completes but no data shown  
**Solution:**
- Check n8n workflow execution logs
- Verify OpenAI API key is valid
- Check "Respond to Webhook" node has data

#### Issue 5: Slow Processing
**Symptoms:** Takes too long to process  
**Solution:**
- OCR and AI processing can take 30-60 seconds
- Consider adding progress indicators
- Optimize image size before upload

---

## Part 9: Maintenance

### Regular Tasks

1. **Monitor n8n Workflow**
   - Check execution logs weekly
   - Monitor for errors or failures
   - Review OpenAI API usage/costs

2. **Update Dependencies**
   - Keep n8n updated
   - Monitor for security updates

3. **Backup**
   - Backup workflow JSON files
   - Keep version control of frontend changes

---

## Part 10: Support & Resources

### Documentation
- [n8n Documentation](https://docs.n8n.io/)
- [OpenAI API Documentation](https://platform.openai.com/docs)
- [Tesseract.js Documentation](https://tesseract.projectnaptha.com/)

### Contact
- For issues with this integration, refer to the main README.md
- Check n8n community forums for workflow issues

---

## Quick Reference: File Locations

```
grow24.ai (GoDaddy cPanel)
└── public_html/
    └── autodocs/              (or your chosen directory)
        └── index.html         (main frontend file)

n8n Instance (Cloud or Self-hosted)
└── Workflow: AutoDocX copy
    ├── Webhook Node           (entry point)
    ├── Tesseract Node         (OCR)
    ├── OpenAI Node            (AI extraction)
    ├── Code Nodes             (validation)
    └── Respond to Webhook     (response)
```

---

## Summary Checklist

- [ ] Set up n8n instance (cloud or self-hosted)
- [ ] Import and configure workflow
- [ ] Add OpenAI API credentials
- [ ] Configure webhook CORS for grow24.ai
- [ ] Update frontend webhook URL
- [ ] Upload frontend files to GoDaddy cPanel
- [ ] Test file upload and processing
- [ ] Verify results display correctly
- [ ] Test error handling
- [ ] Configure security (optional bearer token)
- [ ] Set up monitoring/maintenance routine

---

**Last Updated:** 2025-01-25  
**Version:** 1.0
