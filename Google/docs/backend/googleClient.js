import { google } from "googleapis";
import dotenv from "dotenv";
dotenv.config();

export const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
);

export const SCOPES = [
  "https://www.googleapis.com/auth/documents",   //Google Docs  access for creating and updating documents
  "https://www.googleapis.com/auth/documents.readonly",
  "https://www.googleapis.com/auth/drive",       // ✅ Full Drive access for sharing
  "https://www.googleapis.com/auth/drive.file",  // ✅ Manage files created by app
  "https://www.googleapis.com/auth/gmail.send",  // ✅ Send emails via Gmail API
];

export function getAuthUrl() {
  return oauth2Client.generateAuthUrl({
    access_type: "offline",
    scope: SCOPES,
    prompt: "consent",
  });
}