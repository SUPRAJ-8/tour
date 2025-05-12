@echo off
echo Starting manual GitHub Pages deployment...

echo Building React app (ignoring all warnings)...
set CI=false
call react-scripts build

echo Deploying to GitHub Pages...
call npx gh-pages -d build

echo Deployment complete!
echo Your site will be available at https://SUPRAJ-8.github.io/toor/
