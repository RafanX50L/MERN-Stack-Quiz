Write-Host "🚀 Initializing Full Stack Project..." -ForegroundColor Green

# Backend setup
Write-Host "`n📦 Installing backend dependencies..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "cd './Backend'; npm install; npm run build" -Wait

# Frontend setup
Write-Host "`n📦 Installing frontend dependencies..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "cd './Frontend'; npm install" -Wait

Write-Host "`n✅ All dependencies installed successfully!" -ForegroundColor Green

# Optional: Start both servers
Write-Host "`n🌐 Starting backend and frontend..." -ForegroundColor Yellow
# Start Redis Server
Start-Process -NoNewWindow powershell -ArgumentList "-NoExit", "cd './Redis-Server'; ./redis-server.exe"
Start-Process powershell -ArgumentList "cd './Backend'; npm run dev"
Start-Process powershell -ArgumentList "cd './Frontend'; npm run dev"
