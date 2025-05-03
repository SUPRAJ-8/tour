Write-Host "Starting deployment process..." -ForegroundColor Green
$env:CI = "false"
Write-Host "Building React app with warnings allowed..." -ForegroundColor Yellow
npm run build
Write-Host "Deploying to GitHub Pages..." -ForegroundColor Yellow
npx gh-pages -d build
Write-Host "Deployment complete!" -ForegroundColor Green
