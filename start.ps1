# End-to-End AgriFusion AI Startup Script
param (
    [switch]$Dev,
    [switch]$NoBrowser,
    [int]$Port = 8000
)

$scriptRoot = if ($PSScriptRoot) { $PSScriptRoot } else { (Get-Location).Path }
Set-Location -Path $scriptRoot

# Ensure port is free to prevent WinError 10048
$occupiedProcess = Get-NetTCPConnection -LocalPort $Port -ErrorAction SilentlyContinue | Select-Object -ExpandProperty OwningProcess -Unique
if ($occupiedProcess) {
    foreach ($pidToKill in $occupiedProcess) {
        if ($pidToKill -gt 0 -and $pidToKill -ne $PID) {
            Write-Host "Releasing port $Port held by process PID $pidToKill..." -ForegroundColor Yellow
            Stop-Process -Id $pidToKill -Force -ErrorAction SilentlyContinue
        }
    }
    Start-Sleep -Milliseconds 500
}

$argsList = @("app.py", "--port", "$Port")
if ($Dev) { $argsList += "--dev" }
if ($NoBrowser) { $argsList += "--no-browser" }

python @argsList
