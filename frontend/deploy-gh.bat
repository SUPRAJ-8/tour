@echo off
echo Starting GitHub Pages deployment...

echo Building React app (ignoring warnings)...
call npm run build -- --no-lint

echo Deploying to GitHub Pages...
call npx gh-pages -d build

echo Deployment complete!
echo Your site will be available at https://SUPRAJ-8.github.io/toor/
