<h1 align="center">🍽️ React Native Recipe App 🍽️</h1>

![Demo App](/mobile/assets/images//screenshot-for-readme.png)

# 🍳 Full Stack Recipe App 📱

A feature-rich Full Stack Recipe application built with React Native (Expo) on the frontend, a Node.js/Express backend, PostgreSQL database, and integrated Stripe payments.

---

## ✨ Features & Highlights

* 🔐 **Authentication:** Signup, Login, and 6-Digit Email Verification (Clerk / JWT support).
* 💳 **Stripe Payments:** Integrated Stripe Paywall with Basic & Premium subscription tiers.
* 🍳 **Explore & Filter:** Browse featured recipes and filter by diverse food categories.
* 🔍 **Search & Cooking Details:** Instant recipe search with complete step-by-step cooking instructions.
* 🎥 **Video Tutorials:** Embedded YouTube video tutorials inside recipe pages.
* ❤️ **Favorites System:** Save favorite recipes and access them anytime from the Favorites tab.
* 🌈 **Custom Themes:** Includes 8 color themes to personalize the app UI.
* 🔒 **Secure Setup:** Environment variables (.env) handled securely across Frontend & Backend.

---

## 🛠️ Tech Stack

* **Frontend:** React Native, Expo, React Navigation, WebView
* **Backend:** Node.js, Express.js, Stripe SDK
* **Database:** PostgreSQL (with Drizzle ORM)
* **Auth & Mailer:** Clerk / Nodemailer / JWT
* **Deployment:** Vercel (Backend)

---

## ⚙️ Environment Variables (.env) Setup

### Backend (`/backend/.env`)
```env
PORT=5001
NODE_ENV=development
DATABASE_URL=your_postgres_db_url
JWT_SECRET=your_jwt_secret
EMAIL_USER=your_email
EMAIL_PASS=your_email_pass

STRIPE_SECRET_KEY=sk_test_...
STRIPE_BASIC_PRICE_ID=price_...
STRIPE_PREMIUM_PRICE_ID=price_...
