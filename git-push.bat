@echo off
echo Running git add .
"C:\Program Files\Git\bin\git.exe" add .

echo.
echo Enter your commit message:
set /p commit_message=

echo.
echo Running git commit -m "%commit_message%"
"C:\Program Files\Git\bin\git.exe" commit -m "%commit_message%"

echo.
echo Running git push
"C:\Program Files\Git\bin\git.exe" push

echo.
echo All done!
pause
