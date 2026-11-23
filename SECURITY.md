# Security Policy & Zero-Trust Architecture

## 🛡️ Active Security Layers

This portfolio and web project by **Sambath Mongkol** enforces a multi-layered defense-in-depth security architecture:

1. **Client-Side Active Security Shield (`security-shield.js`)**
   - **Content Security Policy (CSP):** Restricts script, style, font, frame, and connection origins to trusted endpoints only.
   - **DOM XSS & Query/Hash WAF Engine:** Inspects and neutralizes malicious URL parameters, reflected XSS vectors, SQLi probes, and prototype pollution payloads (`__proto__`, `constructor`, `prototype`) in real time.
   - **Anti-Clickjacking / Frame Guard:** Prevents unauthorized `<iframe>` embedding (`frame-ancestors 'none'` + JavaScript frame-busting guard).
   - **DOM Integrity & Tamper Monitor (`MutationObserver`):** Automatically detects and strips unauthorized injected third-party scripts or frames.
   - **Anti-Tabnabbing Enforcement:** Automatically enforces `rel="noopener noreferrer"` on all external links and neutralizes `javascript:` / `vbscript:` / `data:text/html` URIs.
   - **Self-XSS Console Deterrent:** Displays a security warning in browser developer tools against social-engineering attacks.

2. **Hardened Local Web Server & WAF (`serve.ps1`)**
   - **Canonical Path Traversal Prevention:** Resolves canonical filesystem paths (`[System.IO.Path]::GetFullPath`) and enforces strict root containment.
   - **Web Application Firewall (WAF):** Blocks SQL injection, XSS, command injection, path traversal, and automated vulnerability scanners (`sqlmap`, `nikto`, `nuclei`, `nmap`, etc.) with real-time security audit logging (`logs/security-audit.log`).
   - **Per-IP Sliding Window Rate Limiting:** Protects against brute-force and DoS floods (`429 Too Many Requests`).
   - **Strict HTTP Method Whitelisting & Dotfile Protection:** Permits only `GET` and `HEAD`; blocks `.git`, `.env`, and configuration files.
   - **Enterprise Security Headers:** `Content-Security-Policy`, `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, `Referrer-Policy`, `Permissions-Policy`, `Cross-Origin-Opener-Policy`, and `Cross-Origin-Resource-Policy`.

3. **Build & CI/CD Hardening**
   - **Safe Subprocess Execution (`_plugins/posts-lastmod-hook.rb`):** Uses `Open3.capture2` argument arrays without shell interpolation to prevent OS command injection.
   - **Least-Privilege GitHub Actions Workflow (`.github/workflows/pages-deploy.yml`):** Scoped read/write permissions and automated verification.

---

## 📬 Reporting a Vulnerability

If you discover a security vulnerability, please report it responsibly:

- **Contact:** Sambath Mongkol
- **Email:** [sambathmongkol89@gmail.com](mailto:sambathmongkol89@gmail.com)
- **Telegram:** [@sambathmongkol](https://t.me/sambathmongkol)
- **Security Metadata:** [`/.well-known/security.txt`](static_site/.well-known/security.txt)
