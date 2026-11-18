# CollectFlow — Production Hosting & Deployment Guide

This guide explains how to host your **CollectFlow** platform online with live public URLs, custom domains, and SSL certificates.

---

## 🏗️ Architecture to Host

Your platform consists of 3 main pieces:

```
┌────────────────────────────────┐     ┌────────────────────────────────┐
│      1. Frontend (Next.js)     │────▶│      2. Backend (NestJS)       │
│  - Marketing Landing Page (/)  │     │  - REST API (/api/v1/...)      │
│  - Business Dashboard          │     │  - Payment Webhook Listeners   │
│  - Customer / Payer Portal     │     │  - Swagger Docs (/api/docs)    │
│  - Login & Signup Wizard       │     └───────────────┬────────────────┘
└────────────────────────────────┘                     │
                                                       ▼
                                       ┌────────────────────────────────┐
                                       │     3. Database & Cache        │
                                       │  - PostgreSQL (Prisma ORM)     │
                                       │  - Redis (BullMQ Queues)       │
                                       └────────────────────────────────┘
```

---

## 🚀 METHOD 1: Free & Low-Cost Cloud Setup (Recommended — 15 Mins)

This is the easiest, modern method requiring **zero Linux or server management**.

### Step 1: Host PostgreSQL Database (Free on Supabase or Neon.tech)
1. Go to [Supabase.com](https://supabase.com) (or [Neon.tech](https://neon.tech)) and create a free account.
2. Click **New Project** and name it `collectflow-db`.
3. Choose the region closest to India (e.g., `Singapore` or `Mumbai`).
4. Copy the **Connection String (URI)**:
   ```
   postgresql://postgres:[YOUR-PASSWORD]@db.xxxx.supabase.co:5432/postgres
   ```
5. Run your migrations to initialize all tables:
   ```bash
   cd packages/database
   npx prisma db push
   npx ts-node prisma/seed.ts
   ```

---

### Step 2: Host Backend API (Render.com or Railway.app)
1. Push your project to a GitHub repository:
   ```bash
   git init
   git add .
   git commit -m "Initial CollectFlow build"
   git remote add origin https://github.com/your-username/collectflow.git
   git push -u origin main
   ```
2. Go to [Render.com](https://render.com) and create a **New Web Service**.
3. Connect your GitHub repository.
4. Set the following settings:
   - **Root Directory:** `apps/api`
   - **Build Command:** `npm install && npx prisma generate --schema=../../packages/database/prisma/schema.prisma && npm run build`
   - **Start Command:** `npm run start`
5. Under **Environment Variables**, add:
   - `NODE_ENV` = `production`
   - `PORT` = `3001`
   - `DATABASE_URL` = (Your Supabase/Neon PostgreSQL URL from Step 1)
   - `JWT_SECRET` = (Generate a random 64-character string)
   - `JWT_REFRESH_SECRET` = (Generate another random 64-character string)
   - `CASHFREE_APP_ID` = (Your live or sandbox Cashfree App ID)
   - `CASHFREE_SECRET_KEY` = (Your Cashfree Secret Key)
   - `CASHFREE_ENVIRONMENT` = `sandbox` (change to `production` when approved)
6. Click **Deploy**. Render will give you a public URL like:
   `https://collectflow-api.onrender.com`

---

### Step 3: Host Frontend (Vercel — 1-Click Free Hosting)
1. Go to [Vercel.com](https://vercel.com) and sign in with GitHub.
2. Click **Add New Project** and select your `collectflow` repository.
3. Configure the project:
   - **Framework Preset:** Next.js
   - **Root Directory:** Edit and select `apps/web`
4. Under **Environment Variables**, add:
   - `NEXT_PUBLIC_API_URL` = `https://collectflow-api.onrender.com` (from Step 2)
5. Click **Deploy**.
6. Within 1 minute, Vercel will give you a live production URL:
   `https://collectflow.vercel.app` (or your custom domain like `collectflow.in`).

---

## 🐳 METHOD 2: All-In-One Cloud VPS (DigitalOcean / Hostinger / AWS EC2)

If you prefer having everything (Frontend, Backend, PostgreSQL, and Redis) on a single self-hosted server for ₹400 – ₹700/month:

### 1. Launch an Ubuntu 22.04 or 24.04 VPS
- Providers: Hostinger VPS ($5/mo), DigitalOcean Droplet ($6/mo), or AWS EC2 `t3.medium`.

### 2. Connect via SSH and install Docker:
```bash
ssh root@your-server-ip

# Install Docker & Docker Compose
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh
sudo apt install -y docker-compose-plugin
```

### 3. Clone your code:
```bash
git clone https://github.com/your-username/collectflow.git
cd collectflow
```

### 4. Create your production environment file:
```bash
cp .env.example .env
nano .env
```
Fill in your domain and secure passwords.

### 5. Launch with Docker Compose:
```bash
cd infra/docker
docker compose up -d --build
```
Your containers will start:
- PostgreSQL on `5432`
- Redis on `6379`
- NestJS API on `3001`
- Next.js Web Frontend on `3000`

### 6. Set Up Nginx Reverse Proxy & Free SSL:
```bash
sudo apt install -y nginx certbot python3-certbot-nginx

# Configure Nginx for your domain (e.g. app.yourdomain.com)
sudo nano /etc/nginx/sites-available/collectflow
```

Add this block:
```nginx
server {
    server_name app.yourdomain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    location /api/ {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

Enable site and get free SSL:
```bash
sudo ln -s /etc/nginx/sites-available/collectflow /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
sudo certbot --nginx -d app.yourdomain.com
```

---

## 🏷️ Connecting a Custom Domain (e.g. `collectflow.in`)

1. Buy your domain on GoDaddy, Namecheap, or Cloudflare.
2. In your DNS Manager, add:
   - **Type:** `CNAME`
   - **Name:** `@` (or `app`)
   - **Value:** `cname.vercel-dns.com` (if using Vercel) or your VPS IP address (if using VPS).
3. In Vercel (or Nginx), enter your domain and SSL certificates are provisioned automatically.

---

## 🔐 Production Gateway Activation Checklist

Before switching Cashfree or Razorpay from Sandbox to Production:

1. [ ] **Merchant Verification:** Complete KYC on [cashfree.com](https://www.cashfree.com) or [razorpay.com](https://razorpay.com).
2. [ ] **Activate Subscriptions:** Ensure "UPI AutoPay" and "Subscriptions" products are enabled in the gateway dashboard.
3. [ ] **Configure Webhook Endpoint:**
   - Cashfree Webhook URL: `https://your-api-domain.com/api/v1/webhooks/cashfree`
   - Razorpay Webhook URL: `https://your-api-domain.com/api/v1/webhooks/razorpay`
4. [ ] **Set Live Environment Variables:**
   - Update `CASHFREE_ENVIRONMENT=production`
   - Add live `CASHFREE_APP_ID` & `CASHFREE_SECRET_KEY`.
