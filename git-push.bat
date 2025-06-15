@echo off
setlocal enabledelayedexpansion

REM ─── Resolve Commit Message ─────────────────────────────────────────────
if "%~1"=="" (
  echo Enter your commit message:
  set /p commit_message=Commit Message: 
) else (
  set commit_message=%*
)

REM ─── Use Default Message if None Provided ─────────────────────────────────
if "!commit_message!"=="" (
  set commit_message=Auto-commit on %date% at %time%
  echo No commit message provided. Using default: "!commit_message!"
)

REM ─── Stage All Changes ────────────────────────────────────────────────────
echo.
echo Running: git add -A
git add -A
if errorlevel 1 (
  echo Error occurred while staging files. Aborting.
  goto :eof
)

REM ─── Commit Changes ────────────────────────────────────────────────────────
echo.
echo Running: git commit -m "!commit_message!"
git commit -m "!commit_message!"
if errorlevel 1 (
  echo No changes to commit or commit failed. Skipping push.
  goto :eof
)

REM ─── Push Changes to Remote ────────────────────────────────────────────────
echo.
echo Running: git push
git push
if errorlevel 1 (
  echo Push failed. Please check your network or authentication settings.
  goto :eof
)

REM ─── Operation Successful ─────────────────────────────────────────────────
echo.
echo All changes have been successfully pushed to GitHub!
pause
exit /b 0
