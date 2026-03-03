# ============================================
# GAMEMASTER - BACKUP E RESTORE SYSTEM
# ============================================
# Script para fazer backup e restaurar arquivos
# Uso: .\backup-restore.ps1 -action backup
#      .\backup-restore.ps1 -action restore -version "20260303-120000"

param(
    [string]$action = "help",
    [string]$version = ""
)

$projectPath = "D:\Users\Usuario\Desktop\gamemaster-production"
$backupPath = "$projectPath\.backups"
$timestamp = Get-Date -Format "yyyyMMdd-HHmmss"

# ============================================
# FUNÇÃO: CRIAR BACKUP
# ============================================
function Create-Backup {
    Write-Host "🔄 Criando backup..." -ForegroundColor Cyan
    
    # Criar pasta de backup se não existir
    if (!(Test-Path $backupPath)) {
        New-Item -ItemType Directory -Path $backupPath | Out-Null
        Write-Host "✅ Pasta de backup criada: $backupPath" -ForegroundColor Green
    }
    
    # Criar pasta com timestamp
    $backupFolder = "$backupPath\backup-$timestamp"
    New-Item -ItemType Directory -Path $backupFolder | Out-Null
    
    # Arquivos importantes para backup
    $filesToBackup = @(
        "index.html",
        "server\database.js",
        "server\scrapers.js",
        "server\package.json"
    )
    
    # Copiar arquivos
    foreach ($file in $filesToBackup) {
        $sourcePath = "$projectPath\$file"
        if (Test-Path $sourcePath) {
            $fileName = Split-Path $file -Leaf
            $destPath = "$backupFolder\$fileName"
            Copy-Item -Path $sourcePath -Destination $destPath -Force
            Write-Host "✅ Backup: $file" -ForegroundColor Green
        }
    }
    
    # Criar arquivo de metadados
    $metadata = @{
        timestamp = $timestamp
        date = Get-Date -Format "dd/MM/yyyy HH:mm:ss"
        files = $filesToBackup
        description = "Backup automático"
    } | ConvertTo-Json
    
    $metadata | Out-File -FilePath "$backupFolder\metadata.json" -Encoding UTF8
    
    Write-Host "`n✅ Backup criado com sucesso!" -ForegroundColor Green
    Write-Host "📁 Localização: $backupFolder" -ForegroundColor Yellow
    Write-Host "🔖 ID do Backup: backup-$timestamp" -ForegroundColor Yellow
}

# ============================================
# FUNÇÃO: LISTAR BACKUPS
# ============================================
function List-Backups {
    Write-Host "`n📋 BACKUPS DISPONÍVEIS:" -ForegroundColor Cyan
    Write-Host "================================" -ForegroundColor Cyan
    
    if (!(Test-Path $backupPath)) {
        Write-Host "❌ Nenhum backup encontrado" -ForegroundColor Red
        return
    }
    
    $backups = Get-ChildItem -Path $backupPath -Directory | Sort-Object -Property CreationTime -Descending
    
    if ($backups.Count -eq 0) {
        Write-Host "❌ Nenhum backup encontrado" -ForegroundColor Red
        return
    }
    
    $index = 1
    foreach ($backup in $backups) {
        $metadataPath = "$($backup.FullName)\metadata.json"
        if (Test-Path $metadataPath) {
            $metadata = Get-Content $metadataPath | ConvertFrom-Json
            Write-Host "$index. $($backup.Name)" -ForegroundColor Green
            Write-Host "   📅 Data: $($metadata.date)" -ForegroundColor Yellow
            Write-Host "   📝 Descrição: $($metadata.description)" -ForegroundColor Yellow
        }
        $index++
    }
}

# ============================================
# FUNÇÃO: RESTAURAR BACKUP
# ============================================
function Restore-Backup {
    param([string]$backupVersion)
    
    if ([string]::IsNullOrEmpty($backupVersion)) {
        Write-Host "❌ Erro: Especifique a versão do backup" -ForegroundColor Red
        Write-Host "Uso: .\backup-restore.ps1 -action restore -version 'backup-20260303-120000'" -ForegroundColor Yellow
        return
    }
    
    $backupFolder = "$backupPath\$backupVersion"
    
    if (!(Test-Path $backupFolder)) {
        Write-Host "❌ Backup não encontrado: $backupVersion" -ForegroundColor Red
        return
    }
    
    Write-Host "🔄 Restaurando backup: $backupVersion" -ForegroundColor Cyan
    
    # Restaurar arquivos
    $files = Get-ChildItem -Path $backupFolder -File | Where-Object { $_.Name -ne "metadata.json" }
    
    foreach ($file in $files) {
        $destPath = "$projectPath\$($file.Name)"
        Copy-Item -Path $file.FullName -Destination $destPath -Force
        Write-Host "✅ Restaurado: $($file.Name)" -ForegroundColor Green
    }
    
    Write-Host "`n✅ Backup restaurado com sucesso!" -ForegroundColor Green
    Write-Host "⚠️  Faça um commit das mudanças:" -ForegroundColor Yellow
    Write-Host "   git add ." -ForegroundColor Cyan
    Write-Host "   git commit -m 'Restore from backup'" -ForegroundColor Cyan
    Write-Host "   git push origin main" -ForegroundColor Cyan
}

# ============================================
# FUNÇÃO: LIMPAR BACKUPS ANTIGOS
# ============================================
function Clean-OldBackups {
    param([int]$keepDays = 30)
    
    Write-Host "🧹 Limpando backups com mais de $keepDays dias..." -ForegroundColor Cyan
    
    if (!(Test-Path $backupPath)) {
        Write-Host "❌ Nenhum backup encontrado" -ForegroundColor Red
        return
    }
    
    $cutoffDate = (Get-Date).AddDays(-$keepDays)
    $backups = Get-ChildItem -Path $backupPath -Directory
    
    $deletedCount = 0
    foreach ($backup in $backups) {
        if ($backup.CreationTime -lt $cutoffDate) {
            Remove-Item -Path $backup.FullName -Recurse -Force
            Write-Host "🗑️  Deletado: $($backup.Name)" -ForegroundColor Yellow
            $deletedCount++
        }
    }
    
    Write-Host "`n✅ Limpeza concluída! $deletedCount backups removidos." -ForegroundColor Green
}

# ============================================
# FUNÇÃO: AJUDA
# ============================================
function Show-Help {
    Write-Host "`n" -ForegroundColor Cyan
    Write-Host "╔════════════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
    Write-Host "║         GAMEMASTER - BACKUP E RESTORE SYSTEM                   ║" -ForegroundColor Cyan
    Write-Host "╚════════════════════════════════════════════════════════════════╝" -ForegroundColor Cyan
    
    Write-Host "`n📖 COMANDOS DISPONÍVEIS:" -ForegroundColor Green
    Write-Host "`n1. CRIAR BACKUP:" -ForegroundColor Yellow
    Write-Host "   .\backup-restore.ps1 -action backup" -ForegroundColor Cyan
    Write-Host "   → Cria backup de todos os arquivos importantes" -ForegroundColor Gray
    
    Write-Host "`n2. LISTAR BACKUPS:" -ForegroundColor Yellow
    Write-Host "   .\backup-restore.ps1 -action list" -ForegroundColor Cyan
    Write-Host "   → Mostra todos os backups disponíveis" -ForegroundColor Gray
    
    Write-Host "`n3. RESTAURAR BACKUP:" -ForegroundColor Yellow
    Write-Host "   .\backup-restore.ps1 -action restore -version 'backup-20260303-120000'" -ForegroundColor Cyan
    Write-Host "   → Restaura um backup específico" -ForegroundColor Gray
    
    Write-Host "`n4. LIMPAR BACKUPS ANTIGOS:" -ForegroundColor Yellow
    Write-Host "   .\backup-restore.ps1 -action clean" -ForegroundColor Cyan
    Write-Host "   → Remove backups com mais de 30 dias" -ForegroundColor Gray
    
    Write-Host "`n5. AJUDA:" -ForegroundColor Yellow
    Write-Host "   .\backup-restore.ps1 -action help" -ForegroundColor Cyan
    Write-Host "   → Mostra esta mensagem" -ForegroundColor Gray
    
    Write-Host "`n📁 ARQUIVOS PROTEGIDOS:" -ForegroundColor Green
    Write-Host "   • index.html" -ForegroundColor Gray
    Write-Host "   • server/database.js" -ForegroundColor Gray
    Write-Host "   • server/scrapers.js" -ForegroundColor Gray
    Write-Host "   • server/package.json" -ForegroundColor Gray
    
    Write-Host "`n💾 LOCAL DOS BACKUPS:" -ForegroundColor Green
    Write-Host "   $backupPath" -ForegroundColor Cyan
    Write-Host "`n" -ForegroundColor Cyan
}

# ============================================
# EXECUTAR AÇÃO
# ============================================
switch ($action.ToLower()) {
    "backup" { Create-Backup }
    "list" { List-Backups }
    "restore" { Restore-Backup -backupVersion $version }
    "clean" { Clean-OldBackups }
    "help" { Show-Help }
    default { 
        Write-Host "❌ Ação desconhecida: $action" -ForegroundColor Red
        Show-Help
    }
}
