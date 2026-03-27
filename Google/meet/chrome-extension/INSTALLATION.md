# 🎥 HBMP Meet Recorder - Chrome Extension Installation

## ✨ What This Extension Does:

Adds a **floating recording button** directly in your Google Meet window! No need to switch tabs - control OBS recording right from the meeting.

```
┌─────────────────────────────────────┐
│  🎥 Google Meet Window              │
│                                     │
│  ┌──────────────────┐              │
│  │ 🎥 OBS Recorder  │  ← Floating   │
│  │ ● Connected      │     Widget    │
│  │ [Start Recording]│              │
│  └──────────────────┘              │
│                                     │
│  [Your video feed and participants] │
└─────────────────────────────────────┘
```

---

## 📋 Prerequisites:

✅ **Backend running** (http://localhost:3006)  
✅ **OBS Studio open** with WebSocket enabled  
✅ **Chrome/Edge browser**

---

## 🚀 Installation Steps:

### Step 1: Generate Icons (Optional)

The extension needs 3 icon files. You can:

**Option A: Use emoji as placeholder (Quick)**

```bash
cd /Users/abhinavrai/Desktop/DST/hbmp_tools/meet/chrome-extension/icons

# Create simple text files (Chrome will show default icon)
echo "🎥" > icon16.png
echo "🎥" > icon48.png
echo "🎥" > icon128.png
```

**Option B: Download proper icons (Recommended)**

1. Go to: https://www.flaticon.com/search?word=video%20recording
2. Download 3 PNG icons (16x16, 48x48, 128x128)
3. Rename them to: `icon16.png`, `icon48.png`, `icon128.png`
4. Move to: `/Users/abhinavrai/Desktop/DST/hbmp_tools/meet/chrome-extension/icons/`

**Option C: Use system emoji (Mac)**

```bash
# This will work but shows generic icon
touch icon16.png icon48.png icon128.png
```

---

### Step 2: Load Extension in Chrome

1. **Open Chrome**

2. **Go to Extensions page:**

   - Type in address bar: `chrome://extensions`
   - OR: Menu (⋮) → Extensions → Manage Extensions

3. **Enable Developer Mode:**

   - Toggle switch in top-right corner: ✅ **Developer mode**

4. **Load the extension:**

   - Click **"Load unpacked"** button
   - Navigate to: `/Users/abhinavrai/Desktop/DST/hbmp_tools/meet/chrome-extension`
   - Click **"Select"**

5. **Extension loads!** ✅
   - You'll see "HBMP Meet Recorder" in your extensions list
   - Red camera icon appears in toolbar

---

### Step 3: Test It!

1. **Make sure backend is running:**

   ```bash
   cd /Users/abhinavrai/Desktop/DST/hbmp_tools/meet/backend
   npm start
   ```

2. **Make sure OBS is running** with WebSocket enabled

3. **Join a Google Meet:**

   - Go to: https://meet.google.com
   - Join any meeting (or create a test meeting)

4. **Look for the floating widget!**

   - After 2-3 seconds, you'll see a floating panel appear in the top-right
   - It says: "🎥 OBS Recorder"

5. **Test the controls:**
   - Click **"Connect to OBS"** → Should say ✅ Connected
   - Click **"Start Recording"** → Timer starts counting!
   - Click **"Stop Recording"** → Recording saved!

---

## 🎯 Features:

### ✨ Floating Widget

- Appears automatically on Google Meet
- Draggable - move it anywhere on screen
- Minimizable - click **"−"** to collapse
- Always on top - won't get hidden by Meet controls

### 🎬 Recording Controls

- **Connect to OBS** - Establishes connection
- **Start Recording** - Begins recording with one click
- **Stop Recording** - Saves recording and shows file path
- **Live Timer** - Shows recording duration (HH:MM:SS)
- **Status Indicator** - Shows connection state (●)

### 🎨 Visual Feedback

- 🔴 Red pulsing dot when recording
- 🟢 Green dot when connected
- ⚪ Gray dot when disconnected
- Real-time recording timer

---

## 🔧 Troubleshooting:

### Problem: Widget doesn't appear

**Solution:**

1. Make sure you're on `meet.google.com` (not other Google services)
2. Wait 2-3 seconds after page loads
3. Refresh the page (Cmd+R or Ctrl+R)
4. Check extension is enabled in `chrome://extensions`

### Problem: "Connection failed" error

**Solution:**

1. Check backend is running: `curl http://localhost:3006/obs/status`
2. Should return: `{"connected":false,"host":"localhost","port":4455}`
3. If error, restart backend:
   ```bash
   cd /Users/abhinavrai/Desktop/DST/hbmp_tools/meet/backend
   npm start
   ```

### Problem: "Failed to connect to OBS"

**Solution:**

1. Open OBS Studio
2. Go to: Tools → WebSocket Server Settings
3. Check: ✅ Enable WebSocket server
4. Port should be: 4455
5. Click OK

### Problem: Extension icon not showing

**Solution:**
This is just cosmetic - the extension still works! But to fix:

1. Create proper PNG icons (see Step 1)
2. Reload extension in `chrome://extensions`

---

## 🎮 Usage Workflow:

Perfect workflow for recording meetings:

```
1. Start backend & OBS
2. Join Google Meet
3. Wait for widget to appear (2-3 seconds)
4. Click "Connect to OBS"
5. Click "Start Recording"
6. Conduct your meeting
7. Click "Stop Recording" when done
8. Recording saved to ~/Movies/ ✅
```

---

## ⚙️ Advanced:

### Change Widget Position

- **Drag the header** (🎥 OBS Recorder part) to move it
- Position is preserved until page refresh

### Keyboard Shortcuts (Future)

We can add:

- `Ctrl+Shift+R` - Start/Stop recording
- `Ctrl+Shift+C` - Connect to OBS

### Customize Appearance

Edit `styles.css` to change:

- Colors
- Size
- Position
- Animations

---

## 🎉 You're Done!

The extension is now installed and ready! Join a Google Meet to see it in action.

**Benefits:**
✅ No tab switching - control recording from Meet window  
✅ Visual feedback - see recording status at a glance  
✅ One-click recording - no complex setup each time  
✅ Professional - looks like a native Meet feature

Enjoy recording your meetings! 🎬
