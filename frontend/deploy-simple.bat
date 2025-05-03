@echo off
echo Starting simple GitHub Pages deployment...

echo Deploying directly to GitHub Pages...
npx gh-pages -d build -b gh-pages -m "Deploy React app to GitHub Pages"

echo Deployment complete!
echo Your site will be available at https://SUPRAJ-8.github.io/toor/
