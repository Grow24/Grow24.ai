# COLLABORA WOPI INTEGRATION - MVP TEST GUIDE

## Overview

This guide helps you test the complete Collabora CODE integration with HBMP.

## Prerequisites

- Docker running with Collabora: `docker-compose -f docker-compose.collabora.yml up -d`
- HBMP server running: `cd server && npm run dev` (port 4000)
- HBMP client running: `cd client && npm run dev` (port 5173)

## Test Plan

### 1. Verify Services Running

**Collabora Discovery:**

```bash
curl http://localhost:9980/hosting/discovery
```

Expected: XML response with WOPI endpoints

**HBMP Server:**

```bash
curl http://localhost:4000/api/health
```

Expected: `{"status":"ok"}`

### 2. Test WOPI Endpoints (Server)

**Test CheckFileInfo:**

```bash
curl "http://localhost:4000/wopi/files/test123?ext=xlsx&access_token=dev-token"
```

Expected: JSON with BaseFileName, Size, Version, UserCanWrite: true

**Test GetFile:**

```bash
curl "http://localhost:4000/wopi/files/test123/contents?ext=xlsx&access_token=dev-token"
```

Expected: File contents (may be empty for new file)

**Test PutFile (save):**

```bash
echo "test data" > /tmp/test.xlsx
curl -X POST \
  "http://localhost:4000/wopi/files/test123/contents?ext=xlsx&access_token=dev-token" \
  --data-binary @/tmp/test.xlsx \
  -H "Content-Type: application/octet-stream"
```

Expected: JSON with Name, Size, Version

**Test Office API:**

```bash
curl "http://localhost:4000/api/office/open/test123?ext=xlsx"
```

Expected: JSON with wopiSrc and accessToken

### 3. Test UI Flow (Client)

#### Step 1: Login

1. Navigate to `http://localhost:5173`
2. Login (fake auth stores user in localStorage)

#### Step 2: Open a Project

1. Go to Projects page
2. Select any project
3. You should see the project dashboard

#### Step 3: Create a Spreadsheet

1. Scroll to any section in a document (e.g., Business Case)
2. Click "Add Sub-Docket" if not already created
3. Click "Add Item" dropdown
4. Select "Create Spreadsheet"
5. Enter title: "Financial Model"
6. Click "Create Spreadsheet"

#### Step 4: Open in Collabora

1. You should see the new spreadsheet item with type "Spreadsheet" badge (emerald color)
2. Click "Open" button
3. Browser should navigate to `/projects/:projectId/office/:fileId`
4. Collabora iframe should load with empty spreadsheet

#### Step 5: Edit and Save

1. In Collabora, edit some cells (e.g., A1: "Revenue", A2: "1000")
2. Press Ctrl+S or wait for auto-save
3. Check server logs for "✅ WOPI: Saved file..."

#### Step 6: Verify Persistence

1. Refresh the page
2. Collabora should reload with your changes intact
3. Or navigate back and click "Open" again - changes should be there

### 4. Verify File Storage

Check that files are saved on disk:

```bash
ls -la server/uploads/wopi/
```

You should see files like `sheet_1234567890_abc123.xlsx`

### 5. Test Different Item Types

Create various mini-docket items to ensure navigation works:

**HBMP_DOC:** Opens in document editor
**GOOGLE_SHEET:** Opens external link
**SHEET:** Opens in Collabora (new!)
**FILE:** Shows download button
**LINK:** Opens external link

### 6. Test Edge Cases

#### Non-existent file

Navigate to: `http://localhost:5173/projects/test-project/office/nonexistent`
Expected: Loads Collabora with empty file (WOPI creates it)

#### Concurrent editing (manual test)

1. Open same fileId in two browser tabs
2. Edit in both
3. Last save wins (no conflict resolution in MVP)

#### Large file

Upload a large Excel file via:

```bash
# Create 1MB file
dd if=/dev/urandom of=/tmp/large.xlsx bs=1024 count=1024
curl -X POST \
  "http://localhost:4000/wopi/files/large123/contents?ext=xlsx&access_token=dev-token" \
  --data-binary @/tmp/large.xlsx \
  -H "Content-Type: application/octet-stream"
```

Then open in UI: Should load successfully (up to 50MB supported)

### 7. Troubleshooting

#### Collabora not loading

- Check Docker: `docker ps` - should see hbmp-collabora running
- Check network: `docker logs hbmp-collabora`
- Verify aliasgroup1 in docker-compose.collabora.yml matches `http://localhost:4000`

#### 401 Unauthorized errors

- Check access_token is "dev-token" in requests
- WOPI auth middleware requires exact match

#### Blank iframe

- Open browser console (F12)
- Check for CORS errors
- Verify Collabora URL: `http://localhost:9980/browser/dist/cool.html?WOPISrc=...`

#### Changes not saving

- Check server logs for POST to `/wopi/files/:id/contents`
- Verify file permissions on `server/uploads/wopi/` directory
- Check network tab for 500 errors

#### File not found after creation

- Check that `refId` field matches the fileId in spreadsheet item
- Verify navigation uses correct projectId and fileId parameters

## Success Criteria

✅ Collabora loads in iframe without errors
✅ Can create cells and formulas
✅ Ctrl+S saves data (POST request to PutFile)
✅ Refresh preserves changes (GetFile returns saved data)
✅ Multiple sheets can be created and opened independently
✅ Back button returns to project dashboard

## Known Limitations (MVP)

- No real authentication (uses "dev-token")
- No concurrent edit conflict resolution
- No file version history
- No rename/delete support yet
- No file locking
- Files stored on disk (not in database)
- Extensions hardcoded to xlsx (no docx/pptx yet)

## Next Steps (Post-MVP)

1. Add real authentication with JWT tokens
2. Store file metadata in database
3. Add file versioning
4. Implement WOPI Lock operations
5. Support docx and pptx file types
6. Add file management UI (rename, delete, share)
7. Integrate with document attachments system
8. Add collaborative editing indicators
