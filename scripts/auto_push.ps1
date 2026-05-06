# Auto Push Script for LeetCode Notes
# 在 22:00 和 00:00 自動偵測 repo 是否有更新，有才 push
# Windows 工作排程器設定說明見底部

$RepoPath = "C:\Users\f2289\Arc\AI_Code\leetcode-note"
$LogFile  = "$RepoPath\scripts\auto_push.log"
$Timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"

function Write-Log {
    param([string]$Message)
    $line = "[$Timestamp] $Message"
    Add-Content -Path $LogFile -Value $line -Encoding UTF8
    Write-Host $line
}

Set-Location $RepoPath

Write-Log "=== Auto Push Check ==="

# 1. 先重新生成 index.json
try {
    python generate_index.py 2>&1 | Out-Null
    Write-Log "generate_index.py executed"
} catch {
    Write-Log "WARNING: generate_index.py failed: $_"
}

# 2. 檢查是否有變更 (untracked + modified + deleted)
$status = git status --porcelain 2>&1
if ([string]::IsNullOrWhiteSpace($status)) {
    Write-Log "No changes detected. Skipping push."
    exit 0
}

Write-Log "Changes detected:"
$status | ForEach-Object { Write-Log "  $_" }

# 3. Commit & Push
$commitMsg = "Auto update: $(Get-Date -Format 'yyyy-MM-dd HH:mm')"
git add -A 2>&1 | Out-Null
git commit -m $commitMsg 2>&1 | ForEach-Object { Write-Log $_ }
$pushResult = git push 2>&1
$pushResult | ForEach-Object { Write-Log $_ }

if ($LASTEXITCODE -eq 0) {
    Write-Log "Push successful."
} else {
    Write-Log "ERROR: Push failed with exit code $LASTEXITCODE"
}

# ============================================================
# Windows 工作排程器設定方式 (以 admin 身份執行 PowerShell):
#
# $action = New-ScheduledTaskAction `
#     -Execute "powershell.exe" `
#     -Argument "-NonInteractive -WindowStyle Hidden -File `"C:\Users\f2289\Arc\AI_Code\leetcode-note\scripts\auto_push.ps1`""
#
# $trigger22 = New-ScheduledTaskTrigger -Daily -At "22:00"
# $trigger00 = New-ScheduledTaskTrigger -Daily -At "00:00"
#
# Register-ScheduledTask `
#     -TaskName "LeetCode-AutoPush-2200" `
#     -Action $action `
#     -Trigger $trigger22 `
#     -RunLevel Highest `
#     -Force
#
# Register-ScheduledTask `
#     -TaskName "LeetCode-AutoPush-0000" `
#     -Action $action `
#     -Trigger $trigger00 `
#     -RunLevel Highest `
#     -Force
# ============================================================
