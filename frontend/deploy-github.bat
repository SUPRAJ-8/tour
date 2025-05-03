@echo off
echo Starting GitHub Pages deployment...

echo Building React app (ignoring warnings)...
set "CI=false" && npm run build

echo Deploying to GitHub Pages...
npx gh-pages -d build

echo Deployment complete!
echo Your site will be available at https://SUPRAJ-8.github.io/toor/
