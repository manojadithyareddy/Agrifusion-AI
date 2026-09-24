# End-to-End AgriFusion AI Startup Script
param (
    [switch]$FullInstall
)

$scriptRoot = if ($PSScriptRoot) { $PSScriptRoot } else { (Get-Location).Path }

Write-Host "=========================================" -ForegroundColor Green
Write-Host "  Starting AgriFusion AI Application     " -ForegroundColor Green
Write-Host "=========================================" -ForegroundColor Green

# 1. Setup Backend
Write-Host "`n[1/4] Preparing Backend Environment..." -ForegroundColor Cyan
Set-Location -Path "$scriptRoot\backend"

# Load backend/.env if present (without hardcoding any secrets)
if (Test-Path "$scriptRoot\backend\.env") {
    Get-Content "$scriptRoot\backend\.env" | ForEach-Object {
        $line = $_.Trim()
        if ($line -and -not $line.StartsWith("#") -and $line.Contains("=")) {
            $parts = $line.Split("=", 2)
            $varName = $parts[0].Trim()
            $varVal = $parts[1].Trim().Trim('"').Trim("'")
            if (-not [System.Environment]::GetEnvironmentVariable($varName)) {
                [System.Environment]::SetEnvironmentVariable($varName, $varVal)
            }
        }
    }
}

if (-not $env:DATABASE_URL) { $env:DATABASE_URL = "sqlite+aiosqlite:///./agri.db" }
if (-not $env:LLM_PROVIDER) { $env:LLM_PROVIDER = "gemini" }
if (-not $env:EMBEDDING_PROVIDER) { $env:EMBEDDING_PROVIDER = "local" }
$env:PYTHONPATH = "."

if ($FullInstall) {
    Write-Host "Installing Python dependencies (FullInstall specified)..." -ForegroundColor Yellow
    python -m pip install -r requirements.txt
}

# Run migrations to build the SQLite DB schema
Write-Host "Applying database migrations..."
python -m alembic upgrade head

# Launch Uvicorn in a new window
Write-Host "`n[2/4] Starting FastAPI Backend on port 8000..." -ForegroundColor Cyan
$backendCmd = "cd '$scriptRoot\backend'; `$env:PYTHONPATH='.'; python -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload"
Start-Process powershell -ArgumentList "-NoExit", "-Command", $backendCmd

# 2. Setup Frontend
Write-Host "`n[3/4] Preparing Frontend Environment..." -ForegroundColor Cyan
Set-Location -Path "$scriptRoot\frontend"

if ($FullInstall -or !(Test-Path "$scriptRoot\frontend\node_modules")) {
    Write-Host "Installing NPM dependencies..." -ForegroundColor Yellow
    npm install
} else {
    Write-Host "Frontend dependencies verified (node_modules present)." -ForegroundColor Green
}

# Launch Vite in a new window
Write-Host "`n[4/4] Starting Vite Frontend on port 5173..." -ForegroundColor Cyan
$frontendCmd = "cd '$scriptRoot\frontend'; npm run dev"
Start-Process powershell -ArgumentList "-NoExit", "-Command", $frontendCmd

Set-Location -Path "$scriptRoot"

Write-Host "`n=========================================" -ForegroundColor Green
Write-Host "  AgriFusion AI Launched Successfully!   " -ForegroundColor Green
Write-Host "=========================================" -ForegroundColor Green
Write-Host "  Frontend App:     http://localhost:5173" -ForegroundColor Cyan
Write-Host "  Backend API Docs: http://localhost:8000/docs" -ForegroundColor Cyan
Write-Host "  AI Assistant:     http://localhost:5173/assistant" -ForegroundColor Cyan
Write-Host "  Predictions:      http://localhost:5173/predictions" -ForegroundColor Cyan
Write-Host "=========================================" -ForegroundColor Green
Write-Host "Note: Two server windows (FastAPI & Vite) have been launched in the background." -ForegroundColor Yellow
