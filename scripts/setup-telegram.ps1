[CmdletBinding()]
param(
    [Parameter(Mandatory = $true)][string]$BotToken,
    [Parameter(Mandatory = $true)][string]$PublicUrl,
    [Parameter(Mandatory = $true)][string]$WebhookSecret
)

$base = "https://api.telegram.org/bot$BotToken"
$site = $PublicUrl.TrimEnd('/')
$commands = @(
    @{ command = 'start'; description = 'Открыть платформу' },
    @{ command = 'today'; description = 'Задание на сегодня' },
    @{ command = 'remind_on'; description = 'Включить ежедневные задания' },
    @{ command = 'remind_off'; description = 'Выключить напоминания' },
    @{ command = 'help'; description = 'Помощь' },
    @{ command = 'terms'; description = 'Условия' },
    @{ command = 'support'; description = 'Поддержка' }
)

$webhookBody = @{ url = "$site/api/telegram/webhook"; secret_token = $WebhookSecret; allowed_updates = @('message', 'callback_query') } | ConvertTo-Json -Depth 5
$commandsBody = @{ commands = $commands } | ConvertTo-Json -Depth 5
$menuBody = @{ menu_button = @{ type = 'web_app'; text = 'Открыть Слово'; web_app = @{ url = "$site/telegram" } } } | ConvertTo-Json -Depth 5

$webhook = Invoke-RestMethod -Method Post -Uri "$base/setWebhook" -ContentType 'application/json' -Body $webhookBody
$commandResult = Invoke-RestMethod -Method Post -Uri "$base/setMyCommands" -ContentType 'application/json' -Body $commandsBody
$menu = Invoke-RestMethod -Method Post -Uri "$base/setChatMenuButton" -ContentType 'application/json' -Body $menuBody

[ordered]@{
    webhook = $webhook.ok
    commands = $commandResult.ok
    menu_button = $menu.ok
    mini_app_url = "$site/telegram"
} | ConvertTo-Json
