# 🚀 Deploy Your Portfolio to Vercel

## ✅ **Chowmin Shop Image - FIXED!**
The image is now in the correct location: `assets/images/projects/chowmin-shop.jpg`
Your portfolio will now show it properly!

---

## 🌐 **Deploy to Vercel - Complete Guide**

### **Method 1: Deploy via Vercel Website (Easiest - No Git Required)**

#### **Step 1: Prepare Your Portfolio**
1. ✅ Your portfolio is already ready!
2. ✅ All files are in: `C:\Users\R A J A\Pyton_proj\my_portfolio`

#### **Step 2: Create Vercel Account**
1. Go to: **https://vercel.com**
2. Click **"Sign Up"**
3. Choose **"Continue with GitHub"** (or Email)
4. Complete the registration

#### **Step 3: Deploy Your Portfolio**

**Option A: Drag & Drop (Super Easy)**
1. Log in to Vercel
2. Click **"Add New..."** → **"Project"**
3. Click **"Browse"** or drag your `my_portfolio` folder
4. Vercel will automatically deploy!
5. Your site will be live in 30 seconds! 🎉

**Option B: Vercel CLI (Command Line)**
1. Open PowerShell in your portfolio folder
2. Run these commands:

```powershell
# Install Vercel CLI globally
npm install -g vercel

# Login to Vercel
vercel login

# Deploy your portfolio
cd "C:\Users\R A J A\Pyton_proj\my_portfolio"
vercel

# Follow the prompts:
# - Set up and deploy? Yes
# - Scope? Select your account
# - Link to existing project? No
# - Project name? my-portfolio (or any name)
# - Directory? ./ (current directory)
# - Want to modify settings? No

# Your site is now live! 🚀
```

---

### **Method 2: Deploy via GitHub (Recommended for Updates)**

#### **Step 1: Install Git**
If you don't have Git installed:
1. Download: https://git-scm.com/download/win
2. Install with default settings

#### **Step 2: Create GitHub Repository**
1. Go to: **https://github.com**
2. Click **"+"** → **"New repository"**
3. Name: `my-portfolio`
4. Choose: **Public**
5. Click **"Create repository"**

#### **Step 3: Push Your Code to GitHub**
Open PowerShell in your portfolio folder:

```powershell
cd "C:\Users\R A J A\Pyton_proj\my_portfolio"

# Initialize Git
git init

# Add all files
git add .

# Commit files
git commit -m "Initial portfolio commit"

# Add GitHub repository (replace YOUR_USERNAME with your GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/my-portfolio.git

# Push to GitHub
git branch -M main
git push -u origin main
```

#### **Step 4: Connect Vercel to GitHub**
1. Go to **Vercel Dashboard**
2. Click **"Add New..."** → **"Project"**
3. Click **"Import Git Repository"**
4. Select your **"my-portfolio"** repo
5. Click **"Deploy"**
6. ✅ **DONE!** Your site is live!

---

## 🎯 **After Deployment**

### **Your Live URLs:**
- **Vercel URL**: `https://your-project-name.vercel.app`
- **Custom Domain** (Optional): You can add your own domain later

### **Automatic Updates:**
- Push to GitHub → Vercel auto-deploys!
- Change anything → Git push → Auto updates! ✨

---

## ⚙️ **Vercel Configuration (Optional)**

Create a file: `vercel.json` in your portfolio folder:

```json
{
  "buildCommand": null,
  "outputDirectory": ".",
  "framework": null,
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

This ensures proper routing for your single-page app.

---

## 🔧 **Environment Setup (If Using CLI)**

### **Install Node.js (Required for Vercel CLI)**
1. Download: https://nodejs.org/ (LTS version)
2. Install with default settings
3. Verify installation:
```powershell
node --version
npm --version
```

### **Install Vercel CLI**
```powershell
npm install -g vercel
```

### **Login to Vercel**
```powershell
vercel login
```

### **Deploy**
```powershell
cd "C:\Users\R A J A\Pyton_proj\my_portfolio"
vercel --prod
```

---

## 📋 **Quick Deployment Checklist**

✅ **Before Deploying:**
- [x] All images in correct folders
- [x] Resume PDF exists (`assets/resume.pdf`)
- [x] No broken links
- [x] GitHub stats working
- [x] All buttons functional

✅ **Deployment Steps:**
1. Create Vercel account
2. Choose deployment method (Drag & Drop OR GitHub)
3. Deploy!
4. Get your live URL
5. Share your portfolio! 🎉

---

## 🎨 **Custom Domain (Optional)**

### **To Add Your Own Domain:**
1. Go to Vercel Dashboard
2. Select your project
3. Go to **Settings** → **Domains**
4. Click **"Add"**
5. Enter your domain (e.g., `gourahari.dev`)
6. Follow DNS instructions
7. ✅ Your portfolio is live on your domain!

---

## 🚀 **Deployment Commands Reference**

```powershell
# First time deploy
vercel

# Deploy to production
vercel --prod

# Check deployment status
vercel ls

# View logs
vercel logs

# Remove deployment
vercel rm [deployment-url]
```

---

## 💡 **Pro Tips:**

✅ **Free Plan Includes:**
- Unlimited deployments
- Automatic HTTPS
- Global CDN
- 100GB bandwidth/month
- Custom domains

✅ **Best Practices:**
- Use GitHub for version control
- Test locally before deploying
- Check all links and images
- Monitor deployment logs

✅ **Update Your Portfolio:**
```powershell
# Make changes to your files
git add .
git commit -m "Updated portfolio"
git push

# Vercel auto-deploys! ✨
```

---

## 🎯 **Your Portfolio is Production-Ready!**

Everything is fixed and ready to deploy:
- ✅ Images loading correctly
- ✅ HD quality optimized
- ✅ Resume download working
- ✅ GitHub stats functional
- ✅ All animations smooth
- ✅ Mobile responsive

**Choose your deployment method and go live in 5 minutes!** 🚀

---

## 📞 **Need Help?**

- Vercel Docs: https://vercel.com/docs
- Support: https://vercel.com/support
- Community: https://github.com/vercel/vercel/discussions

**Your portfolio looks amazing! Time to show it to the world!** 🌟
