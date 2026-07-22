[CmdletBinding()]
param(
    [string]$Source = 'C:\!_1_WB\Скилы учитель\knowledge-base',
    [string]$Destination = (Join-Path $PSScriptRoot '..\knowledge-base')
)

$sourceResolved = (Resolve-Path -LiteralPath $Source).Path
$destinationResolved = (Resolve-Path -LiteralPath $Destination).Path

if (-not $sourceResolved.StartsWith('C:\!_1_WB\Скилы учитель\knowledge-base')) {
    throw 'Source must stay inside the teacher knowledge-base folder.'
}

Get-ChildItem -LiteralPath $sourceResolved -Force | ForEach-Object {
    Copy-Item -LiteralPath $_.FullName -Destination $destinationResolved -Recurse -Force
}

[ordered]@{
    source = $sourceResolved
    destination = $destinationResolved
    synced_at = (Get-Date).ToString('o')
} | ConvertTo-Json
