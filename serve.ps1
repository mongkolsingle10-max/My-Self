<#
.SYNOPSIS
    Sambath Mongkol Portfolio - Hardened Local Web Server with Built-in WAF & Zero-Trust Controls
.DESCRIPTION
    Serves static_site locally with:
    - Canonical Path Traversal (LFI) Prevention
    - Built-in Web Application Firewall (WAF) blocking SQLi, XSS, Command Injection & Scanner Bots
    - Per-IP Sliding Window Rate Limiting (Anti-DDoS / Brute-Force)
    - Strict HTTP Method Whitelisting (GET, HEAD only)
    - Hidden / Sensitive Dotfile Blocking
    - Enterprise HTTP Security Headers (CSP, X-Frame-Options, nosniff, COOP, CORP, Permissions-Policy)
#>

param(
    [int]$Port = 8080,
    [switch]$NoBrowser
)

$ErrorActionPreference = "Stop"
$root = [System.IO.Path]::GetFullPath((Join-Path $PSScriptRoot "static_site"))
$logDir = Join-Path $PSScriptRoot "logs"
$auditLog = Join-Path $logDir "security-audit.log"

if (-not (Test-Path $root -PathType Container)) {
    Write-Error "Folder 'static_site' not found at $root"
    exit 1
}

if (-not (Test-Path $logDir -PathType Container)) {
    New-Item -ItemType Directory -Path $logDir -Force | Out-Null
}

function Write-SecurityAudit {
    param(
        [string]$Level,
        [string]$ClientIP,
        [string]$Method,
        [string]$RawUrl,
        [string]$Reason
    )
    $timestamp = (Get-Date).ToString("yyyy-MM-dd HH:mm:ss.fff")
    $entry = "[$timestamp] [$Level] IP=$ClientIP METHOD=$Method URL=""$RawUrl"" REASON=""$Reason"""
    Add-Content -Path $auditLog -Value $entry -Encoding UTF8
    $color = switch ($Level) {
        "BLOCKED" { "Red" }
        "RATELIMIT" { "Yellow" }
        "WARN" { "Magenta" }
        default { "Gray" }
    }
    Write-Host " $entry" -ForegroundColor $color
}

$listener = New-Object System.Net.HttpListener
$url = "http://localhost:$Port/"
$listener.Prefixes.Add($url)

try {
    $listener.Start()
} catch {
    Write-Host "Port $Port is in use, switching to 8081..." -ForegroundColor Yellow
    $Port = 8081
    $url = "http://localhost:$Port/"
    $listener = New-Object System.Net.HttpListener
    $listener.Prefixes.Add($url)
    $listener.Start()
}

Write-Host "==============================================================" -ForegroundColor Green
Write-Host "  SAMBATH MONGKOL - HARDENED ZERO-TRUST WEB SERVER (WAF ON)" -ForegroundColor Cyan
Write-Host "  Serving URL : $url" -ForegroundColor White
Write-Host "  Root Folder : $root" -ForegroundColor Gray
Write-Host "  Audit Log   : $auditLog" -ForegroundColor Gray
Write-Host "  Defenses    : Anti-LFI | WAF (XSS/SQLi) | Rate-Limit | CSP" -ForegroundColor Green
Write-Host "  Press Ctrl+C in terminal to stop server." -ForegroundColor Yellow
Write-Host "==============================================================" -ForegroundColor Green

if (-not $NoBrowser) {
    Start-Process $url
}

$mimeMap = @{
    ".html"        = "text/html; charset=utf-8"
    ".htm"         = "text/html; charset=utf-8"
    ".css"         = "text/css; charset=utf-8"
    ".js"          = "application/javascript; charset=utf-8"
    ".json"        = "application/json; charset=utf-8"
    ".png"         = "image/png"
    ".jpg"         = "image/jpeg"
    ".jpeg"        = "image/jpeg"
    ".webp"        = "image/webp"
    ".gif"         = "image/gif"
    ".svg"         = "image/svg+xml"
    ".ico"         = "image/x-icon"
    ".xml"         = "application/xml; charset=utf-8"
    ".txt"         = "text/plain; charset=utf-8"
    ".webmanifest" = "application/manifest+json; charset=utf-8"
    ".woff"        = "font/woff"
    ".woff2"       = "font/woff2"
}

# Sliding window Rate Limiter state: IP -> List of timestamps
$rateLimitTracker = @{}
$rateLimitWindowSeconds = 10
$rateLimitMaxRequests = 120

# WAF Threat Signatures (SQLi, XSS, LFI, RCE, Malicious Scanners)
$wafUrlPatterns = @(
    '(?i)(<script|javascript:|vbscript:|data:text/html|onerror\s*=|onload\s*=|onclick\s*=|onmouseover\s*=|eval\s*\(|document\.cookie|alert\s*\()',
    '(?i)(union\s+all\s+select|union\s+select|information_schema|sleep\s*\(|benchmark\s*\(|waitfor\s+delay|or\s+1\s*=\s*1|and\s+1\s*=\s*1|drop\s+table|insert\s+into)',
    '(?i)(\.\./|\.\.\\|%2e%2e|%252e|/etc/passwd|/etc/shadow|win\.ini|boot\.ini|cmd\.exe|powershell\.exe|/bin/sh|/bin/bash)',
    '(?i)(__proto__|constructor\[|prototype\[)',
    '(?i)(\.(env|git|svn|htaccess|htpasswd|DS_Store|ps1|rb|yml|yaml|lock|bak|sql|config)$)'
)
$wafScannerAgents = '(?i)(sqlmap|nikto|nmap|masscan|dirbuster|gobuster|ffuf|wfuzz|nuclei|acunetix|nessus|openvas|havij|zmeu)'

function Add-SecurityHeaders {
    param($Response)
    $Response.Headers["X-Content-Type-Options"] = "nosniff"
    $Response.Headers["X-Frame-Options"] = "DENY"
    $Response.Headers["X-XSS-Protection"] = "1; mode=block"
    $Response.Headers["Referrer-Policy"] = "strict-origin-when-cross-origin"
    $Response.Headers["Permissions-Policy"] = "camera=(), microphone=(), geolocation=(), payment=(), usb=(), magnetometer=(), gyroscope=()"
    $Response.Headers["Cross-Origin-Opener-Policy"] = "same-origin"
    $Response.Headers["Cross-Origin-Resource-Policy"] = "same-origin"
    $Response.Headers["X-Permitted-Cross-Domain-Policies"] = "none"
    $Response.Headers["X-Security-Shield"] = "Mongkol-ZeroTrust-WAF/2.0"
    $Response.Headers["Content-Security-Policy"] = "default-src 'self'; script-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://cdn.jsdelivr.net; font-src 'self' data: https://fonts.gstatic.com https://cdn.jsdelivr.net; img-src 'self' data: https:; connect-src 'self'; object-src 'none'; base-uri 'self'; form-action 'self' mailto:; frame-ancestors 'none';"
}

while ($listener.IsListening) {
    try {
        $context = $listener.GetContext()
        $request = $context.Request
        $response = $context.Response

        Add-SecurityHeaders -Response $response

        $clientIP = if ($request.RemoteEndPoint) { $request.RemoteEndPoint.Address.ToString() } else { "unknown" }
        $method = $request.HttpMethod.ToUpperInvariant()
        $rawUrl = [System.Uri]::UnescapeDataString($request.RawUrl)
        $userAgent = if ($request.UserAgent) { $request.UserAgent } else { "" }

        # 1. Per-IP Rate Limiting check
        $now = [DateTime]::UtcNow
        if (-not $rateLimitTracker.ContainsKey($clientIP)) {
            $rateLimitTracker[$clientIP] = New-Object System.Collections.Generic.List[DateTime]
        }
        $timestamps = $rateLimitTracker[$clientIP]
        $cutoff = $now.AddSeconds(-$rateLimitWindowSeconds)
        for ($i = $timestamps.Count - 1; $i -ge 0; $i--) {
            if ($timestamps[$i] -lt $cutoff) {
                $timestamps.RemoveAt($i)
            }
        }
        $timestamps.Add($now)

        if ($timestamps.Count -gt $rateLimitMaxRequests) {
            Write-SecurityAudit -Level "RATELIMIT" -ClientIP $clientIP -Method $method -RawUrl $request.RawUrl -Reason "Rate limit exceeded ($($timestamps.Count) req / ${rateLimitWindowSeconds}s)"
            $response.StatusCode = 429
            $response.ContentType = "text/plain; charset=utf-8"
            $msg = [System.Text.Encoding]::UTF8.GetBytes("429 Too Many Requests - Rate Limit Exceeded by Mongkol Zero-Trust WAF")
            $response.ContentLength64 = $msg.Length
            $response.OutputStream.Write($msg, 0, $msg.Length)
            $response.Close()
            continue
        }

        # 2. Strict HTTP Method Whitelisting
        if ($method -ne "GET" -and $method -ne "HEAD") {
            Write-SecurityAudit -Level "BLOCKED" -ClientIP $clientIP -Method $method -RawUrl $request.RawUrl -Reason "Disallowed HTTP Method"
            $response.StatusCode = 405
            $response.Headers["Allow"] = "GET, HEAD"
            $msg = [System.Text.Encoding]::UTF8.GetBytes("405 Method Not Allowed")
            $response.ContentLength64 = $msg.Length
            $response.OutputStream.Write($msg, 0, $msg.Length)
            $response.Close()
            continue
        }

        # 3. WAF User-Agent Scanner Detection
        if ($userAgent -match $wafScannerAgents) {
            Write-SecurityAudit -Level "BLOCKED" -ClientIP $clientIP -Method $method -RawUrl $request.RawUrl -Reason "Malicious Scanner User-Agent ($userAgent)"
            $response.StatusCode = 403
            $msg = [System.Text.Encoding]::UTF8.GetBytes("403 Forbidden - Blocked by Mongkol Zero-Trust WAF")
            $response.ContentLength64 = $msg.Length
            $response.OutputStream.Write($msg, 0, $msg.Length)
            $response.Close()
            continue
        }

        # 4. WAF URL & Query Payload Inspection
        $blockedByWaf = $false
        foreach ($pattern in $wafUrlPatterns) {
            if ($rawUrl -match $pattern -or $request.RawUrl -match $pattern) {
                Write-SecurityAudit -Level "BLOCKED" -ClientIP $clientIP -Method $method -RawUrl $request.RawUrl -Reason "WAF Signature Match: $pattern"
                $blockedByWaf = $true
                break
            }
        }
        if ($blockedByWaf) {
            $response.StatusCode = 403
            $response.ContentType = "text/plain; charset=utf-8"
            $msg = [System.Text.Encoding]::UTF8.GetBytes("403 Forbidden - Malicious Payload Blocked by Mongkol Zero-Trust WAF")
            $response.ContentLength64 = $msg.Length
            $response.OutputStream.Write($msg, 0, $msg.Length)
            $response.Close()
            continue
        }

        # 5. Path Canonicalization & Directory Traversal Prevention
        $localPath = $request.Url.LocalPath.TrimStart('/')
        if ([string]::IsNullOrWhiteSpace($localPath)) {
            $localPath = "index.html"
        }

        # Block hidden files/folders except .well-known/security.txt
        $segments = $localPath -split '[/\\]'
        $hasForbiddenDotSegment = $false
        foreach ($seg in $segments) {
            if ($seg.StartsWith(".") -and $seg -ne ".well-known") {
                $hasForbiddenDotSegment = $true
                break
            }
        }
        if ($hasForbiddenDotSegment) {
            Write-SecurityAudit -Level "BLOCKED" -ClientIP $clientIP -Method $method -RawUrl $request.RawUrl -Reason "Attempted access to hidden dotfile/folder"
            $response.StatusCode = 403
            $msg = [System.Text.Encoding]::UTF8.GetBytes("403 Forbidden - Access Denied")
            $response.ContentLength64 = $msg.Length
            $response.OutputStream.Write($msg, 0, $msg.Length)
            $response.Close()
            continue
        }

        $candidatePath = [System.IO.Path]::GetFullPath((Join-Path $root $localPath))

        # Verify canonical path stays strictly inside $root
        if (-not $candidatePath.StartsWith($root, [System.StringComparison]::OrdinalIgnoreCase)) {
            Write-SecurityAudit -Level "BLOCKED" -ClientIP $clientIP -Method $method -RawUrl $request.RawUrl -Reason "Path Traversal Attempt Outside Root ($candidatePath)"
            $response.StatusCode = 403
            $msg = [System.Text.Encoding]::UTF8.GetBytes("403 Forbidden - Path Traversal Blocked")
            $response.ContentLength64 = $msg.Length
            $response.OutputStream.Write($msg, 0, $msg.Length)
            $response.Close()
            continue
        }

        if (Test-Path $candidatePath -PathType Container) {
            $candidatePath = Join-Path $candidatePath "index.html"
        }

        if (Test-Path $candidatePath -PathType Leaf) {
            $ext = [System.IO.Path]::GetExtension($candidatePath).ToLowerInvariant()
            $mime = if ($mimeMap.ContainsKey($ext)) { $mimeMap[$ext] } else { "application/octet-stream" }
            $response.ContentType = $mime
            $response.StatusCode = 200

            if ($ext -in @(".png", ".jpg", ".jpeg", ".webp", ".gif", ".svg", ".ico", ".woff", ".woff2")) {
                $response.Headers["Cache-Control"] = "public, max-age=86400"
            } else {
                $response.Headers["Cache-Control"] = "no-cache"
            }

            $bytes = [System.IO.File]::ReadAllBytes($candidatePath)
            $response.ContentLength64 = $bytes.Length
            if ($method -eq "GET") {
                $response.OutputStream.Write($bytes, 0, $bytes.Length)
            }
        } else {
            $response.StatusCode = 404
            $custom404 = Join-Path $root "404.html"
            if (Test-Path $custom404 -PathType Leaf) {
                $response.ContentType = "text/html; charset=utf-8"
                $bytes = [System.IO.File]::ReadAllBytes($custom404)
                $response.ContentLength64 = $bytes.Length
                if ($method -eq "GET") {
                    $response.OutputStream.Write($bytes, 0, $bytes.Length)
                }
            } else {
                $response.ContentType = "text/plain; charset=utf-8"
                $msg = [System.Text.Encoding]::UTF8.GetBytes("404 Not Found")
                $response.ContentLength64 = $msg.Length
                if ($method -eq "GET") {
                    $response.OutputStream.Write($msg, 0, $msg.Length)
                }
            }
        }
        $response.Close()
    } catch {
        # Graceful recovery on listener cycle abort
    }
}
