@echo off
setlocal enabledelayedexpansion

REM ─── Remove large archive files (.zip, .rar, .7z) from tracking ───────────
echo.
echo Ensuring large archive files are not committed ...
findstr /x /c:"*.zip" .gitignore >nul 2>&1 || echo *.zip>>.gitignore
findstr /x /c:"*.rar" .gitignore >nul 2>&1 || echo *.rar>>.gitignore
findstr /x /c:"*.7z" .gitignore >nul 2>&1 || echo *.7z>>.gitignore

REM Remove any already-tracked archives
git rm --cached -r --ignore-unmatch *.zip
git rm --cached -r --ignore-unmatch *.rar
git rm --cached -r --ignore-unmatch *.7z

REM ─── Stage All Changes ────────────────────────────────────────────────────
echo.
echo Running: git add -A
git add -A
if errorlevel 1 (
  echo Error occurred while staging files. Aborting.
  goto :eof
)

REM ─── Commit Changes ────────────────────────────────────────────────────────
REM NOTE: when a message is passed as an argument, it is used as-is (%*)
REM rather than captured into a variable and re-quoted - re-quoting an
REM already-quoted argument corrupts it (e.g. breaks on "&").
if "%~1"=="" (
  echo Enter your commit message:
  set /p commit_message=Commit Message:
  if "!commit_message!"=="" (
    set commit_message=Auto-commit on %date% at %time%
    echo No commit message provided. Using default: "!commit_message!"
  )
  echo.
  echo Running: git commit -m "!commit_message!"
  git commit -m "!commit_message!"
) else (
  echo.
  echo Running: git commit -m %*
  git commit -m %*
)
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
