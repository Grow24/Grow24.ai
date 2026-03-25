# Microsoft Graph Excel Viewer

A web application to view and interact with Excel files from OneDrive using iframe embedding - similar to Google Sheets integration.

## Features

### 📊 Excel Viewer

- **List Excel Files**: Browse all `.xlsx` and `.xls` files from your OneDrive
- **Iframe Embedding**: View Excel files directly in the browser using Office Online embed
- **Resizable Sidebar**: Drag to resize the file list sidebar (200px - 600px)
- **Search Functionality**: Filter files by name in real-time
- **File Metadata**: See file size and last modified date
- **Open in Excel Online**: Click to open files in full Excel Online experience

### 🔐 Authentication

- Microsoft OAuth 2.0 authentication
- Automatic token management
- Scopes: `Files.Read.All`, `Files.ReadWrite.All`, `User.Read`, `offline_access`

### 🏠 Dashboard Features

- User profile display with avatar
- OneDrive file browser
- Recent files viewer
- Shared files viewer
- SharePoint sites explorer
- File search functionality
- Upload test files

## Installation

1. **Install dependencies**:

   ```bash
   npm install
   ```

2. **Configure OAuth credentials** in `server.js`:

   - `CLIENT_ID`: Your Azure App Registration Client ID
   - `CLIENT_SECRET`: Your Azure App Client Secret
   - `REDIRECT_URI`: `http://localhost:5173/auth/callback`

3. **Azure App Registration Setup**:
   - Go to [Azure Portal](https://portal.azure.com/)
   - Navigate to "Azure Active Directory" > "App registrations"
   - Create a new registration or use existing one
   - Add redirect URI: `http://localhost:5173/auth/callback`
   - Grant API permissions:
     - `User.Read`
     - `Files.Read.All`
     - `Files.ReadWrite.All`
     - `offline_access`
   - Create a client secret and copy it

## Usage

### Start the server:

```bash
npm start
# Or
node server.js
```

The application will run on: **http://localhost:5173**

### Access the application:

1. **Home Page**: http://localhost:5173

   - Click "Sign in with Microsoft"
   - Authorize the application

2. **Dashboard**: http://localhost:5173/dashboard.html

   - View user profile
   - Browse OneDrive files
   - Access various Microsoft Graph APIs

3. **Excel Viewer**: http://localhost:5173/excel.html
   - View all Excel files from OneDrive
   - Click any file to view in iframe
   - Resize sidebar by dragging the handle
   - Search files using the search box
   - Open files in Excel Online

## API Endpoints

### Authentication

- `GET /auth/login` - Initiate OAuth login
- `GET /auth/callback` - OAuth callback handler

### User & Profile

- `GET /api/me?token={token}` - Get user profile
- `GET /api/photo?token={token}` - Get profile photo

### Excel Files

- `GET /api/excel/files?token={token}` - List all Excel files with embed URLs
- `GET /api/excel/:fileId?token={token}` - Get specific Excel file details

### OneDrive

- `GET /api/drive?token={token}` - List OneDrive root files
- `GET /api/recent?token={token}` - Get recent files
- `GET /api/shared?token={token}` - Get shared files

### SharePoint

- `GET /api/sites?token={token}` - List SharePoint sites

### Utilities

- `GET /api/upload-test?token={token}` - Upload test file
- `GET /api/search?token={token}&q={query}` - Search files

## Excel Embedding

The Excel viewer uses Office Online's embed functionality:

```javascript
embedUrl: `https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(
  fileWebUrl
)}`;
```

### Features of Office Online Embed:

- ✅ View Excel files in read-only mode
- ✅ Navigate between sheets
- ✅ View formulas and formatting
- ✅ Responsive and mobile-friendly
- ✅ No additional authentication required (uses existing token)

### Limitations:

- Read-only viewing (editing requires full Excel Online)
- Some advanced Excel features may not render
- Requires internet connection

## Comparison with Google Sheets Integration

| Feature                     | Google Sheets       | Microsoft Excel (This App) |
| --------------------------- | ------------------- | -------------------------- |
| **Iframe Embedding**        | ✅ `webViewLink`    | ✅ Office Online embed URL |
| **File Listing**            | ✅ Google Drive API | ✅ Microsoft Graph API     |
| **Search**                  | ✅                  | ✅                         |
| **Resizable Sidebar**       | ✅                  | ✅                         |
| **Real-time Collaboration** | ✅ Native           | ✅ Via Excel Online        |
| **Edit in Browser**         | ✅ Full editing     | ⚠️ Read-only in iframe     |
| **Open in Native App**      | ✅                  | ✅                         |
| **File Metadata**           | ✅                  | ✅                         |
| **Template Support**        | ✅ 10 templates     | 🚧 Coming soon             |

## File Structure

```
ms_check/
├── server.js              # Express backend with Graph API
├── package.json           # Dependencies
├── README.md             # This file
└── public/
    ├── index.html        # Landing/login page
    ├── dashboard.html    # Main dashboard
    └── excel.html        # Excel file viewer
```

## Next Steps / Roadmap

- [ ] Add Excel file creation from templates
- [ ] Implement workbook/worksheet metadata display
- [ ] Add support for editing via Graph API
- [ ] Create custom Excel templates
- [ ] Add approval workflow (similar to Google Sheets)
- [ ] Implement sharing and permissions management
- [ ] Add real-time collaboration indicators
- [ ] Support for Word and PowerPoint viewing

## Migration from Google Sheets

This implementation mirrors the Google Sheets viewer architecture:

### Similar Patterns:

1. **Sidebar with file list** - Resizable, searchable
2. **Iframe viewer** - Embedded document display
3. **File metadata** - Size, modified date, etc.
4. **Toggle sidebar** - Show/hide file list
5. **OAuth flow** - Token-based authentication

### Key Differences:

- Uses Microsoft Graph API instead of Google Drive/Sheets API
- Office Online embed instead of Google Docs embed
- Different URL structure for embeds
- Microsoft-specific scopes and permissions

## Troubleshooting

### Files not loading?

- Check that OAuth scopes include `Files.Read.All`
- Verify access token is valid
- Check browser console for CORS errors

### Iframe not displaying?

- Ensure file `webUrl` is publicly accessible or user has permissions
- Check that Office Online can access the file
- Try opening the `embedUrl` directly in a new tab

### Authentication errors?

- Verify CLIENT_ID and CLIENT_SECRET in server.js
- Check redirect URI matches Azure App Registration
- Ensure all required permissions are granted and admin-consented

## License

ISC

## Author

Created for HBMP Tools - Google/Microsoft Integration Project
