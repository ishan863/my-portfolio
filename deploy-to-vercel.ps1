# Portfolio Vercel Deployment Script
# Run this script to deploy your portfolio to Vercel

Write-Host "🚀 Portfolio Deployment Script" -ForegroundColor Cyan
Write-Host "================================" -ForegroundColor Cyan
Write-Host ""

# Check if Node.js is installed
Write-Host "Checking Node.js installation..." -ForegroundColor Yellow
try {
    $nodeVersion = node --version
    Write-Host "✅ Node.js is installed: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Node.js is not installed!" -ForegroundColor Red
    Write-Host "Please install Node.js from: https://nodejs.org/" -ForegroundColor Yellow
    Write-Host ""
    $install = Read-Host "Open Node.js download page? (Y/N)"
    if ($install -eq "Y" -or $install -eq "y") {
        Start-Process "https://nodejs.org/"
    }
    exit
}

# Check if Vercel CLI is installed
Write-Host ""
Write-Host "Checking Vercel CLI installation..." -ForegroundColor Yellow
try {
    $vercelVersion = vercel --version
    Write-Host "✅ Vercel CLI is installed: $vercelVersion" -ForegroundColor Green
} catch {
    Write-Host "⚠️ Vercel CLI is not installed" -ForegroundColor Yellow
    Write-Host ""
    $installVercel = Read-Host "Install Vercel CLI now? (Y/N)"
    
    if ($installVercel -eq "Y" -or $installVercel -eq "y") {
        Write-Host "Installing Vercel CLI..." -ForegroundColor Cyan
        npm install -g vercel
        Write-Host "✅ Vercel CLI installed!" -ForegroundColor Green
    } else {
        Write-Host "Please install Vercel CLI manually: npm install -g vercel" -ForegroundColor Yellow
        exit
    }
}

# Deployment options
Write-Host ""
Write-Host "================================" -ForegroundColor Cyan
Write-Host "Choose deployment option:" -ForegroundColor Cyan
Write-Host "1. Deploy to Production (Recommended)" -ForegroundColor Green
Write-Host "2. Deploy to Preview" -ForegroundColor Yellow
Write-Host "3. Login to Vercel" -ForegroundColor Blue
Write-Host "4. Check Deployment Status" -ForegroundColor Magenta
Write-Host "5. Open Vercel Dashboard" -ForegroundColor Cyan
Write-Host "6. Exit" -ForegroundColor White
Write-Host ""

$choice = Read-Host "Enter your choice (1-6)"

switch ($choice) {
    "1" {
        Write-Host ""
        Write-Host "🚀 Deploying to Production..." -ForegroundColor Green
        vercel --prod
        Write-Host ""
        Write-Host "✅ Deployment complete!" -ForegroundColor Green
        Write-Host "Your portfolio is now live! 🎉" -ForegroundColor Cyan
    }
    "2" {
        Write-Host ""
        Write-Host "🧪 Deploying to Preview..." -ForegroundColor Yellow
        vercel
        Write-Host ""
        Write-Host "✅ Preview deployment complete!" -ForegroundColor Green
    }
    "3" {
        Write-Host ""
        Write-Host "🔐 Opening Vercel login..." -ForegroundColor Blue
        vercel login
    }
    "4" {
        Write-Host ""
        Write-Host "📊 Checking deployment status..." -ForegroundColor Magenta
        vercel ls
    }
    "5" {
        Write-Host ""
        Write-Host "🌐 Opening Vercel Dashboard..." -ForegroundColor Cyan
        Start-Process "https://vercel.com/dashboard"
    }
    "6" {
        Write-Host ""
        Write-Host "👋 Goodbye!" -ForegroundColor White
        exit
    }
    default {
        Write-Host ""
        Write-Host "❌ Invalid choice!" -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "================================" -ForegroundColor Cyan
Write-Host "Press any key to exit..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
