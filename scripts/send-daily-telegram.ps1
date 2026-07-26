param(
    [string]$ProjectRoot = (Split-Path -Parent $PSScriptRoot),
    [string]$Endpoint = ""
)

$ErrorActionPreference = "Stop"
$secretPath = Join-Path $ProjectRoot ".local-secrets\daily-trigger.xml"

if ([string]::IsNullOrWhiteSpace($Endpoint)) {
    $publicAppUrl = [Environment]::GetEnvironmentVariable("PUBLIC_APP_URL")
    if ([string]::IsNullOrWhiteSpace($publicAppUrl)) {
        throw "Pass -Endpoint or set PUBLIC_APP_URL. The script no longer uses a stale deployment URL."
    }
    $Endpoint = "$($publicAppUrl.TrimEnd('/'))/api/telegram/daily"
}

if (-not $Endpoint.StartsWith('https://')) {
    throw "Endpoint must use HTTPS."
}

if (-not (Test-Path -LiteralPath $secretPath)) {
    throw "Daily trigger secret was not found. Run the one-time setup first."
}

$secureSecret = Import-Clixml -LiteralPath $secretPath
$secretPointer = [Runtime.InteropServices.Marshal]::SecureStringToBSTR($secureSecret)

try {
    $plainSecret = [Runtime.InteropServices.Marshal]::PtrToStringBSTR($secretPointer)
    $result = Invoke-RestMethod -Method Post -Uri $Endpoint -Headers @{
        Authorization = "Bearer $plainSecret"
    }

    $failedCount = @($result.errors).Count
    $runOk = $failedCount -eq 0

    [pscustomobject]@{
        ok = $runOk
        eligible = [int]$result.eligible
        sent = [int]$result.sent
        failed = $failedCount
        checked_at = (Get-Date).ToString("o")
    } | ConvertTo-Json -Compress

    if (-not $runOk) {
        exit 2
    }
}
finally {
    if ($secretPointer -ne [IntPtr]::Zero) {
        [Runtime.InteropServices.Marshal]::ZeroFreeBSTR($secretPointer)
    }
    $plainSecret = $null
}
