declare global {
  namespace NodeJS {
    interface ProcessEnv {
      PAYLOAD_SECRET: string;
      DATABASE_URI: string;
      NEXT_PUBLIC_SERVER_URL: string;
      VERCEL_PROJECT_PRODUCTION_URL: string;
      NEXT_PUBLIC_BETTER_AUTH_URL: string;
      CLOUDFLARE_ACCOUNT_ID: string;
      CLOUDFLARE_SECRET_KEY_ID: string;
      CLOUDFLARE_KEY_SECRET: string;
      S3_BUCKET: string;
      SMTP_FROM: string;
      SMTP_HOST: string;
      SMTP_USER: string;
      SMTP_PASS: string;
      NEXT_PUBLIC_TOLGEE_API_URL: string;
      NEXT_PUBLIC_TOLGEE_API_KEY: string;
      NEXT_PUBLIC_PAYPAL_CLIENT_ID: string;
      PAYPAL_CLIENT_ID: string;
      PAYPAL_CLIENT_SECRET: string;
    }
  }
}

// If this file has no import/export statements (i.e. is a script)
// convert it into a module by adding an empty export statement.
export {};
