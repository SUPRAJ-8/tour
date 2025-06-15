@echo off
setlocal enabledelayedexpansion

REM === Usage Instructions ==================================================
REM 1)  .\git-push.bat "your commit message"
REM 2)  .\git-push.bat                (will prompt for a commit message)
REM ==========================================================================

REM ─── Resolve Commit Message ────────────────────────────────────────────────
if "%~1"=="" (
  echo Enter commit message:
  set /p commit_message=Commit Message: 
  if "!commit_message!"=="" (
    echo No commit message provided. Using default: "Auto-commit"
    set commit_message=Auto-commit
  )
) else (
  set commit_message=%*
)

REM ─── Confirm Commit Message ────────────────────────────────────────────────
echo.
echo Commit message: "!commit_message!"
choice /m "Do you want to proceed with this message?" /c YN
if errorlevel 2 (
  echo Operation canceled by user.
  goto :eof
)

REM ─── Stage All Changes (Including Deletions) ───────────────────────────────
echo.
echo Running: git add -A
git add -A

REM ─── Check Git Add Result ──────────────────────────────────────────────────
if errorlevel 1 (
  echo Error occurred while staging files. Aborting.
  goto :eof
)

REM ─── Commit Changes ────────────────────────────────────────────────────────
echo.
echo Running: git commit -m "!commit_message!"
git commit -m "!commit_message!"
if errorlevel 1 (
  echo Commit failed. Check for errors (e.g., no changes staged). Aborting.
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
echo All done! Your changes have been successfully pushed.
pause
exit /b 0
