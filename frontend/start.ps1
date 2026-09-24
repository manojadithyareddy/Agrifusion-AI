# Forward to root start.ps1
$rootDir = (Get-Item $PSScriptRoot).Parent.FullName
& "$rootDir\start.ps1"
