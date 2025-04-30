@echo off
echo Running git add .
git add .

echo.
echo Enter your commit message:
set /p commit_message=

echo.
echo Running git commit -m "%commit_message%"
git commit -m "%commit_message%"

echo.
echo Running git push
git push

echo.
echo All done!
pause
