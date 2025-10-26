module.exports = {
  apps: [
    {
      name: 'taxgeniuspro',
      script: 'npm',
      args: 'start',
      cwd: '/root/websites/taxgeniuspro',
      exec_mode: 'fork',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      min_uptime: '10s',
      max_restarts: 10,
      restart_delay: 5000,
      env: {
        NODE_ENV: 'production',
        PORT: '3005',

        // Database
        DATABASE_URL: 'postgresql://taxgeniuspro_user:TaxGenius2024Secure@localhost:5436/taxgeniuspro_db?schema=public',

        // Redis
        REDIS_URL: 'redis://localhost:6305',

        // Clerk Authentication
        NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: 'pk_test_bGVhcm5pbmctc3RhZy0zMi5jbGVyay5hY2NvdW50cy5kZXYk',
        CLERK_SECRET_KEY: 'sk_test_EJd9iO7b6U8XB25JzdTkq72nZbr3EWrWbxvAG1NGlN',
        NEXT_PUBLIC_CLERK_SIGN_IN_URL: '/auth/login',
        NEXT_PUBLIC_CLERK_SIGN_UP_URL: '/auth/signup',
        NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL: '/dashboard',
        NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL: '/auth/select-role',

        // Resend Email
        RESEND_API_KEY: 're_etoZgion_7TUfB2EWL6hnGvyhyqGfYEen',
        RESEND_FROM_EMAIL: 'noreply@taxgeniuspro.tax',

        // Application
        NEXT_PUBLIC_APP_URL: 'https://taxgeniuspro.tax',
        PAYMENT_MODE: 'test',

        // Google Analytics
        NEXT_PUBLIC_GA_MEASUREMENT_ID: 'G-9GM95J7Z3V',

        // Commission Settings
        COMMISSION_RATE_BASIC: '25',
        COMMISSION_RATE_STANDARD: '35',
        COMMISSION_RATE_PREMIUM: '50',
        COMMISSION_RATE_DELUXE: '75',
        MINIMUM_PAYOUT_AMOUNT: '50',
        ADMIN_EMAIL: 'admin@taxgeniuspro.tax',

        // Square Payment Integration (Production)
        SQUARE_APPLICATION_ID: 'sq0idp-wVe6GioWdoSRKUXakNil6Q',
        SQUARE_ACCESS_TOKEN: 'EAAAFCL8kleVGe-UZC29aX7R_GRRZQqH_9faOg8FApJVc_twWfmyBnAloGef5wrh',
        SQUARE_ENVIRONMENT: 'production',
        SQUARE_LOCATION_ID: 'LKHN5A7S3S1GT', // Your Square location ID
        NEXT_PUBLIC_SQUARE_APPLICATION_ID: 'sq0idp-wVe6GioWdoSRKUXakNil6Q', // Public key for frontend

        // Tax Genius Preparer ID
        TAX_GENIUS_PREPARER_ID: 'cmh169bs50000jx1g5uql0n9b',

        // OpenAI API (Tax Assistant)
        OPENAI_API_KEY: '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',
        OPENAI_ASSISTANT_ID: 'asst_y6GVeHCSgYL5Sh2rXZwobK4Z',

        // PWA Push Notifications
        NEXT_PUBLIC_VAPID_PUBLIC_KEY: 'BAg6bWeYUk8WkeX6KWXyS3Gh_2Yz5i7i2shoCDQTYMCMn-Tyy6MoQOfxEDeQ3yHQcIhkRsVrWO-9yh1TwU8cLZo',
        VAPID_PRIVATE_KEY: 'H-i4GqfWnY-Fk5kQRecSszePQsA296db2w0EWB_3Ynk',
        VAPID_SUBJECT: 'mailto:support@taxgeniuspro.tax',

        // Google Gemini AI
        GEMINI_API_KEY: 'AIzaSyA-cCLRxQGKtaO2sO6nr2OTod9-Pktb6N8',

        // Ollama (Local LLM)
        OLLAMA_BASE_URL: 'http://localhost:11434',
        OLLAMA_MODEL: 'qwen2.5:32b',

        // FedEx Shipping (Sandbox/Test)
        FEDEX_ACCOUNT_NUMBER: '740561073',
        FEDEX_API_KEY: 'l7025fb524de9d45129c7e94f4435043d6',
        FEDEX_SECRET_KEY: '196fddaacc384aac873a83e456cb2de0',
        FEDEX_API_ENDPOINT: 'https://apis-sandbox.fedex.com',
        FEDEX_TEST_MODE: 'true',
        FEDEX_MARKUP_PERCENTAGE: '0',
        FEDEX_USE_INTELLIGENT_PACKING: 'true',
        FEDEX_ENABLED_SERVICES: '',
        FEDEX_RATE_TYPES: 'LIST,ACCOUNT',

        // Shipping Origin (Atlanta Office - Tax Genius Pro)
        SHIPPING_ORIGIN_STREET: '1632 Jonesboro Rd SE',
        SHIPPING_ORIGIN_CITY: 'Atlanta',
        SHIPPING_ORIGIN_STATE: 'GA',
        SHIPPING_ORIGIN_ZIP: '30315',
        SHIPPING_ORIGIN_COUNTRY: 'US',
        SHIPPING_ORIGIN_IS_RESIDENTIAL: 'false',
      },
      error_file: '/root/.pm2/logs/taxgeniuspro-error.log',
      out_file: '/root/.pm2/logs/taxgeniuspro-out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      merge_logs: true,
    },
  ],
};
