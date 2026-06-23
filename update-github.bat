@echo off
cd /d "%~dp0"
git add -A
git commit -m "fix: remove vercel.json to let Vercel auto-detect Vite"
git push
echo.
echo Fait ! Retourne sur Vercel et clique Refresh.
pause
