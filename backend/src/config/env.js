import "dotenv/config";

export const ENV = {
  PORT: process.env.PORT || 5001,
  DATABASE_URL: process.env.DATABASE_URL,
  
  NODE_ENV: process.env.NODE_ENV,
  JWT_SECRET: process.env.JWT_SECRET,

  EMAIL_USER: process.env.EMAIL_USER,
  EMAIL_PASS: process.env.EMAIL_PASS,

  STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
  STRIPE_PUBLISHABLE_KEY: process.env.STRIPE_PUBLISHABLE_KEY,

  STRIPE_BASIC_PRICE_ID: process.env.STRIPE_BASIC_PRICE_ID,
STRIPE_PREMIUM_PRICE_ID: process.env.STRIPE_PREMIUM_PRICE_ID,
};