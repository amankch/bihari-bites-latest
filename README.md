# BIHARI BITES — SWAD ASLI CRUNCH DESI 🌾
### Production-Ready Direct-to-Consumer (D2C) E-Commerce & Admin Platform

An omnichannel, high-performance D2C platform crafted for authentic Bihari delicacies (**Khasta Thekua, Roasted Chana Sattu, Bharua Lal Mirch Aachar, and Bilona Danedar Ghee**).

- **Official Helpline & WhatsApp Support:** `+917281991952`
- **Default UPI Merchant VPA:** `7281991952@upi`
- **Merchant Name:** `BIHARI BITES`

---

## 🚀 Tech Stack

- **Framework:** Next.js 15 (App Router, React 19, Server Components & Route Handlers)
- **Database:** PostgreSQL on Neon DB (Serverless connection pooling with PgBouncer)
- **ORM:** Prisma ORM 7.x (with `@prisma/adapter-neon` and `prisma.config.ts`)
- **UI & Styling:** Shadcn UI, Tailwind CSS, Lucide Icons, Class Variance Authority
- **State & Data Fetching:** TanStack Query v5
- **Form Management & Validation:** React Hook Form + Zod
- **Authentication:** Better Auth (Google Social Sign-In & OTP passwordless auth)
- **Payment Engine:** Native NPCI UPI Protocol (Dynamic QR Code + Mobile Deep-link Intent + 12-digit UTR Verification)

---

## ⚡ Quick Setup & Getting Started with Prisma 7 + Neon

### 1. Environment Configuration
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
Provide your **Neon DB PostgreSQL** credentials in `.env`:
```ini
DATABASE_URL="postgresql://neondb_owner:[PASSWORD]@[HOST]-pooler.us-east-2.aws.neon.tech/bihari-bites?sslmode=require"
DATABASE_URL_UNPOOLED="postgresql://neondb_owner:[PASSWORD]@[HOST].us-east-2.aws.neon.tech/bihari-bites?sslmode=require"
DIRECT_URL="postgresql://neondb_owner:[PASSWORD]@[HOST].us-east-2.aws.neon.tech/bihari-bites?sslmode=require"
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Generate Prisma 7 Client & Push to Neon DB
```bash
# Push schema to your Neon PostgreSQL database
npx prisma db push

# Generate Prisma 7 Client
npx prisma generate

# Seed authentic Bihari delicacies (Thekua, Sattu, Aachar, Ghee)
npm run prisma:seed
```

### 4. Start Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) for the Storefront or [http://localhost:3000/admin](http://localhost:3000/admin) for the Merchant Admin Panel.
