# 🛡️ Sambath Mongkol — Enterprise Portfolio & Zero-Trust Web Platform

> Modern personal portfolio, IT infrastructure showcase, full-stack web engineering & multi-layer Zero-Trust security platform.

---

## 👤 Profile
- **Name:** Sambath Mongkol (សម្បត្តិ មង្គល)
- **Title:** IT Support Specialist • Full-Stack Web Developer • Systems & Network Engineer
- **GitHub:** [@mongkolsingle10-max](https://github.com/mongkolsingle10-max)
- **Telegram:** [@sambathmongkol](https://t.me/sambathmongkol)
- **Email:** [sambathmongkol89@gmail.com](mailto:sambathmongkol89@gmail.com)
- **Phone:** 096 548 1889
- **Location:** Phnom Penh, Cambodia 🇰🇭

---

## ✨ Key Platform Features
1. **Zero-Trust Cyber Defense & Client-Side WAF (`security-shield.js`):**
   - **7 Active Defense Layers:** Strict Content-Security-Policy (CSP), Real-Time XSS/SQLi/LFI Payload WAF, DOM Integrity Mutation Sentinel (`MutationObserver`), Anti-Clickjacking Frame-Guard, Anti-Tabnabbing URI Firewall, Prototype Pollution Guard, and Action Rate-Limiting.
   - **Live Security Audit & Penetration Self-Test Console:** Click **"Shield: 100%"** in the top bar (or **"Inspect WAF & Run Self-Test"**) to inspect active defense layers, view the real-time security audit log, and run a live 4-vector attack simulation.
2. **Interactive SysAdmin & Security Terminal (`mongkol@enterprise-srv:~$`):**
   - Built-in interactive command-line shell with one-click command pills and keyboard commands: `help`, `whoami`, `skills`, `projects`, `network`, `security`, `waf-test`, `contact`, `cv`, and `clear`.
3. **Global Command Palette & Instant Search (`Ctrl + K`):**
   - Press `Ctrl + K` (or click **Search / Cmd** in the top bar) from any page to search projects, skills, work experience, or execute quick actions.
4. **Filterable Enterprise Projects & Architecture Showcase:**
   - Filterable case studies across **Windows Server & AD DS**, **QuickBooks Multi-User Server**, **MikroTik RouterOS & VLAN Firewall**, **Synology NAS 3-2-1 Disaster Recovery**, **n8n + OpenAI Automation**, and **Angular MVVM Web Apps**.
5. **One-Click Print / Save CV as PDF & WAF-Protected Quick Contact Composer:**
   - Instant PDF-ready resume formatting (`@media print`) and an Anti-Bot Honeypot + WAF-validated contact form supporting direct Email and Telegram dispatch.
6. **Advanced Bilingual Khmer ⇄ English Translation Engine (`i18n-translator.js`):**
   - Full-site lossless translation across all pages, dynamic modals, forms, Command Palette (`Ctrl+K`), and Interactive Terminal (`lang`, `lang km`, `lang en`).
   - Topbar segmented pill switcher (`EN | ខ្មែរ`), keyboard shortcut **`Alt + L`**, URL parameter support (`?lang=km` / `?lang=en`), `localStorage` persistence, and automatic **Kantumruy Pro / Noto Sans Khmer** typography optimization.

---

## 🔒 Server-Side Hardening (`serve.ps1`)
The local PowerShell HTTP server includes enterprise defense controls:
- **Canonical Path Traversal (LFI) Prevention** (`[System.IO.Path]::GetFullPath` boundary validation)
- **Built-in Web Application Firewall (WAF)** blocking SQLi, XSS, LFI, Command Injection, and vulnerability scanners (`sqlmap`, `nikto`, `nuclei`, `nmap`)
- **Per-IP Sliding Window Rate Limiting** (`429 Too Many Requests` anti-flood protection)
- **Strict HTTP Method Whitelisting** (`GET` and `HEAD` only; `405 Method Not Allowed` for others)
- **Hidden Dotfile Blocking** & **Real-Time Security Audit Logging** (`logs/security-audit.log`)
- **Enterprise HTTP Security Headers** (`Content-Security-Policy`, `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, `Referrer-Policy`, `Permissions-Policy`, `COOP`, `CORP`)

---

## 🚀 Live Preview & Running Locally

### Option 1: Hardened Zero-Trust PowerShell Server
```powershell
.\serve.ps1
```
Launches the WAF-protected server at `http://localhost:8080/` and writes security audit logs to `logs/security-audit.log`.

### Option 2: Direct Offline HTML
Open [`static_site/index.html`](static_site/index.html) directly in Chrome, Edge, or any modern browser.
