# Launch Spring Boot Backend
$env:JAVA_HOME = "C:\Users\nares\.jdks\openjdk-26.0.1"
$env:Path = "C:\Users\nares\.tools\apache-maven-3.9.9\bin;" + "C:\Users\nares\.jdks\openjdk-26.0.1\bin;" + $env:Path

Set-Location "$PSScriptRoot\ai-customer-support-agent\backend"
Write-Host "Starting AI Customer Support Backend on http://localhost:8080..." -ForegroundColor Cyan
mvn spring-boot:run
