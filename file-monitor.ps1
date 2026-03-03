# ============================================
# GAMEMASTER - SMART FILE MONITOR
# ============================================
# Monitora arquivos importantes e pede backup antes de editar
# Uso: .\file-monitor.ps1

$projectPath = "D:\Users\Usuario\Desktop\gamemaster-production"
$backupPath = "$projectPath\.backups"
$logPath = "$projectPath\.file-monitor.log"

# Arquivos importantes para monitorar
$importantFiles = @(
    "$projectPath\index.html",
    "$projectPath\server\database.js",
    "$projectPath\server\scrapers.js",
    "$projectPath\server\package.json"
)

# ============================================
# FUNÇÃO: LOG
# ============================================
function Write-Log {
    param([string]$message)
    $timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    "$timestamp - $message" | Out-File -FilePath $logPath -Append -Encoding UTF8
}

# ============================================
# FUNÇÃO: CRIAR BACKUP
# ============================================
function Create-Backup {
    param([string]$fileName)
    
    $timestamp = Get-Date -Format "yyyyMMdd-HHmmss"
    
    if (!(Test-Path $backupPath)) {
        New-Item -ItemType Directory -Path $backupPath | Out-Null
    }
    
    $backupFolder = "$backupPath\backup-$timestamp"
    if (!(Test-Path $backupFolder)) {
        New-Item -ItemType Directory -Path $backupFolder | Out-Null
    }
    
    foreach ($file in $importantFiles) {
        if (Test-Path $file) {
            $baseName = Split-Path $file -Leaf
            $destPath = "$backupFolder\$baseName"
            Copy-Item -Path $file -Destination $destPath -Force
        }
    }
    
    Write-Log "✅ Backup criado: backup-$timestamp"
    return "backup-$timestamp"
}

# ============================================
# FUNÇÃO: PEDIR CONFIRMAÇÃO DE BACKUP
# ============================================
function Ask-BackupConfirmation {
    param([string]$fileName)
    
    Write-Host "`n" -ForegroundColor Cyan
    Write-Host "╔════════════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
    Write-Host "║                    ⚠️  AVISO DE EDIÇÃO                          ║" -ForegroundColor Cyan
    Write-Host "╚════════════════════════════════════════════════════════════════╝" -ForegroundColor Cyan
    
    Write-Host "`n📝 Arquivo a ser editado: $fileName" -ForegroundColor Yellow
    Write-Host "`n❓ Deseja fazer backup ANTES de editar?" -ForegroundColor Cyan
    Write-Host "`n   [S] Sim - Fazer backup agora" -ForegroundColor Green
    Write-Host "   [N] Não - Editar sem backup" -ForegroundColor Red
    Write-Host "   [C] Cancelar - Não editar" -ForegroundColor Yellow
    
    Write-Host "`nEscolha: " -ForegroundColor Cyan -NoNewline
    $choice = Read-Host
    
    return $choice.ToUpper()
}

# ============================================
# FUNÇÃO: MONITORAR ARQUIVO
# ============================================
function Monitor-File {
    param([string]$filePath)
    
    $fileName = Split-Path $filePath -Leaf
    $lastWriteTime = (Get-Item $filePath).LastWriteTime
    
    while ($true) {
        Start-Sleep -Seconds 2
        
        if (Test-Path $filePath) {
            $currentWriteTime = (Get-Item $filePath).LastWriteTime
            
            if ($currentWriteTime -gt $lastWriteTime) {
                Write-Log "⚠️  Arquivo modificado: $fileName"
                
                $choice = Ask-BackupConfirmation -fileName $fileName
                
                switch ($choice) {
                    "S" {
                        $backupId = Create-Backup -fileName $fileName
                        Write-Host "`n✅ Backup criado: $backupId" -ForegroundColor Green
                        Write-Host "📁 Localização: $backupPath\$backupId" -ForegroundColor Yellow
                        Write-Log "✅ Backup confirmado pelo usuário: $backupId"
                    }
                    "N" {
                        Write-Host "`n⚠️  Editando SEM backup!" -ForegroundColor Red
                        Write-Log "⚠️  Usuário escolheu editar sem backup"
                    }
                    "C" {
                        Write-Host "`n❌ Edição cancelada" -ForegroundColor Yellow
                        Write-Log "❌ Edição cancelada pelo usuário"
                    }
                }
                
                $lastWriteTime = $currentWriteTime
            }
        }
    }
}

# ============================================
# FUNÇÃO: INICIAR MONITOR
# ============================================
function Start-FileMonitor {
    Write-Host "`n" -ForegroundColor Cyan
    Write-Host "╔════════════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
    Write-Host "║       GAMEMASTER - SMART FILE MONITOR (ATIVO)                  ║" -ForegroundColor Cyan
    Write-Host "╚════════════════════════════════════════════════════════════════╝" -ForegroundColor Cyan
    
    Write-Host "`n📁 Monitorando arquivos:" -ForegroundColor Green
    foreach ($file in $importantFiles) {
        $baseName = Split-Path $file -Leaf
        Write-Host "   ✓ $baseName" -ForegroundColor Yellow
    }
    
    Write-Host "`n💾 Backups em: $backupPath" -ForegroundColor Green
    Write-Host "`n📝 Log em: $logPath" -ForegroundColor Green
    
    Write-Host "`n⏳ Aguardando mudanças..." -ForegroundColor Cyan
    Write-Host "   (Pressione Ctrl+C para parar o monitor)" -ForegroundColor Gray
    
    Write-Log "🟢 Monitor iniciado"
    
    # Monitorar todos os arquivos
    $jobs = @()
    foreach ($file in $importantFiles) {
        if (Test-Path $file) {
            $job = Start-Job -ScriptBlock {
                param($filePath, $backupPath, $importantFiles, $logPath)
                
                $fileName = Split-Path $filePath -Leaf
                $lastWriteTime = (Get-Item $filePath).LastWriteTime
                
                while ($true) {
                    Start-Sleep -Seconds 2
                    
                    if (Test-Path $filePath) {
                        $currentWriteTime = (Get-Item $filePath).LastWriteTime
                        
                        if ($currentWriteTime -gt $lastWriteTime) {
                            # Arquivo foi modificado
                            $timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
                            "$timestamp - ⚠️  Arquivo modificado: $fileName" | Out-File -FilePath $logPath -Append -Encoding UTF8
                            $lastWriteTime = $currentWriteTime
                        }
                    }
                }
            } -ArgumentList $file, $backupPath, $importantFiles, $logPath
            
            $jobs += $job
        }
    }
    
    # Manter o script rodando
    try {
        while ($true) {
            Start-Sleep -Seconds 1
        }
    }
    catch {
        Write-Host "`n❌ Monitor parado" -ForegroundColor Red
        Write-Log "🔴 Monitor parado"
    }
    finally {
        # Parar todos os jobs
        foreach ($job in $jobs) {
            Stop-Job -Job $job
            Remove-Job -Job $job
        }
    }
}

# ============================================
# FUNÇÃO: MENU PRINCIPAL
# ============================================
function Show-Menu {
    Write-Host "`n" -ForegroundColor Cyan
    Write-Host "╔════════════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
    Write-Host "║         GAMEMASTER - SMART FILE MONITOR                        ║" -ForegroundColor Cyan
    Write-Host "╚════════════════════════════════════════════════════════════════╝" -ForegroundColor Cyan
    
    Write-Host "`n📖 OPÇÕES:" -ForegroundColor Green
    Write-Host "`n1. Iniciar monitor (detecta mudanças em tempo real)" -ForegroundColor Yellow
    Write-Host "2. Ver log de atividades" -ForegroundColor Yellow
    Write-Host "3. Limpar log" -ForegroundColor Yellow
    Write-Host "4. Sair" -ForegroundColor Yellow
    
    Write-Host "`nEscolha: " -ForegroundColor Cyan -NoNewline
    $choice = Read-Host
    
    switch ($choice) {
        "1" { Start-FileMonitor }
        "2" { 
            if (Test-Path $logPath) {
                Write-Host "`n📝 LOG DE ATIVIDADES:" -ForegroundColor Green
                Get-Content $logPath | Tail -20
            } else {
                Write-Host "`n❌ Log não encontrado" -ForegroundColor Red
            }
            Show-Menu
        }
        "3" { 
            if (Test-Path $logPath) {
                Remove-Item $logPath -Force
                Write-Host "`n✅ Log limpo" -ForegroundColor Green
            }
            Show-Menu
        }
        "4" { 
            Write-Host "`n👋 Até logo!" -ForegroundColor Cyan
        }
        default { 
            Write-Host "`n❌ Opção inválida" -ForegroundColor Red
            Show-Menu
        }
    }
}

# ============================================
# EXECUTAR
# ============================================
Show-Menu
