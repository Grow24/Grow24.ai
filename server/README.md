# Send Email API

Run the send-email server so "Send email" from the Contact Us page works:

```bash
npm run server:email
```

Runs on **port 3001** by default. Set env vars:

| Variable       | Required | Description                          |
|----------------|----------|--------------------------------------|
| `SMTP_HOST`    | Yes      | e.g. `smtp.gmail.com`                |
| `SMTP_USER`    | Yes      | SMTP login                           |
| `SMTP_PASS`    | Yes      | SMTP password (or app password)     |
| `FROM_EMAIL`   | No       | From address (defaults to SMTP_USER) |
| `SMTP_PORT`    | No       | Default `587`                       |
| `SMTP_SECURE`  | No       | Set `true` for port 465              |
| `PORT`         | No       | API port (default `3001`)            |

With Vite dev server, the app proxies `/api/send-email` to this server. For production, deploy this server and set `VITE_SEND_EMAIL_ENDPOINT` to its URL (e.g. `https://your-api.com/api/send-email`).
