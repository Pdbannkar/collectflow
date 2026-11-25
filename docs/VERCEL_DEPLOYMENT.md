# 🚀 CollectFlow — Vercel Deployment Guide

Deploying your **CollectFlow** platform to Vercel takes **under 3 minutes** and provides:
- ⚡ **Global Edge CDN** with sub-50ms latency across India and worldwide.
- 🔒 **Automatic SSL** (HTTPS) certificates with zero configuration.
- 🔄 **Continuous Deployment** (Every `git push` to your GitHub repo automatically updates your live site).
- 🌐 **Free custom domain support** (e.g. `collectflow.in` or `app.yourdomain.com`).

---

## 📋 Pre-Deployment Checklist

Before deploying, ensure:
1. Your code is committed to Git (already done ✅).
2. Your repository is pushed to **GitHub**, **GitLab**, or **Bitbucket**.

---

## 🌟 METHOD 1: 1-Click Deployment via Vercel Web Dashboard (Recommended)

### Step 1: Push your Code to GitHub
If you haven't pushed your local repository to GitHub yet, run these commands in your terminal:

```bash
# 1. Create a new repository on https://github.com/new (e.g. "collectflow")
# 2. Add your GitHub remote and push:
git remote add origin https://github.com/YOUR_GITHUB_USERNAME/collectflow.git
git branch -M main
git push -u origin main
```

---

### Step 2: Import into Vercel
1. Log in to [Vercel.com](https://vercel.com) (sign in with your GitHub account).
2. Click **"Add New..."** ➔ **"Project"**.
3. Under **Import Git Repository**, find your `collectflow` repository and click **"Import"**.

---

### Step 3: Configure Project Settings

Thanks to the root [vercel.json](file:///D:/Daily%20Collection%20App/vercel.json), Vercel automatically detects Next.js!

Verify the following settings in the Vercel import screen:
- **Framework Preset:** `Next.js`
- **Root Directory:** `./` (or click Edit and select `apps/web`)
- **Build Command:** `npm run build --workspace=@collectflow/web` (Auto-filled by `vercel.json`)
- **Output Directory:** `apps/web/.next` (Auto-filled by `vercel.json`)

---

### Step 4: Add Environment Variables
Under **Environment Variables**, add the following:

| Key | Example Value | Description |
| :--- | :--- | :--- |
| `NEXT_PUBLIC_API_URL` | `https://your-api.onrender.com` | URL of your NestJS backend (or leave blank for frontend demo mode) |
| `CASHFREE_APP_ID` | `TEST10293848` | Optional: Cashfree Client ID for live PAN Verification |
| `CASHFREE_SECRET_KEY` | `cfsk_ma_test_xxxx` | Optional: Cashfree Client Secret for live PAN Verification |
| `CASHFREE_ENVIRONMENT` | `sandbox` | `sandbox` or `production` |

---

### Step 5: Click "Deploy"
1. Click the blue **"Deploy"** button.
2. Vercel will build your project in ~45 seconds.
3. 🎉 You will receive your live production URL:
   ```
   https://collectflow.vercel.app
   ```

---

## 💻 METHOD 2: Deploy Directly via Terminal (Vercel CLI)

If you prefer deploying directly from your computer terminal without opening a browser:

```bash
# 1. Open PowerShell or terminal in the project directory
cd "D:\Daily Collection App"

# 2. Run the Vercel deploy command
npx vercel

# 3. Follow the 4 quick prompts:
#    ? Set up and deploy “D:\Daily Collection App”? [Y/n] y
#    ? Which scope do you want to deploy to? (Select your Vercel account)
#    ? Link to existing project? [y/N] n
#    ? What’s your project’s name? collectflow
#    ? In which directory is your code located? ./

# 4. For production release:
npx vercel --prod
```

---

## 🌐 Adding Your Custom Domain (e.g. `collectflow.in`)

1. In your Vercel Project Dashboard, go to **Settings** ➔ **Domains**.
2. Type your domain (e.g., `collectflow.in` or `app.yourbrand.com`) and click **Add**.
3. Add the DNS records shown by Vercel into your domain registrar (GoDaddy, Namecheap, Hostinger, Cloudflare):
   - **For Apex Domain (`collectflow.in`):**
     - Type: `A` | Name: `@` | Value: `76.76.21.21`
   - **For Subdomain (`app.collectflow.in`):**
     - Type: `CNAME` | Name: `app` | Value: `cname.vercel-dns.com`
4. Vercel will verify your domain within 60 seconds and automatically issue a free SSL certificate!

---

## 🛡️ Live Features Ready on Vercel
- ✅ **Marketing Landing Page** (`/`): High-converting marketing hero, ROI calculator, and category previews.
- ✅ **Customer / Payer Portal** (`/portal`): Multi-institution switcher with dynamic feature adaptation (Mess holiday vacation pause, Lending RBI KFS/APR/sanction letters, School tuition itemization).
- ✅ **Business Management Portal** (`/dashboard`): Real-time collection ledgers, customer directory, payment plan creator, and automated Indian PAN card verification.
- ✅ **Super Admin Portal** (`/admin`): Merchant onboarding approvals, KYC verification, and gateway configurations.
