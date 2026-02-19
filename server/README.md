# Send Email API

Run the send-email server so "Send email" from the Contact Us page works:

```bash
npm run server:email
```

Runs on **port 3001** by default. The Vite dev server (port 5173) proxies `/api/send-email` to this server, so both must be running for Send Email to work.

**Option A – SendGrid (recommended if you use it for the main backend):**

| Variable             | Required | Description                                |
|----------------------|----------|--------------------------------------------|
| `SENDGRID_API_KEY`   | Yes      | Your SendGrid API key                      |
| `FROM_EMAIL`         | No       | From address (e.g. `noreply@grow24.ai`)    |
| `PORT`               | No       | API port (default `3001`)                  |

**Option B – Generic SMTP:**

| Variable       | Required | Description                          |
|----------------|----------|--------------------------------------|
| `SMTP_HOST`    | Yes      | e.g. `smtp.gmail.com`                |
| `SMTP_USER`    | Yes      | SMTP login                           |
| `SMTP_PASS`    | Yes      | SMTP password (or app password)     |
| `FROM_EMAIL`   | No       | From address (defaults to SMTP_USER) |
| `SMTP_PORT`    | No       | Default `587`                        |
| `SMTP_SECURE`  | No       | Set `true` for port 465              |
| `PORT`         | No       | API port (default `3001`)            |

If neither SendGrid nor SMTP is configured, the server returns 500 with a clear message; set one of the options above and restart.

For production, deploy this server and set `VITE_SEND_EMAIL_ENDPOINT` to its URL (e.g. `https://your-api.com/api/send-email`).
