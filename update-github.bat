@echo off
cd /d "%~dp0"
git rm -r --cached backend/ 2>nul
git add .gitignore
git add -A
git commit -m "fix: exclude backend/ from Vercel via .gitignore (deploy separately on Render)"
git push
echo.
echo Fait ! Retourne sur Vercel et clique Refresh.
pause
