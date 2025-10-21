@echo off
echo Setting up placeholder images for portfolio...
echo.

cd assets\images

echo Downloading avatar image...
curl -s "https://picsum.photos/120/120" -o "avatar.jpg"

echo Downloading about photo...
curl -s "https://picsum.photos/400/400" -o "about-photo.jpg"

echo Downloading project screenshots...
curl -s "https://picsum.photos/600/300" -o "project-chowmin.jpg"
curl -s "https://picsum.photos/600/300" -o "project-employee.jpg"
curl -s "https://picsum.photos/600/300" -o "project-pdf.jpg"
curl -s "https://picsum.photos/600/300" -o "project-ai-photo.jpg"
curl -s "https://picsum.photos/600/300" -o "project-telegram.jpg"
curl -s "https://picsum.photos/600/300" -o "project-dpr.jpg"

echo.
echo ✅ Placeholder images downloaded successfully!
echo.
echo 📸 IMPORTANT: Replace 'avatar.jpg' and 'about-photo.jpg' with your actual professional photos
echo 📱 Replace project screenshots with actual app screenshots when available
echo.
echo 🚀 Your portfolio is ready! Open index.html to view it.
echo.
pause