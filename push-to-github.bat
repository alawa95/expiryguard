@echo off
echo ================================================
echo   ExpiryGuard - Push vers GitHub
echo ================================================
echo.
echo Repo cible : https://github.com/alawa95/expiryguard
echo.

cd /d "%~dp0"

echo Initialisation de Git...
git init
git branch -M main

echo.
echo Ajout de tous les fichiers...
git add .
git commit -m "Initial commit - ExpiryGuard frontend"

echo.
echo Connexion au repo GitHub...
git remote remove origin 2>nul
git remote add origin https://github.com/alawa95/expiryguard.git

echo.
echo Push vers GitHub...
git push -u origin main

echo.
echo ================================================
if %ERRORLEVEL% == 0 (
    echo   Succes ! Code pousse sur GitHub.
    echo   https://github.com/alawa95/expiryguard
) else (
    echo   Erreur. GitHub va peut-etre demander
    echo   ton mot de passe ou un token.
)
echo ================================================
pause
