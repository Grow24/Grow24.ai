# ms_check (Microsoft Integration) - Quick KT

This folder is a Microsoft Graph integration (Excel viewer + OneDrive browser) built as a single Node/Express server with static pages.

## First-time setup (Azure)

1. Go to Azure Portal → App registrations → New registration.
2. Set Redirect URI (Web): `http://localhost:5173/auth/callback`.
3. Create a Client Secret and copy the secret value.
4. Add Delegated permissions (Microsoft Graph):
   - `User.Read`
   - `Files.Read.All`
   - `Files.ReadWrite.All`
   - `offline_access`
5. Grant admin consent if required by your tenant.

## Local setup

1. `cd ms_check && npm install`
2. Update `server.js` with `CLIENT_ID`, `CLIENT_SECRET`, `REDIRECT_URI`.
3. Start: `npm start` or `node server.js`.
4. Open `http://localhost:5173` and sign in.

## How it connects

- OAuth tokens are obtained from Azure and used to call Microsoft Graph APIs.
- The Excel viewer embeds Office Online via iframe using the file’s web URL.
