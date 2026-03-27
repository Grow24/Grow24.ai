#!/bin/bash

# Script to remove all emoji icons from the HBMP Meet module

echo "Removing emojis from Meet.tsx..."
cd /Users/abhinavrai/Desktop/DST/hbmp_tools/meet/frontend/src/pages

# Replace emojis in Meet.tsx with plain text or remove them
sed -i '' \
  -e 's/🔴 Live Meeting/● Live Meeting/g' \
  -e 's/<span>🎬<\/span>//' \
  -e 's/<span>⚡<\/span>//' \
  -e 's/<span>📋<\/span>//' \
  -e 's/<span>📊<\/span>//' \
  -e 's/<span>📅<\/span>//' \
  -e 's/<span>🎥<\/span>//' \
  -e 's/<span>📝<\/span>//' \
  -e 's/<span>🪟<\/span>//' \
  -e 's/📅 HBMP Meet/HBMP Meet/g' \
  -e 's/📅 Meeting Templates/Meeting Templates/g' \
  -e 's/📅 Date & Time/Date & Time/g' \
  -e 's/📝 Description/Description/g' \
  -e 's/📅 Meeting Info/Meeting Info/g' \
  -e 's/🎥 Google Meet Link/Google Meet Link/g' \
  -e 's/🎥 Join Meeting/Join Meeting/g' \
  -e 's/🔗 Open in Google Calendar/Open in Google Calendar/g' \
  -e 's/🔗 Open in Calendar/Open in Calendar/g' \
  -e 's/📧 Send Invitations/Send Invitations/g' \
  -e 's/📧 Send Meeting Invitations/Send Meeting Invitations/g' \
  -e 's/✅ Submit for Approval/Submit for Approval/g' \
  -e 's/⚡ Instant Meeting/Instant Meeting/g' \
  -e 's/⚡ Join meeting/Join meeting/g' \
  -e 's/📋 Use Template/Use Template/g' \
  -e 's/📋 Meetings/Meetings/g' \
  -e 's/📋 Copy Meeting Link/Copy Meeting Link/g' \
  -e 's/➕ New Meeting/New Meeting/g' \
  -e 's/➕ Create New Meeting/Create New Meeting/g' \
  -e 's/➕ Create Meeting/Create Meeting/g' \
  -e 's/🗑️ Delete Meeting/Delete Meeting/g' \
  -e 's/👥 Attendees/Attendees/g' \
  -e 's/🕐 /⏰ /g' \
  -e 's/⏰ Past Event/Past Event/g' \
  -e 's/📭/📋/g' \
  -e 's/<div className="text-3xl animate-pulse">📅<\/div>/<div className="w-12 h-12 animate-pulse border-4 border-meet-600 border-t-transparent rounded-full"><\/div>/g' \
  -e 's/<div className="text-6xl mb-6">📅<\/div>/<svg className="w-24 h-24 mb-6 mx-auto text-meet-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" \/><\/svg>/g' \
  -e 's/<div className="animate-bounce text-6xl mb-4">📅<\/div>/<svg className="w-24 h-24 mb-4 mx-auto text-meet-600 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" \/><\/svg>/g' \
  -e 's/<div className="text-5xl mb-4 animate-pulse">📭<\/div>/<svg className="w-20 h-20 mb-4 mx-auto text-gray-400 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" \/><\/svg>/g' \
  -e 's/💡 //' \
  -e 's/⚠️/<svg className="w-6 h-6 text-yellow-600" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" \/><\/svg>/g' \
  Meet.tsx

echo "Removing emojis from TemplateDialog.tsx..."
cd /Users/abhinavrai/Desktop/DST/hbmp_tools/meet/frontend/src/components

sed -i '' \
  -e "s/icon: '🎓'/icon: ''/" \
  -e "s/icon: '💼'/icon: ''/" \
  -e "s/icon: '🎯'/icon: ''/" \
  -e "s/icon: '💻'/icon: ''/" \
  -e "s/icon: '📊'/icon: ''/" \
  -e "s/icon: '💡'/icon: ''/" \
  -e "s/icon: '📋'/icon: ''/" \
  -e "s/icon: '⚡'/icon: ''/" \
  -e "s/icon: '☕'/icon: ''/" \
  -e 's/📅 Meeting Templates/Meeting Templates/g' \
  -e 's/💡 //' \
  TemplateDialog.tsx

echo "Removing emojis from OBSControls.tsx..."
sed -i '' \
  -e "s/✅ /[SUCCESS] /g" \
  -e "s/❌ /[ERROR] /g" \
  -e "s/🎥 //" \
  -e "s/⏸️ //" \
  -e "s/▶️ //" \
  -e "s/💡 /[TIP] /g" \
  -e "s/🟢 /● /g" \
  -e "s/🔴 /● /g" \
  -e "s/📋 //" \
  OBSControls.tsx

echo "Removing emojis from PublicCalendarWidget.tsx..."
sed -i '' \
  -e 's/💡 //' \
  PublicCalendarWidget.tsx

echo "Removing emojis from QuickEventDialog.tsx..."
# QuickEventDialog has minimal emojis, mostly SVG icons already

echo "Removing emojis from popup.html..."
cd /Users/abhinavrai/Desktop/DST/hbmp_tools/meet/chrome-extension

sed -i '' \
  -e 's/<div class="logo">🎥<\/div>/<div class="logo">REC<\/div>/g' \
  -e 's/📋 How to Use:/How to Use:/g' \
  -e 's/⚙️ Requirements:/Requirements:/g' \
  -e 's/🚀 Open Google Meet/Open Google Meet/g' \
  -e 's/✅ On Google Meet/● On Google Meet/g' \
  popup.html

echo "✓ All emojis removed!"
