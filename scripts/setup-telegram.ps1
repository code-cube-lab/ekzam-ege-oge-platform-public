[CmdletBinding()]
param(
    [Parameter(Mandatory = $true)][string]$BotToken,
    [Parameter(Mandatory = $true)][string]$PublicUrl,
    [Parameter(Mandatory = $true)][string]$WebhookSecret
)

$base = "https://api.telegram.org/bot$BotToken"
$site = $PublicUrl.TrimEnd('/')
if (-not $site.StartsWith('https://')) {
    throw "PublicUrl must use HTTPS for Telegram Mini Apps."
}

# Keep the source ASCII-only so Windows PowerShell 5.1 reads it consistently.
# ConvertFrom-Json decodes these Unicode escapes into Russian text for Telegram.
$commands = @'
[
  {"command":"start","description":"\u041e\u0442\u043a\u0440\u044b\u0442\u044c \u043f\u043b\u0430\u0442\u0444\u043e\u0440\u043c\u0443"},
  {"command":"exam","description":"\u041e\u0442\u043a\u0440\u044b\u0442\u044c \u043f\u043e\u043b\u043d\u044b\u0439 \u041e\u0413\u042d \u0438\u043b\u0438 \u0415\u0413\u042d \u0432\u0430\u0440\u0438\u0430\u043d\u0442"},
  {"command":"practice","description":"\u041e\u0442\u0440\u0430\u0431\u043e\u0442\u043a\u0430 \u043e\u0434\u043d\u043e\u0433\u043e \u043d\u043e\u043c\u0435\u0440\u0430"},
  {"command":"resume","description":"\u041f\u0440\u043e\u0434\u043e\u043b\u0436\u0438\u0442\u044c \u0441\u043e\u0447\u0438\u043d\u0435\u043d\u0438\u0435"},
  {"command":"report","description":"\u041e\u0442\u0447\u0451\u0442 \u0440\u043e\u0434\u0438\u0442\u0435\u043b\u044e"},
  {"command":"today","description":"\u0417\u0430\u0434\u0430\u043d\u0438\u0435 \u043d\u0430 \u0441\u0435\u0433\u043e\u0434\u043d\u044f"},
  {"command":"mistakes","description":"\u0422\u0435\u043c\u044b \u0434\u043b\u044f \u043f\u043e\u0432\u0442\u043e\u0440\u0435\u043d\u0438\u044f"},
  {"command":"track","description":"\u0412\u044b\u0431\u0440\u0430\u0442\u044c \u044d\u043a\u0437\u0430\u043c\u0435\u043d \u0438 \u043f\u0440\u0435\u0434\u043c\u0435\u0442"},
  {"command":"buy","description":"\u041e\u0442\u043a\u0440\u044b\u0442\u044c \u043e\u043f\u043b\u0430\u0442\u0443 Stars"},
  {"command":"status","description":"\u041f\u0440\u043e\u0432\u0435\u0440\u0438\u0442\u044c \u0434\u043e\u0441\u0442\u0443\u043f"},
  {"command":"remind_on","description":"\u0412\u043a\u043b\u044e\u0447\u0438\u0442\u044c \u0435\u0436\u0435\u0434\u043d\u0435\u0432\u043d\u044b\u0435 \u0437\u0430\u0434\u0430\u043d\u0438\u044f"},
  {"command":"remind_off","description":"\u0412\u044b\u043a\u043b\u044e\u0447\u0438\u0442\u044c \u043d\u0430\u043f\u043e\u043c\u0438\u043d\u0430\u043d\u0438\u044f"},
  {"command":"delete_data","description":"\u0423\u0434\u0430\u043b\u0438\u0442\u044c \u043f\u0440\u043e\u0444\u0438\u043b\u044c \u0438 \u043f\u0440\u043e\u0433\u0440\u0435\u0441\u0441"},
  {"command":"help","description":"\u041f\u043e\u043c\u043e\u0449\u044c"},
  {"command":"terms","description":"\u0423\u0441\u043b\u043e\u0432\u0438\u044f"},
  {"command":"support","description":"\u041f\u043e\u0434\u0434\u0435\u0440\u0436\u043a\u0430"},
  {"command":"paysupport","description":"\u041f\u043e\u043c\u043e\u0449\u044c \u0441 \u043e\u043f\u043b\u0430\u0442\u043e\u0439"}
]
'@ | ConvertFrom-Json
$menuText = '"\u041e\u0442\u043a\u0440\u044b\u0442\u044c \u042d\u041a\u0417\u0410\u041c"' | ConvertFrom-Json

$webhookBody = @{
    url = "$site/api/telegram/webhook"
    secret_token = $WebhookSecret
    allowed_updates = @('message', 'callback_query', 'pre_checkout_query')
} | ConvertTo-Json -Depth 5
$commandsBody = @{ commands = @($commands) } | ConvertTo-Json -Depth 5
$menuBody = @{
    menu_button = @{
        type = 'web_app'
        text = $menuText
        web_app = @{ url = "$site/telegram" }
    }
} | ConvertTo-Json -Depth 5

$webhook = Invoke-RestMethod -Method Post -Uri "$base/setWebhook" -ContentType 'application/json; charset=utf-8' -Body ([Text.Encoding]::UTF8.GetBytes($webhookBody))
$commandResult = Invoke-RestMethod -Method Post -Uri "$base/setMyCommands" -ContentType 'application/json; charset=utf-8' -Body $commandsBody
$menu = Invoke-RestMethod -Method Post -Uri "$base/setChatMenuButton" -ContentType 'application/json; charset=utf-8' -Body ([Text.Encoding]::UTF8.GetBytes($menuBody))
$webhookInfo = Invoke-RestMethod -Method Get -Uri "$base/getWebhookInfo"

[ordered]@{
    webhook = $webhook.ok
    webhook_url = $webhookInfo.result.url
    pending_updates = $webhookInfo.result.pending_update_count
    commands = $commandResult.ok
    menu_button = $menu.ok
    mini_app_url = "$site/telegram"
} | ConvertTo-Json
