/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_ENDPOINT?: string
  readonly VITE_SEND_EMAIL_ENDPOINT?: string
  readonly VITE_WHATSAPP_NUMBER?: string
  readonly VITE_CLERK_PUBLISHABLE_KEY?: string
  readonly VITE_LEAD_API_ENDPOINT?: string
  // Add more env variables as needed
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
