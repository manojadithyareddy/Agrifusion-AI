# End-to-End AgriFusion AI Startup Script
param (
    [switch]$Dev,
    [switch]$NoBrowser,
    [int]$Port = 8000
)

$scriptRoot = if ($PSScriptRoot) { $PSScriptRoot } else { (Get-Location).Path }
Set-Location -Path $scriptRoot

$argsList = @("app.py", "--port", "$Port")
if ($Dev) { $argsList += "--dev" }
if ($NoBrowser) { $argsList += "--no-browser" }

python @argsList
