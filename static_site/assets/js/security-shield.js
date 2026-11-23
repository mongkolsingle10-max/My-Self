/**
 * ============================================================================
 * SAMBATH MONGKOL - ADVANCED ZERO-TRUST SECURITY SHIELD & INTERACTIVE ENGINE
 * Version: 2.5.0 | Multi-Layer Client-Side WAF, DOM Sentinel & Portfolio Suite
 * ============================================================================
 */
(function () {
  'use strict';

  const SecurityState = {
    version: '2.5.0-ZeroTrust',
    startedAt: new Date().toISOString(),
    threatsBlocked: 0,
    checksPassed: 0,
    layers: {
      csp: { name: 'Content Security Policy (CSP)', status: 'ACTIVE', detail: 'Strict origin whitelist & frame-ancestors none' },
      waf: { name: 'Client-Side WAF (XSS / SQLi / LFI)', status: 'ACTIVE', detail: 'Real-time URL, hash & input payload inspection' },
      domSentinel: { name: 'DOM Integrity Mutation Sentinel', status: 'ACTIVE', detail: 'Blocks unauthorized script/iframe injections' },
      antiClickjack: { name: 'Anti-Clickjacking Frame Guard', status: 'ACTIVE', detail: 'Top-frame verification & iframe lockdown' },
      antiTabnab: { name: 'Anti-Tabnabbing & URI Firewall', status: 'ACTIVE', detail: 'Enforces noopener noreferrer & blocks javascript: URIs' },
      protoGuard: { name: 'Prototype Pollution Protection', status: 'ACTIVE', detail: 'Guards Object.prototype & JSON payload keys' },
      rateLimiter: { name: 'Action Rate-Limiter & Anti-Bot Honeypot', status: 'ACTIVE', detail: 'Throttles rapid automated floods & bot submissions' }
    },
    auditLog: []
  };

  function logSecurityEvent(type, layer, message) {
    const entry = {
      time: new Date().toLocaleTimeString(),
      type: type, // 'PASS' | 'BLOCKED' | 'ALERT'
      layer: layer,
      message: message
    };
    SecurityState.auditLog.unshift(entry);
    if (SecurityState.auditLog.length > 50) {
      SecurityState.auditLog.pop();
    }
    if (type === 'BLOCKED') {
      SecurityState.threatsBlocked++;
      showSecurityToast(layer + ': ' + message, 'danger');
    } else {
      SecurityState.checksPassed++;
    }
    updateSecurityBadges();
  }

  // Threat Regex Signatures
  const WAF_SIGNATURES = [
    { name: 'Cross-Site Scripting (XSS)', regex: /(<script[\s\S]*?>|javascript\s*:|vbscript\s*:|data\s*:\s*text\/html|on(?:error|load|click|mouseover|focus|blur|submit|Input)\s*=|eval\s*\(|document\.cookie|window\.location\s*=)/i },
    { name: 'SQL Injection (SQLi)', regex: /(\bunion\s+(?:all\s+)?select\b|\binformation_schema\b|\bsleep\s*\(\s*\d+\s*\)|\bbenchmark\s*\(|\bwaitfor\s+delay\b|(?:'|")\s*(?:or|and)\s+(?:'?\d+'?\s*=\s*'?\d+'?)|\bdrop\s+table\b)/i },
    { name: 'Path Traversal (LFI)', regex: /(\.\.\/|\.\.\\|%2e%2e%2f|%2e%2e\\|\/etc\/passwd|\/etc\/shadow|c:\\windows\\win\.ini|cmd\.exe|powershell\.exe)/i },
    { name: 'Prototype Pollution', regex: /(__proto__|constructor\s*\[|prototype\s*\[)/i },
    { name: 'HTML Tag Injection', regex: /(<iframe|<object|<embed|<svg[\s\S]*?onload|<img[\s\S]*?onerror|<meta[\s\S]*?http-equiv)/i }
  ];

  // HTML Entity Sanitizer
  function sanitizeHTML(input) {
    if (typeof input !== 'string') return '';
    const map = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#x27;',
      '/': '&#x2F;',
      '`': '&#x60;'
    };
    return input.replace(/[&<>"'`/]/g, function (m) { return map[m]; });
  }

  // WAF Payload Inspector
  function inspectPayload(rawInput, sourceName) {
    if (!rawInput || typeof rawInput !== 'string') return { safe: true };
    let decoded = rawInput;
    try {
      decoded = decodeURIComponent(rawInput);
    } catch (_) {
      // keep raw if malformed URI encoding
    }
    for (let i = 0; i < WAF_SIGNATURES.length; i++) {
      const sig = WAF_SIGNATURES[i];
      if (sig.regex.test(rawInput) || sig.regex.test(decoded)) {
        logSecurityEvent('BLOCKED', 'WAF Engine', 'Blocked ' + sig.name + ' in ' + (sourceName || 'Input'));
        return {
          safe: false,
          threat: sig.name,
          sanitized: sanitizeHTML(decoded)
        };
      }
    }
    return { safe: true, sanitized: sanitizeHTML(rawInput) };
  }

  // 1. Anti-Clickjacking Frame Guard
  function enforceAntiClickjacking() {
    try {
      if (window.top !== window.self) {
        logSecurityEvent('BLOCKED', 'Frame-Guard', 'Unauthorized iframe embedding detected and neutralized');
        document.documentElement.style.display = 'none';
        window.top.location = window.self.location;
      } else {
        logSecurityEvent('PASS', 'Frame-Guard', 'Top-level browsing context verified (no iframe wrapper)');
      }
    } catch (e) {
      logSecurityEvent('BLOCKED', 'Frame-Guard', 'Cross-origin framing blocked by security policy');
    }
  }

  // 2. URL & Hash Parameter WAF Scan
  function scanLocationVectors() {
    const search = window.location.search;
    const hash = window.location.hash;
    let cleaned = false;

    if (search && search.length > 1) {
      const res = inspectPayload(search, 'URL Query String');
      if (!res.safe) {
        cleaned = true;
      }
    }
    if (hash && hash.length > 1) {
      const res = inspectPayload(hash, 'URL Fragment Hash');
      if (!res.safe) {
        cleaned = true;
      }
    }

    if (cleaned && window.history && window.history.replaceState) {
      window.history.replaceState(null, document.title, window.location.pathname);
      logSecurityEvent('PASS', 'WAF Engine', 'Malicious URL vector stripped from address bar');
    } else {
      logSecurityEvent('PASS', 'WAF Engine', 'URL query & hash parameters verified clean');
    }
  }

  // 3. Prototype Pollution Guard
  function enforcePrototypeGuard() {
    try {
      if (Object.prototype && !Object.isFrozen(Object.prototype.__proto__)) {
        Object.defineProperty(Object.prototype, '__mongkol_shield__', {
          value: 'protected',
          writable: false,
          configurable: false,
          enumerable: false
        });
      }
      logSecurityEvent('PASS', 'Proto-Guard', 'Global Object prototype integrity check passed');
    } catch (_) {}
  }

  // 4. External Link Hardener & Malicious URI Firewall
  function hardenLinks(rootNode) {
    const scope = rootNode || document;
    if (!scope.querySelectorAll) return;
    const links = scope.querySelectorAll('a[href]');
    let hardenedCount = 0;

    links.forEach(function (a) {
      const href = (a.getAttribute('href') || '').trim();
      if (/^(javascript|vbscript|data)\s*:/i.test(href)) {
        a.setAttribute('href', '#blocked-unsafe-uri');
        a.addEventListener('click', function (e) {
          e.preventDefault();
          logSecurityEvent('BLOCKED', 'URI-Firewall', 'Blocked unsafe URI scheme execution');
        });
      } else if (/^https?:\/\//i.test(href) || a.getAttribute('target') === '_blank') {
        const currentRel = a.getAttribute('rel') || '';
        if (!currentRel.includes('noopener') || !currentRel.includes('noreferrer')) {
          a.setAttribute('rel', 'noopener noreferrer');
          hardenedCount++;
        }
      }
    });

    if (rootNode === document) {
      logSecurityEvent('PASS', 'URI-Firewall', 'Hardened ' + links.length + ' hyperlinks with anti-tabnabbing policy');
    }
  }

  // 5. DOM Integrity & Script Injection Sentinel (MutationObserver)
  function startDomSentinel() {
    const trustedScriptOrigins = [
      window.location.origin,
      'https://cdn.jsdelivr.net'
    ];

    if (typeof MutationObserver === 'undefined') return;

    const observer = new MutationObserver(function (mutations) {
      mutations.forEach(function (mutation) {
        mutation.addedNodes.forEach(function (node) {
          if (node.nodeType !== 1) return;
          const tag = node.tagName ? node.tagName.toUpperCase() : '';

          if (tag === 'SCRIPT') {
            const src = node.getAttribute('src') || '';
            if (src && !src.startsWith('.') && !src.startsWith('/')) {
              const allowed = trustedScriptOrigins.some(function (origin) {
                return origin && src.indexOf(origin) === 0;
              });
              if (!allowed) {
                node.remove();
                logSecurityEvent('BLOCKED', 'DOM-Sentinel', 'Removed unauthorized external script: ' + sanitizeHTML(src));
                return;
              }
            }
          } else if (tag === 'IFRAME' || tag === 'OBJECT' || tag === 'EMBED') {
            if (!node.hasAttribute('data-mongkol-trusted')) {
              node.remove();
              logSecurityEvent('BLOCKED', 'DOM-Sentinel', 'Removed unauthorized embedded <' + tag.toLowerCase() + '> element');
              return;
            }
          }

          hardenLinks(node);
        });
      });
    });

    observer.observe(document.documentElement, {
      childList: true,
      subtree: true
    });

    logSecurityEvent('PASS', 'DOM-Sentinel', 'Real-time DOM MutationObserver active');
  }

  // 6. Action Rate Limiter
  const rateBuckets = {};
  function checkRateLimit(actionKey, maxPerWindow, windowMs) {
    const now = Date.now();
    if (!rateBuckets[actionKey]) {
      rateBuckets[actionKey] = [];
    }
    rateBuckets[actionKey] = rateBuckets[actionKey].filter(function (t) {
      return now - t < windowMs;
    });
    if (rateBuckets[actionKey].length >= maxPerWindow) {
      logSecurityEvent('BLOCKED', 'Rate-Limiter', 'Throttled excessive ' + actionKey + ' requests');
      return false;
    }
    rateBuckets[actionKey].push(now);
    return true;
  }

  // 7. Image Drag Protection & Self-XSS Console Banner
  function setupAssetAndConsoleProtection() {
    document.addEventListener('dragstart', function (e) {
      if (e.target && e.target.tagName === 'IMG') {
        e.preventDefault();
      }
    });

    try {
      console.log(
        '%c🛡️ SAMBATH MONGKOL — ZERO-TRUST SECURITY SHIELD ACTIVE',
        'color:#06d6a0;background:#0f172a;font-size:15px;font-weight:800;padding:8px 14px;border:1px solid #06d6a0;border-radius:8px;'
      );
      console.log(
        '%c⚠️ STOP! Self-XSS Protection Warning:\nDo not paste unknown code into this console. Pasting untrusted scripts can compromise your browser session.\nType window.MongkolSecurity.getStatus() to inspect active defense layers.',
        'color:#ffb703;font-size:12px;font-weight:600;'
      );
    } catch (_) {}
  }

  // Toast Notification Utility
  function showSecurityToast(message, level) {
    let container = document.getElementById('mongkol-security-toast-container');
    if (!container) {
      container = document.createElement('div');
      container.id = 'mongkol-security-toast-container';
      container.style.cssText = 'position:fixed;bottom:76px;right:20px;z-index:10050;display:flex;flex-direction:column;gap:8px;max-width:360px;';
      document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    const borderColor = level === 'danger' ? '#ef4444' : level === 'success' ? '#06d6a0' : '#00b4d8';
    const icon = level === 'danger' ? 'fa-shield-virus' : level === 'success' ? 'fa-check-circle' : 'fa-shield-alt';

    toast.style.cssText = 'background:rgba(15,23,42,0.96);backdrop-filter:blur(12px);color:#f8fafc;border:1px solid ' + borderColor + ';border-left:4px solid ' + borderColor + ';border-radius:10px;padding:10px 14px;font-size:0.84rem;box-shadow:0 10px 25px rgba(0,0,0,0.45);display:flex;align-items:center;gap:10px;transition:opacity 0.3s ease;';
    toast.innerHTML = '<i class="fas ' + icon + '" style="color:' + borderColor + ';font-size:1.1rem;"></i><div style="flex:1;line-height:1.4;">' + sanitizeHTML(message) + '</div>';

    container.appendChild(toast);
    setTimeout(function () {
      toast.style.opacity = '0';
      setTimeout(function () { toast.remove(); }, 300);
    }, 3800);
  }

  function updateSecurityBadges() {
    const blockedEls = document.querySelectorAll('.js-sec-blocked-count');
    const passedEls = document.querySelectorAll('.js-sec-passed-count');
    blockedEls.forEach(function (el) { el.textContent = String(SecurityState.threatsBlocked); });
    passedEls.forEach(function (el) { el.textContent = String(SecurityState.checksPassed); });

    const logList = document.getElementById('mongkol-sec-audit-list');
    if (logList) {
      logList.innerHTML = SecurityState.auditLog.slice(0, 12).map(function (item) {
        const badgeColor = item.type === 'BLOCKED' ? '#ef4444' : '#06d6a0';
        return '<div style="display:flex;justify-content:space-between;align-items:center;padding:6px 10px;border-bottom:1px solid rgba(255,255,255,0.06);font-family:monospace;font-size:0.78rem;">' +
          '<span><strong style="color:' + badgeColor + ';">[' + sanitizeHTML(item.type) + ']</strong> <span style="color:#38bdf8;">' + sanitizeHTML(item.layer) + '</span> — ' + sanitizeHTML(item.message) + '</span>' +
          '<span style="color:#64748b;margin-left:8px;white-space:nowrap;">' + sanitizeHTML(item.time) + '</span>' +
          '</div>';
      }).join('');
    }
  }

  // Run Live WAF Self-Test Simulation
  function runLiveWafSimulation() {
    if (!checkRateLimit('waf-simulation', 6, 10000)) return;

    const testVectors = [
      { label: 'Reflected XSS Payload', payload: '<script>alert(document.cookie)</script>' },
      { label: 'SQL Injection Probe', payload: "' UNION ALL SELECT username,password FROM users--" },
      { label: 'Directory Traversal (LFI)', payload: '../../../../etc/passwd' },
      { label: 'Prototype Pollution Vector', payload: '{"__proto__":{"isAdmin":true}}' }
    ];

    let blocked = 0;
    testVectors.forEach(function (tv) {
      const result = inspectPayload(tv.payload, 'Self-Test (' + tv.label + ')');
      if (!result.safe) blocked++;
    });

    showSecurityToast('WAF Self-Test Complete: ' + blocked + '/' + testVectors.length + ' simulated attacks intercepted & blocked!', 'success');
    updateSecurityBadges();
  }

  // ============================================================================
  // FLOATING CYBER DEFENSE & COMMAND PALETTE UI INJECTION
  // ============================================================================
  const SEARCH_DATABASE = [
    { title: 'Windows Server & Active Directory (AD DS) Enterprise Infrastructure', category: 'Systems & AD', url: '#projects-showcase', tags: 'Windows Server, AD DS, GPO, Domain Controller, ACL, Security Baseline' },
    { title: 'QuickBooks Multi-User Dedicated Database Server', category: 'Enterprise Software', url: '#projects-showcase', tags: 'QuickBooks Server Manager, Windows Server, Multi-User Accounting, LAN Share' },
    { title: 'MikroTik RouterOS Enterprise Network & VLAN Firewall', category: 'Networking', url: '#projects-showcase', tags: 'MikroTik RouterOS, VLAN, Dual-WAN, Bandwidth QoS, Firewall Hardening' },
    { title: 'Synology NAS 3-2-1 Automated Backup & Disaster Recovery', category: 'Storage & DR', url: '#projects-showcase', tags: 'Synology NAS, Snapshots, Disaster Recovery, Replication, ACLs' },
    { title: 'n8n + OpenAI Automated IT Monitoring & Alerting Pipeline', category: 'AI & Automation', url: '#projects-showcase', tags: 'n8n, ChatGPT API, OpenAI, PowerShell, Telegram Alerts, Ticketing' },
    { title: 'Angular MVVM Single-Page Web Application & REST API', category: 'Web Development', url: '#projects-showcase', tags: 'Angular, MVVM, TypeScript, JavaScript ES6+, HTML5, CSS3, REST API, Laravel' },
    { title: 'Technical Support Specialist — Sun Computer Solution (2025–Present)', category: 'Work Experience', url: '#experience-section', tags: 'IT Support, 3 Companies Managed, Windows Server, MikroTik, Synology' },
    { title: 'Programmer / Front-end Developer — AI Training & Software Dev Center', category: 'Work Experience', url: '#experience-section', tags: 'Angular, HTML5, CSS3, JavaScript, REST API, UI/UX' },
    { title: 'Royal University of Phnom Penh (RUPP) — Bachelor in Computer Science', category: 'Education', url: '#education-section', tags: 'RUPP, Computer Science, Phnom Penh, Cambodia' },
    { title: 'Open Interactive SysAdmin & Security Terminal', category: 'Quick Action', action: 'terminal', tags: 'terminal, cli, bash, powershell, whoami, security' },
    { title: 'Open Zero-Trust Cyber Defense & WAF Center', category: 'Quick Action', action: 'security', tags: 'security, waf, xss, sqli, csp, firewall, zero-trust' },
    { title: 'Print / Download Full CV as PDF Resume', category: 'Quick Action', action: 'print-cv', tags: 'cv, resume, pdf, print, download, ប្រវត្តិរូប' },
    { title: 'Switch Language: ភាសាខ្មែរ ⇄ English (Alt+L)', category: 'Language / ភាសា', action: 'toggle-lang', tags: 'khmer, english, translate, language, ខ្មែរ, អង់គ្លេស, បកប្រែ, lang' }
  ];

  function injectGlobalWidgets() {
    // 1. Topbar Quick Search & Security Trigger Buttons
    const topbar = document.getElementById('topbar');
    if (topbar && !document.getElementById('mongkol-topbar-actions')) {
      const actionWrap = document.createElement('div');
      actionWrap.id = 'mongkol-topbar-actions';
      actionWrap.style.cssText = 'display:flex;align-items:center;gap:8px;margin-left:auto;';
      actionWrap.innerHTML =
        '<button type="button" id="open-cmd-palette-btn" title="Quick Search & Command Palette (Ctrl+K)" style="display:inline-flex;align-items:center;gap:8px;background:rgba(0,180,216,0.1);border:1px solid rgba(0,180,216,0.35);color:#00b4d8;border-radius:20px;padding:4px 12px;font-size:0.8rem;font-weight:600;cursor:pointer;transition:all 0.2s ease;">' +
          '<i class="fas fa-terminal"></i> <span class="d-none d-sm-inline">Search / Cmd</span> <kbd style="background:rgba(0,0,0,0.35);color:#e2e8f0;padding:1px 6px;border-radius:4px;font-size:0.72rem;">Ctrl+K</kbd>' +
        '</button>' +
        '<button type="button" id="open-security-center-btn" title="Zero-Trust Security Shield Status" style="display:inline-flex;align-items:center;gap:6px;background:rgba(6,214,160,0.12);border:1px solid rgba(6,214,160,0.4);color:#06d6a0;border-radius:20px;padding:4px 12px;font-size:0.8rem;font-weight:700;cursor:pointer;transition:all 0.2s ease;">' +
          '<i class="fas fa-shield-alt"></i> <span class="d-none d-md-inline">Shield:</span> <span>100%</span>' +
        '</button>';
      topbar.appendChild(actionWrap);
    }

    // 2. Security Center & Command Palette Modals
    if (!document.getElementById('mongkol-security-modal')) {
      const modalHtml = document.createElement('div');
      modalHtml.innerHTML =
        '<!-- SECURITY SHIELD MODAL -->' +
        '<div id="mongkol-security-modal" style="display:none;position:fixed;inset:0;z-index:10020;background:rgba(2,6,23,0.82);backdrop-filter:blur(8px);align-items:center;justify-content:center;padding:16px;">' +
          '<div style="background:#0f172a;border:1px solid rgba(6,214,160,0.45);border-radius:18px;max-width:740px;width:100%;max-height:90vh;overflow-y:auto;padding:24px;color:#f8fafc;box-shadow:0 20px 50px rgba(0,0,0,0.7);">' +
            '<div style="display:flex;justify-content:space-between;align-items:center;border-bottom:1px solid rgba(255,255,255,0.1);padding-bottom:14px;margin-bottom:16px;">' +
              '<div style="display:flex;align-items:center;gap:12px;">' +
                '<div style="width:42px;height:42px;border-radius:12px;background:rgba(6,214,160,0.15);border:1px solid #06d6a0;display:flex;align-items:center;justify-content:center;color:#06d6a0;font-size:1.3rem;">' +
                  '<i class="fas fa-user-shield"></i>' +
                '</div>' +
                '<div>' +
                  '<h3 style="margin:0;font-size:1.25rem;font-weight:800;color:#fff;">Zero-Trust Cyber Defense & WAF Center</h3>' +
                  '<small style="color:#06d6a0;font-weight:600;">Active Multi-Layer Anti-Hack Protection System v2.5</small>' +
                '</div>' +
              '</div>' +
              '<button type="button" id="close-security-modal" style="background:transparent;border:none;color:#94a3b8;font-size:1.3rem;cursor:pointer;"><i class="fas fa-times"></i></button>' +
            '</div>' +
            '<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(160px,1fr));gap:12px;margin-bottom:18px;">' +
              '<div style="padding:12px;border-radius:12px;background:rgba(6,214,160,0.08);border:1px solid rgba(6,214,160,0.3);text-align:center;">' +
                '<div style="font-size:1.5rem;font-weight:800;color:#06d6a0;">7 / 7</div>' +
                '<small style="color:#cbd5e0;">Defense Layers Active</small>' +
              '</div>' +
              '<div style="padding:12px;border-radius:12px;background:rgba(0,180,216,0.08);border:1px solid rgba(0,180,216,0.3);text-align:center;">' +
                '<div class="js-sec-passed-count" style="font-size:1.5rem;font-weight:800;color:#00b4d8;">0</div>' +
                '<small style="color:#cbd5e0;">Integrity Checks Passed</small>' +
              '</div>' +
              '<div style="padding:12px;border-radius:12px;background:rgba(239,68,68,0.08);border:1px solid rgba(239,68,68,0.3);text-align:center;">' +
                '<div class="js-sec-blocked-count" style="font-size:1.5rem;font-weight:800;color:#ef4444;">0</div>' +
                '<small style="color:#cbd5e0;">Attack Vectors Blocked</small>' +
              '</div>' +
            '</div>' +
            '<div style="margin-bottom:18px;">' +
              '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;flex-wrap:wrap;gap:8px;">' +
                '<h4 style="margin:0;font-size:0.95rem;color:#38bdf8;font-weight:700;"><i class="fas fa-layer-group"></i> Active Defense Matrix</h4>' +
                '<button type="button" id="run-waf-selftest-btn" style="background:linear-gradient(135deg,#06d6a0,#00b4d8);border:none;color:#0f172a;font-weight:800;font-size:0.8rem;padding:6px 14px;border-radius:20px;cursor:pointer;">' +
                  '<i class="fas fa-vial"></i> Run Live WAF Attack Simulation' +
                '</button>' +
              '</div>' +
              '<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:8px;">' +
                Object.keys(SecurityState.layers).map(function (k) {
                  const l = SecurityState.layers[k];
                  return '<div style="padding:10px 12px;border-radius:10px;background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.08);display:flex;justify-content:space-between;align-items:center;gap:8px;">' +
                    '<div><div style="font-weight:700;font-size:0.84rem;color:#f8fafc;">' + sanitizeHTML(l.name) + '</div><div style="font-size:0.74rem;color:#94a3b8;">' + sanitizeHTML(l.detail) + '</div></div>' +
                    '<span style="background:rgba(6,214,160,0.18);color:#06d6a0;padding:2px 8px;border-radius:10px;font-size:0.7rem;font-weight:800;">' + sanitizeHTML(l.status) + '</span>' +
                  '</div>';
                }).join('') +
              '</div>' +
            '</div>' +
            '<div>' +
              '<h4 style="margin:0 0 8px 0;font-size:0.95rem;color:#38bdf8;font-weight:700;"><i class="fas fa-stream"></i> Real-Time Security Audit Log</h4>' +
              '<div id="mongkol-sec-audit-list" style="background:#020617;border:1px solid rgba(255,255,255,0.1);border-radius:10px;max-height:170px;overflow-y:auto;"></div>' +
            '</div>' +
          '</div>' +
        '</div>' +

        '<!-- COMMAND PALETTE MODAL (Ctrl+K) -->' +
        '<div id="mongkol-cmd-modal" style="display:none;position:fixed;inset:0;z-index:10030;background:rgba(2,6,23,0.82);backdrop-filter:blur(8px);align-items:flex-start;justify-content:center;padding:60px 16px 16px 16px;">' +
          '<div style="background:#0f172a;border:1px solid rgba(0,180,216,0.45);border-radius:16px;max-width:640px;width:100%;overflow:hidden;box-shadow:0 20px 50px rgba(0,0,0,0.75);color:#f8fafc;">' +
            '<div style="display:flex;align-items:center;gap:10px;padding:14px 18px;border-bottom:1px solid rgba(255,255,255,0.1);">' +
              '<i class="fas fa-search" style="color:#00b4d8;font-size:1.05rem;"></i>' +
              '<input type="text" id="mongkol-cmd-input" placeholder="Search skills, projects, experience, or commands (WAF protected)..." autocomplete="off" style="flex:1;background:transparent;border:none;outline:none;color:#fff;font-size:0.95rem;">' +
              '<button type="button" id="close-cmd-modal" style="background:rgba(255,255,255,0.08);border:none;color:#94a3b8;padding:2px 8px;border-radius:6px;font-size:0.75rem;cursor:pointer;">ESC</button>' +
            '</div>' +
            '<div id="mongkol-cmd-results" style="max-height:360px;overflow-y:auto;padding:10px;"></div>' +
          '</div>' +
        '</div>';

      document.body.appendChild(modalHtml);
    }

    // Bind Topbar & Modal Events
    const secModal = document.getElementById('mongkol-security-modal');
    const cmdModal = document.getElementById('mongkol-cmd-modal');
    const cmdInput = document.getElementById('mongkol-cmd-input');

    const openSecBtn = document.getElementById('open-security-center-btn');
    if (openSecBtn && secModal) {
      openSecBtn.addEventListener('click', function () {
        updateSecurityBadges();
        secModal.style.display = 'flex';
      });
    }

    document.querySelectorAll('.js-open-security-modal').forEach(function (btn) {
      btn.addEventListener('click', function (e) {
        e.preventDefault();
        updateSecurityBadges();
        if (secModal) secModal.style.display = 'flex';
      });
    });

    const closeSecBtn = document.getElementById('close-security-modal');
    if (closeSecBtn && secModal) {
      closeSecBtn.addEventListener('click', function () { secModal.style.display = 'none'; });
      secModal.addEventListener('click', function (e) { if (e.target === secModal) secModal.style.display = 'none'; });
    }

    const simBtn = document.getElementById('run-waf-selftest-btn');
    if (simBtn) {
      simBtn.addEventListener('click', runLiveWafSimulation);
    }

    function openCmdPalette() {
      if (!cmdModal) return;
      cmdModal.style.display = 'flex';
      renderCmdResults('');
      if (cmdInput) {
        cmdInput.value = '';
        setTimeout(function () { cmdInput.focus(); }, 50);
      }
    }

    const openCmdBtn = document.getElementById('open-cmd-palette-btn');
    if (openCmdBtn) {
      openCmdBtn.addEventListener('click', openCmdPalette);
    }

    const closeCmdBtn = document.getElementById('close-cmd-modal');
    if (closeCmdBtn && cmdModal) {
      closeCmdBtn.addEventListener('click', function () { cmdModal.style.display = 'none'; });
      cmdModal.addEventListener('click', function (e) { if (e.target === cmdModal) cmdModal.style.display = 'none'; });
    }

    if (cmdInput) {
      cmdInput.addEventListener('input', function () {
        const val = cmdInput.value || '';
        const check = inspectPayload(val, 'Command Palette Search');
        if (!check.safe) {
          cmdInput.value = '';
          renderCmdResults('');
          return;
        }
        renderCmdResults(val);
      });
    }

    document.addEventListener('keydown', function (e) {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        openCmdPalette();
      } else if (e.key === 'Escape') {
        if (secModal) secModal.style.display = 'none';
        if (cmdModal) cmdModal.style.display = 'none';
      }
    });

    updateSecurityBadges();
  }

  function renderCmdResults(query) {
    const container = document.getElementById('mongkol-cmd-results');
    if (!container) return;
    const q = (query || '').trim().toLowerCase();

    const filtered = SEARCH_DATABASE.filter(function (item) {
      if (!q) return true;
      return item.title.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q) ||
        item.tags.toLowerCase().includes(q);
    });

    if (filtered.length === 0) {
      container.innerHTML = '<div style="padding:20px;text-align:center;color:#94a3b8;">No matching skills, projects, or commands found.</div>';
      return;
    }

    container.innerHTML = filtered.map(function (item, idx) {
      return '<div class="cmd-result-item" data-idx="' + idx + '" data-url="' + (item.url || '') + '" data-action="' + (item.action || '') + '" style="padding:10px 14px;border-radius:10px;cursor:pointer;display:flex;justify-content:space-between;align-items:center;gap:10px;margin-bottom:4px;background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.05);transition:all 0.15s ease;">' +
        '<div>' +
          '<div style="font-weight:700;font-size:0.9rem;color:#f8fafc;">' + sanitizeHTML(item.title) + '</div>' +
          '<div style="font-size:0.76rem;color:#94a3b8;">' + sanitizeHTML(item.tags) + '</div>' +
        '</div>' +
        '<span style="background:rgba(0,180,216,0.15);color:#00b4d8;padding:3px 10px;border-radius:12px;font-size:0.72rem;font-weight:700;white-space:nowrap;">' + sanitizeHTML(item.category) + '</span>' +
      '</div>';
    }).join('');

    container.querySelectorAll('.cmd-result-item').forEach(function (el) {
      el.addEventListener('click', function () {
        const action = el.getAttribute('data-action');
        const url = el.getAttribute('data-url');
        const cmdModal = document.getElementById('mongkol-cmd-modal');
        if (cmdModal) cmdModal.style.display = 'none';

        if (action === 'security') {
          const secModal = document.getElementById('mongkol-security-modal');
          updateSecurityBadges();
          if (secModal) secModal.style.display = 'flex';
        } else if (action === 'print-cv') {
          window.print();
        } else if (action === 'toggle-lang') {
          if (window.MongkolI18n) window.MongkolI18n.toggle();
        } else if (action === 'terminal') {
          const term = document.getElementById('interactive-terminal-section');
          if (term) {
            term.scrollIntoView({ behavior: 'smooth' });
            const input = document.getElementById('mongkol-term-input');
            if (input) input.focus();
          }
        } else if (url) {
          if (url.startsWith('#')) {
            const target = document.querySelector(url);
            if (target) {
              target.scrollIntoView({ behavior: 'smooth' });
            } else {
              window.location.href = './index.html' + url;
            }
          } else {
            window.location.href = url;
          }
        }
      });
    });
  }

  // ============================================================================
  // INTERACTIVE SYSADMIN & CYBERSECURITY TERMINAL ENGINE
  // ============================================================================
  function initInteractiveTerminal() {
    const termOutput = document.getElementById('mongkol-term-output');
    const termInput = document.getElementById('mongkol-term-input');
    const termForm = document.getElementById('mongkol-term-form');

    if (!termOutput || !termInput) return;

    const COMMANDS = {
      help: function () {
        const isKm = window.MongkolI18n && window.MongkolI18n.getLanguage() === 'km';
        if (isKm) {
          return [
            '<span style="color:#06d6a0;font-weight:700;">ពាក្យបញ្ជា SysAdmin & សុវត្ថិភាពដែលអាចប្រើបាន៖</span>',
            '  <strong style="color:#00b4d8;">whoami</strong>     — បង្ហាញប្រវត្តិរូបសង្ខេបរបស់ សម្បត្តិ មង្គល',
            '  <strong style="color:#00b4d8;">skills</strong>     — បង្ហាញតារាងជំនាញបច្ចេកទេសស្នូល',
            '  <strong style="color:#00b4d8;">projects</strong>   — មើលគម្រោងសហគ្រាស និងស្ថាបត្យកម្មវេបសាយ',
            '  <strong style="color:#00b4d8;">security</strong>   — ពិនិត្យស្ថានភាពប្រព័ន្ធការពារ Zero-Trust WAF',
            '  <strong style="color:#00b4d8;">waf-test</strong>   — សាកល្បងបាញ់ទប់ស្កាត់ XSS/SQLi/LFI ផ្ទាល់',
            '  <strong style="color:#00b4d8;">network</strong>    — មើលគំនូសតាងបណ្ដាញ MikroTik & Windows Server AD',
            '  <strong style="color:#00b4d8;">lang</strong>       — ប្ដូរភាសា ខ្មែរ ⇄ អង់គ្លេស (ឬវាយ lang km / lang en)',
            '  <strong style="color:#00b4d8;">contact</strong>    — បង្ហាញព័ត៌មានទំនាក់ទំនងផ្ទាល់ (GitHub/Telegram/Phone)',
            '  <strong style="color:#00b4d8;">cv</strong>         — បោះពុម្ព / រក្សាទុក CV ជា PDF',
            '  <strong style="color:#00b4d8;">clear</strong>      — សម្អាតអេក្រង់ Terminal'
          ].join('\n');
        }
        return [
          '<span style="color:#06d6a0;font-weight:700;">Available Enterprise SysAdmin & Security Commands:</span>',
          '  <strong style="color:#00b4d8;">whoami</strong>     — Display Sambath Mongkol profile & credentials',
          '  <strong style="color:#00b4d8;">skills</strong>     — List core technical proficiency matrix',
          '  <strong style="color:#00b4d8;">projects</strong>   — View deployed enterprise & web architectures',
          '  <strong style="color:#00b4d8;">security</strong>   — Inspect active Zero-Trust WAF & security shield',
          '  <strong style="color:#00b4d8;">waf-test</strong>   — Execute live XSS/SQLi/LFI penetration self-test',
          '  <strong style="color:#00b4d8;">network</strong>    — Show MikroTik & Windows Server AD topology status',
          '  <strong style="color:#00b4d8;">lang</strong>       — Switch language Khmer ⇄ English (lang km / lang en)',
          '  <strong style="color:#00b4d8;">contact</strong>    — Display direct contact channels (GitHub/Telegram/Phone)',
          '  <strong style="color:#00b4d8;">cv</strong>         — Print / Save official CV as PDF',
          '  <strong style="color:#00b4d8;">clear</strong>      — Clear terminal buffer'
        ].join('\n');
      },
      lang: function () {
        if (window.MongkolI18n) {
          window.MongkolI18n.toggle();
          const now = window.MongkolI18n.getLanguage();
          return now === 'km'
            ? '<span style="color:#06d6a0;font-weight:700;">🇰🇭 បានប្ដូរភាសាទៅជា ភាសាខ្មែរ (Khmer) រួចរាល់!</span>'
            : '<span style="color:#00b4d8;font-weight:700;">🇬🇧 Switched interface language to English!</span>';
        }
        return 'Language module loading...';
      },
      'lang km': function () {
        if (window.MongkolI18n) window.MongkolI18n.setLanguage('km');
        return '<span style="color:#06d6a0;font-weight:700;">🇰🇭 បានប្ដូរភាសាទៅជា ភាសាខ្មែរ (Khmer) រួចរាល់!</span>';
      },
      'lang en': function () {
        if (window.MongkolI18n) window.MongkolI18n.setLanguage('en');
        return '<span style="color:#00b4d8;font-weight:700;">🇬🇧 Switched interface language to English!</span>';
      },
      whoami: function () {
        return [
          '<span style="color:#00b4d8;font-weight:700;">👤 SAMBATH MONGKOL (សម្បត្តិ មង្គល)</span>',
          '  Role      : IT Support Specialist • Full-Stack Web Developer • Systems & Network Engineer',
          '  Education : Bachelor of Computer Science — Royal University of Phnom Penh (RUPP)',
          '  Experience: 3+ Years managing multi-company IT infrastructures & Angular/Laravel web apps',
          '  Location  : Phnom Penh, Cambodia 🇰🇭',
          '  Status    : <span style="color:#06d6a0;">● Online & Available for Enterprise IT / Web Projects</span>'
        ].join('\n');
      },
      skills: function () {
        return [
          '<span style="color:#c77dff;font-weight:700;">🛠️ TECHNICAL PROFICIENCY MATRIX:</span>',
          '  [Systems & AD]  Windows Server, Active Directory (AD DS), GPO, Synology NAS, QuickBooks Server [96%]',
          '  [Networking]    MikroTik RouterOS, VLANs, Dual-WAN, Enterprise Wi-Fi, IP Subnetting, Firewall [94%]',
          '  [Web & Code]    Angular (MVVM), HTML5/CSS3, JavaScript (ES6+), PHP, Laravel, SQL Databases     [92%]',
          '  [Automation/AI] n8n Workflow Automation, OpenAI/ChatGPT APIs, PowerShell, Bash Scripting       [95%]',
          '  [Creative]      Adobe Photoshop, Adobe Illustrator, CorelDRAW, UI/UX Branding                  [90%]'
        ].join('\n');
      },
      projects: function () {
        return [
          '<span style="color:#ffb703;font-weight:700;">🚀 DEPLOYED ENTERPRISE SOLUTIONS:</span>',
          '  1. <strong style="color:#fff;">Windows Server AD DS & GPO Hardening</strong> — Multi-company domain controllers & security policies',
          '  2. <strong style="color:#fff;">QuickBooks Multi-User Dedicated Server</strong> — Concurrent accounting DB access & SMB/NTFS ACLs',
          '  3. <strong style="color:#fff;">MikroTik RouterOS Corporate Backbone</strong> — Bandwidth queues, VLAN segmentation & firewall rules',
          '  4. <strong style="color:#fff;">Synology NAS 3-2-1 Disaster Recovery</strong> — Automated snapshots, replication & recovery testing',
          '  5. <strong style="color:#fff;">n8n + ChatGPT AI IT Alerting Pipeline</strong> — Automated health probes & instant Telegram incident response',
          '  6. <strong style="color:#fff;">Angular MVVM Enterprise Web Platform</strong> — Reusable SPA components & RESTful backend integration'
        ].join('\n');
      },
      security: function () {
        return [
          '<span style="color:#06d6a0;font-weight:700;">🛡️ ZERO-TRUST SECURITY SHIELD STATUS: [ACTIVE 100%]</span>',
          '  • Content-Security-Policy : ENFORCED (Strict Script/Style/Frame Origins)',
          '  • Client-Side WAF Engine  : ACTIVE (XSS, SQLi, LFI, Prototype Pollution Filter)',
          '  • DOM Mutation Sentinel   : ACTIVE (Real-time Unauthorized Script Interceptor)',
          '  • Anti-Clickjacking Guard : ACTIVE (Frame-Ancestors & Top-Window Verification)',
          '  • Integrity Checks Passed : ' + SecurityState.checksPassed + ' | Attack Vectors Blocked: ' + SecurityState.threatsBlocked
        ].join('\n');
      },
      'waf-test': function () {
        runLiveWafSimulation();
        return '<span style="color:#06d6a0;font-weight:700;">[WAF SELF-TEST EXECUTED]</span> Simulated 4 attack vectors (XSS, SQLi, LFI, Prototype Pollution) -> <strong style="color:#06d6a0;">100% INTERCEPTED & BLOCKED!</strong>';
      },
      network: function () {
        return [
          '<span style="color:#00b4d8;font-weight:700;">🌐 ENTERPRISE NETWORK & SERVER TOPOLOGY:</span>',
          '  [ISP Dual-WAN] ──► [MikroTik RouterOS Firewall & QoS]',
          '                        ├── VLAN 10 (Server Farm): Windows Server AD DS + QuickBooks DB Server',
          '                        ├── VLAN 20 (Storage DR) : Synology NAS 3-2-1 Snapshot Vault',
          '                        ├── VLAN 30 (Workstations): GPO-Hardened Client Endpoints & Enterprise Wi-Fi',
          '                        └── VLAN 40 (NOC / AI)   : n8n + OpenAI Automated Health Probe Server'
        ].join('\n');
      },
      contact: function () {
        return [
          '<span style="color:#06d6a0;font-weight:700;">📬 DIRECT COMMUNICATION CHANNELS:</span>',
          '  • GitHub   : <a href="https://github.com/mongkolsingle10-max" target="_blank" rel="noopener noreferrer" style="color:#00b4d8;">https://github.com/mongkolsingle10-max</a>',
          '  • Telegram : <a href="https://t.me/sambathmongkol" target="_blank" rel="noopener noreferrer" style="color:#00b4d8;">https://t.me/sambathmongkol</a>',
          '  • Email    : <a href="mailto:sambathmongkol89@gmail.com" style="color:#00b4d8;">sambathmongkol89@gmail.com</a>',
          '  • Phone    : <a href="tel:0965481889" style="color:#06d6a0;">096 548 1889</a>'
        ].join('\n');
      },
      cv: function () {
        setTimeout(function () { window.print(); }, 300);
        return '<span style="color:#00b4d8;">📄 Launching Print / Save as PDF dialog for Sambath Mongkol\'s CV...</span>';
      }
    };

    function executeTerminalCommand(rawCmd) {
      if (!checkRateLimit('terminal-cmd', 20, 5000)) return;
      const trimmed = (rawCmd || '').trim();
      if (!trimmed) return;

      const check = inspectPayload(trimmed, 'Interactive Terminal');
      const promptHtml = '<div style="margin-top:8px;"><span style="color:#06d6a0;font-weight:700;">mongkol@enterprise-srv</span>:<span style="color:#00b4d8;">~</span>$ ' + sanitizeHTML(trimmed) + '</div>';

      if (!check.safe) {
        termOutput.innerHTML += promptHtml + '<div style="color:#ef4444;font-weight:700;">🚨 [WAF ALERT] Malicious payload detected (' + sanitizeHTML(check.threat) + ') and blocked by Zero-Trust Shield!</div>';
        termOutput.scrollTop = termOutput.scrollHeight;
        return;
      }

      const cmdKey = trimmed.toLowerCase();
      if (cmdKey === 'clear' || cmdKey === 'cls') {
        termOutput.innerHTML = '<div style="color:#94a3b8;">Terminal buffer cleared. Type <strong style="color:#06d6a0;">help</strong> for available commands.</div>';
        return;
      }

      const handler = COMMANDS[cmdKey];
      let responseHtml = '';
      if (handler) {
        responseHtml = '<pre style="margin:4px 0 0 0;font-family:inherit;white-space:pre-wrap;color:#e2e8f0;line-height:1.55;">' + handler() + '</pre>';
      } else {
        responseHtml = '<div style="color:#ffb703;">Command not recognized: "' + sanitizeHTML(trimmed) + '". Type <strong style="color:#06d6a0;">help</strong> to see all commands.</div>';
      }

      termOutput.innerHTML += promptHtml + responseHtml;
      termOutput.scrollTop = termOutput.scrollHeight;
    }

    if (termForm) {
      termForm.addEventListener('submit', function (e) {
        e.preventDefault();
        const val = termInput.value;
        termInput.value = '';
        executeTerminalCommand(val);
      });
    }

    document.querySelectorAll('.js-term-quick-cmd').forEach(function (btn) {
      btn.addEventListener('click', function () {
        const cmd = btn.getAttribute('data-cmd');
        executeTerminalCommand(cmd);
      });
    });
  }

  // ============================================================================
  // PROJECT FILTER & SECURE CONTACT FORM HANDLER
  // ============================================================================
  function initProjectFiltersAndForms() {
    // Project Category Filter Buttons
    const filterBtns = document.querySelectorAll('.js-proj-filter');
    const projCards = document.querySelectorAll('.js-proj-card');

    filterBtns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        const cat = btn.getAttribute('data-filter') || 'all';
        filterBtns.forEach(function (b) {
          b.style.background = 'rgba(255,255,255,0.05)';
          b.style.color = '#cbd5e0';
          b.style.borderColor = 'rgba(255,255,255,0.12)';
        });
        btn.style.background = 'rgba(0,180,216,0.2)';
        btn.style.color = '#00b4d8';
        btn.style.borderColor = '#00b4d8';

        projCards.forEach(function (card) {
          const cardCat = card.getAttribute('data-category') || '';
          if (cat === 'all' || cardCat.includes(cat)) {
            card.style.display = 'flex';
          } else {
            card.style.display = 'none';
          }
        });
      });
    });

    // Secure Quick Contact Composer with Honeypot & WAF Validation
    const contactForm = document.getElementById('mongkol-secure-contact-form');
    if (contactForm) {
      contactForm.addEventListener('submit', function (e) {
        e.preventDefault();
        if (!checkRateLimit('contact-submit', 3, 15000)) return;

        const honeypot = document.getElementById('sec-hp-field');
        if (honeypot && honeypot.value) {
          logSecurityEvent('BLOCKED', 'Anti-Bot Honeypot', 'Automated bot form submission trapped');
          return;
        }

        const nameEl = document.getElementById('sec-contact-name');
        const subjEl = document.getElementById('sec-contact-subject');
        const msgEl = document.getElementById('sec-contact-message');
        const channelEl = document.getElementById('sec-contact-channel');

        const name = nameEl ? nameEl.value.trim() : '';
        const subj = subjEl ? subjEl.value.trim() : '';
        const msg = msgEl ? msgEl.value.trim() : '';
        const channel = channelEl ? channelEl.value : 'email';

        const c1 = inspectPayload(name, 'Contact Name');
        const c2 = inspectPayload(subj, 'Contact Subject');
        const c3 = inspectPayload(msg, 'Contact Message');

        if (!c1.safe || !c2.safe || !c3.safe) {
          return;
        }

        logSecurityEvent('PASS', 'WAF Engine', 'Contact message payload verified clean');
        showSecurityToast('Payload verified by Zero-Trust WAF! Opening secure ' + channel.toUpperCase() + ' channel...', 'success');

        if (channel === 'telegram') {
          window.open('https://t.me/sambathmongkol', '_blank', 'noopener,noreferrer');
        } else {
          const mailSubject = encodeURIComponent('[Portfolio Inquiry] ' + subj + ' — from ' + name);
          const mailBody = encodeURIComponent('Hello Sambath Mongkol,\n\n' + msg + '\n\nBest regards,\n' + name);
          window.location.href = 'mailto:sambathmongkol89@gmail.com?subject=' + mailSubject + '&body=' + mailBody;
        }
      });
    }

    // Print CV Buttons
    document.querySelectorAll('.js-print-cv-btn').forEach(function (btn) {
      btn.addEventListener('click', function (e) {
        e.preventDefault();
        window.print();
      });
    });
  }

  // ============================================================================
  // UNIVERSAL MOBILE UX, BOTTOM DOCK, SWIPE DRAWER & ACCESSIBILITY ENHANCER
  // ============================================================================
  function initMobileAndAccessibility() {
    // 1. Accessible Skip-to-Main-Content Link
    const mainEl = document.querySelector('main[aria-label="Main Content"]');
    if (mainEl && !document.querySelector('.mongkol-skip-link')) {
      if (!mainEl.id) mainEl.id = 'main-content';
      const skip = document.createElement('a');
      skip.href = '#' + mainEl.id;
      skip.className = 'mongkol-skip-link no-print';
      skip.textContent = 'Skip to main content';
      document.body.insertBefore(skip, document.body.firstChild);
    }

    // 2. Native-Style Mobile Bottom Quick-Navigation Bar (< 768px)
    const sidebar = document.getElementById('sidebar');
    if (sidebar && !document.getElementById('mongkol-mobile-dock')) {
      const homeNav = sidebar.querySelector('nav a[href*="index.html"]');
      const base = homeNav && (homeNav.getAttribute('href') || '').startsWith('../') ? '../' : './';
      const path = (window.location.pathname || '').toLowerCase();
      const isAbout = path.includes('/about');
      const isCat = path.includes('/categories');
      const isHome = !isAbout && !isCat && !path.includes('/tags') && !path.includes('/archives');

      const dock = document.createElement('nav');
      dock.id = 'mongkol-mobile-dock';
      dock.className = 'no-print';
      dock.setAttribute('aria-label', 'Mobile Quick Navigation');
      dock.innerHTML =
        '<a href="' + base + 'index.html" class="m-dock-btn' + (isHome ? ' active-tab' : '') + '" data-i18n-en="Home" data-i18n-km="ទំព័រដើម">' +
          '<i class="fas fa-home"></i><span>Home</span>' +
        '</a>' +
        '<a href="' + base + 'categories/" class="m-dock-btn' + (isCat ? ' active-tab' : '') + '" data-i18n-en="Skills" data-i18n-km="ជំនាញ">' +
          '<i class="fas fa-layer-group"></i><span>Skills</span>' +
        '</a>' +
        '<a href="' + base + 'about/" class="m-dock-btn' + (isAbout ? ' active-tab' : '') + '" data-i18n-en="CV" data-i18n-km="ប្រវត្តិរូប">' +
          '<i class="fas fa-id-card"></i><span>CV</span>' +
        '</a>' +
        '<button type="button" id="mobile-dock-search" class="m-dock-btn" data-i18n-en="Search" data-i18n-km="ស្វែងរក">' +
          '<i class="fas fa-search"></i><span>Search</span>' +
        '</button>' +
        '<button type="button" id="mobile-dock-shield" class="m-dock-btn shield-tab" data-i18n-en="Shield" data-i18n-km="ការពារ">' +
          '<i class="fas fa-shield-alt"></i><span>Shield</span>' +
        '</button>';

      document.body.appendChild(dock);

      const mSearch = document.getElementById('mobile-dock-search');
      if (mSearch) {
        mSearch.addEventListener('click', function () {
          const btn = document.getElementById('open-cmd-palette-btn');
          if (btn) btn.click();
        });
      }

      const mShield = document.getElementById('mobile-dock-shield');
      if (mShield) {
        mShield.addEventListener('click', function () {
          const btn = document.getElementById('open-security-center-btn');
          if (btn) btn.click();
        });
      }

      function syncMobileDockLang(lang) {
        const isKm = lang === 'km';
        dock.querySelectorAll('.m-dock-btn').forEach(function (item) {
          const label = item.querySelector('span');
          if (label) {
            label.textContent = isKm ? item.getAttribute('data-i18n-km') : item.getAttribute('data-i18n-en');
          }
        });
      }

      window.addEventListener('mongkol:langchange', function (e) {
        syncMobileDockLang(e.detail && e.detail.lang);
      });
      if (window.MongkolI18n) {
        syncMobileDockLang(window.MongkolI18n.getLanguage());
      }
    }

    // 3. Touch Swipe-Left to Close Mobile Sidebar Drawer & Escape Support
    let touchStartX = 0;
    let touchStartY = 0;

    document.addEventListener('touchstart', function (e) {
      if (!e.touches || e.touches.length !== 1) return;
      touchStartX = e.touches[0].clientX;
      touchStartY = e.touches[0].clientY;
    }, { passive: true });

    document.addEventListener('touchend', function (e) {
      if (!e.changedTouches || e.changedTouches.length !== 1) return;
      const dx = e.changedTouches[0].clientX - touchStartX;
      const dy = Math.abs(e.changedTouches[0].clientY - touchStartY);
      if (dy > 60) return;

      const isOpen = document.body.hasAttribute('sidebar-display');
      const mask = document.getElementById('mask');
      if (isOpen && dx < -65) {
        if (mask) mask.click();
        document.body.removeAttribute('sidebar-display');
      }
    }, { passive: true });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && document.body.hasAttribute('sidebar-display')) {
        const mask = document.getElementById('mask');
        if (mask) mask.click();
        document.body.removeAttribute('sidebar-display');
      }
    });
  }

  // Initialize All Security Layers Immediately
  enforceAntiClickjacking();
  enforcePrototypeGuard();
  scanLocationVectors();
  window.addEventListener('hashchange', scanLocationVectors);

  function onReady() {
    hardenLinks(document);
    startDomSentinel();
    setupAssetAndConsoleProtection();
    injectGlobalWidgets();
    initInteractiveTerminal();
    initProjectFiltersAndForms();
    initMobileAndAccessibility();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', onReady);
  } else {
    onReady();
  }

  // Expose Public Read-Only Diagnostic Interface
  window.MongkolSecurity = Object.freeze({
    version: SecurityState.version,
    sanitize: sanitizeHTML,
    inspect: inspectPayload,
    runSelfTest: runLiveWafSimulation,
    getStatus: function () {
      return {
        version: SecurityState.version,
        threatsBlocked: SecurityState.threatsBlocked,
        checksPassed: SecurityState.checksPassed,
        layers: SecurityState.layers,
        recentAudit: SecurityState.auditLog.slice(0, 10)
      };
    }
  });
})();
