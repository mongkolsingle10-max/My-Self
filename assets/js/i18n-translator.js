/**
 * ============================================================================
 * SAMBATH MONGKOL - ADVANCED KHMER <-> ENGLISH (i18n) TRANSLATION ENGINE
 * Version: 3.0.0 | Lossless DOM Snapshot Engine, Khmer Typography & Zero-Trust Safe
 * Shortcut: Alt + L | URL Support: ?lang=km or ?lang=en | Persistent localStorage
 * ============================================================================
 */
(function () {
  'use strict';

  const STORAGE_KEY = 'mongkol_lang';
  let currentLang = 'en';

  // Lossless original English snapshots
  const originalHtmlMap = new WeakMap();
  const originalAttrMap = new WeakMap();
  const originalTextMap = new WeakMap();
  const trackedHtmlEls = new Set();
  const trackedAttrEls = new Set();
  const trackedTextNodes = new Set();

  function norm(str) {
    return (str || '').replace(/\s+/g, ' ').trim();
  }

  // ============================================================================
  // COMPREHENSIVE ENGLISH -> KHMER DICTIONARY (HTML-PRESERVING & EXACT PHRASES)
  // ============================================================================
  const EXACT_HTML_KM = {
    // --- Sidebar & Navigation ---
    'Sambath Mongkol': 'សម្បត្តិ មង្គល',
    'SAMBATH MONGKOL': 'សម្បត្តិ មង្គល',
    'IT Support Specialist • Web Developer • Systems & Network': 'IT Support • អភិវឌ្ឍន៍វេបសាយ • ប្រព័ន្ធ & បណ្ដាញ',
    'IT Support Specialist • Full-Stack Web Developer • Systems & Network': 'អ្នកជំនាញ IT Support • អភិវឌ្ឍន៍វេបសាយ Full-Stack • ប្រព័ន្ធ & បណ្ដាញ',
    'IT Support Specialist • Full-Stack Web Developer • Systems & Network Engineer': 'អ្នកជំនាញ IT Support • អភិវឌ្ឍន៍វេបសាយ Full-Stack • វិស្វករប្រព័ន្ធ & បណ្ដាញ',
    'HOME': 'ទំព័រដើម',
    'Home': 'ទំព័រដើម',
    'CATEGORIES': 'ប្រភេទជំនាញ',
    'Categories': 'ប្រភេទជំនាញ',
    'TAGS': 'បច្ចេកវិទ្យា',
    'Tags': 'បច្ចេកវិទ្យា',
    'ARCHIVES': 'ប្រវត្តិស្នាដៃ',
    'Archives': 'ប្រវត្តិស្នាដៃ',
    'ABOUT': 'អំពីខ្ញុំ & CV',
    'About': 'អំពីខ្ញុំ & CV',

    // --- Hero Banner ---
    '🚀 WELCOME TO MY PORTFOLIO': '🚀 សូមស្វាគមន៍មកកាន់គេហទំព័រប្រវត្តិរូបរបស់ខ្ញុំ',
    'Passionate IT professional with Computer Science background from Royal University of Phnom Penh (RUPP). Experienced in supporting multi-company IT infrastructures, Windows Server, Active Directory, MikroTik networking, Synology NAS backup, responsive Web Development, and n8n AI workflow automation.':
      'អ្នកជំនាញព័ត៌មានវិទ្យាដែលមានមូលដ្ឋានគ្រឹះវិទ្យាសាស្ត្រកុំព្យូទ័រពី <strong>សាកលវិទ្យាល័យភូមិន្ទភ្នំពេញ (RUPP)</strong>។ មានបទពិសោធន៍ផ្ទាល់ក្នុងការគ្រប់គ្រងហេដ្ឋារចនាសម្ព័ន្ធ IT សម្រាប់ក្រុមហ៊ុនច្រើន Windows Server, Active Directory, បណ្ដាញ MikroTik, ប្រព័ន្ធបម្រុងទុក Synology NAS, ការអភិវឌ្ឍន៍វេបសាយទំនើប និងប្រព័ន្ធស្វ័យប្រវត្តិកម្ម AI ដោយប្រើ n8n។',
    'GitHub Profile': '<i class="fab fa-github"></i> គណនី GitHub',
    'View Full CV': '<i class="fas fa-id-card"></i> មើលប្រវត្តិរូប (CV)',
    'Print / Save CV': '<i class="fas fa-file-pdf"></i> បោះពុម្ព / រក្សាទុក CV',
    'Print / Save CV (PDF)': '<i class="fas fa-file-pdf"></i> បោះពុម្ព / រក្សាទុក CV (PDF)',
    'Zero-Trust Shield: ON': '<i class="fas fa-shield-alt"></i> ប្រព័ន្ធការពារ Zero-Trust: បើក',
    'Zero-Trust Verified': '<i class="fas fa-shield-alt"></i> ផ្ទៀងផ្ទាត់សុវត្ថិភាព Zero-Trust',
    'Contact Me': '<i class="fas fa-paper-plane"></i> ទំនាក់ទំនងខ្ញុំ',

    // --- Security Banner & Modal ---
    'Zero-Trust Cyber Defense & Anti-Hack WAF Engine': 'ប្រព័ន្ធការពារសុវត្ថិភាព Zero-Trust & ជញ្ជាំងភ្លើង WAF ប្រឆាំងការ Hack',
    '7/7 LAYERS ACTIVE': 'ស្រទាប់ការពារ ៧/៧ កំពុងដំណើរការ',
    'Protected by Strict Content-Security-Policy (CSP), Real-Time XSS/SQLi/LFI Payload WAF, DOM Mutation Sentinel, Anti-Clickjacking & Rate-Limiting.':
      'ការពារដោយគោលនយោបាយ Content-Security-Policy (CSP) តឹងរ៉ឹង, ប្រព័ន្ធ WAF ទប់ស្កាត់ XSS/SQLi/LFI ភ្លាមៗ, ប្រព័ន្ធតាមដាន DOM Sentinel, ការពារ Clickjacking និងកម្រិត Rate-Limiting។',
    'Checks Passed': 'ការផ្ទៀងផ្ទាត់ជោគជ័យ',
    'Threats Blocked': 'ការវាយប្រហារត្រូវបានទប់ស្កាត់',
    'Inspect WAF & Run Self-Test': '<i class="fas fa-radar"></i> ពិនិត្យ WAF & សាកល្បងការពារ',
    'Zero-Trust Cyber Defense & WAF Center': 'មជ្ឈមណ្ឌលការពារសុវត្ថិភាព Zero-Trust & WAF',
    'Active Multi-Layer Anti-Hack Protection System v2.5': 'ប្រព័ន្ធការពារប្រឆាំងការ Hack ច្រើនស្រទាប់ ជំនាន់ v2.5',
    'Defense Layers Active': 'ស្រទាប់ការពារកំពុងសកម្ម',
    'Integrity Checks Passed': 'ការផ្ទៀងផ្ទាត់សុវត្ថិភាពជោគជ័យ',
    'Attack Vectors Blocked': 'ការវាយប្រហារត្រូវបានរារាំង',
    'Active Defense Matrix': '<i class="fas fa-layer-group"></i> តារាងស្រទាប់ការពារសកម្ម',
    'Run Live WAF Attack Simulation': '<i class="fas fa-vial"></i> សាកល្បងបាញ់ទប់ស្កាត់ការវាយប្រហារ WAF',
    'Real-Time Security Audit Log': '<i class="fas fa-stream"></i> កំណត់ត្រាសុវត្ថិភាពផ្ទាល់ (Audit Log)',
    'Content Security Policy (CSP)': 'គោលនយោបាយ Content Security Policy (CSP)',
    'Strict origin whitelist & frame-ancestors none': 'កំណត់ប្រភព Script តឹងរ៉ឹង និងបិទការបង្កប់ Iframe',
    'Client-Side WAF (XSS / SQLi / LFI)': 'ប្រព័ន្ធ WAF ការពារ XSS / SQLi / LFI',
    'Real-time URL, hash & input payload inspection': 'ត្រួតពិនិត្យ URL, Hash និងទិន្នន័យបញ្ចូលភ្លាមៗ',
    'DOM Integrity Mutation Sentinel': 'ប្រព័ន្ធតាមដានសុវត្ថិភាព DOM Sentinel',
    'Blocks unauthorized script/iframe injections': 'រារាំងការលួចចាក់បញ្ចូល Script ឬ Iframe ពីខាងក្រៅ',
    'Anti-Clickjacking Frame Guard': 'ប្រព័ន្ធការពារ Clickjacking',
    'Top-frame verification & iframe lockdown': 'ផ្ទៀងផ្ទាត់ទំព័រដើម និងទប់ស្កាត់ការលួចបង្កប់ Frame',
    'Anti-Tabnabbing & URI Firewall': 'ប្រព័ន្ធការពារ Tabnabbing & តំណភ្ជាប់ព្យាបាទ',
    'Enforces noopener noreferrer & blocks javascript: URIs': 'បង្ខំប្រើ noopener noreferrer និងបិទតំណ javascript:',
    'Prototype Pollution Protection': 'ប្រព័ន្ធការពារ Prototype Pollution',
    'Guards Object.prototype & JSON payload keys': 'ការពារ Object.prototype និងទិន្នន័យ JSON ពីការកែប្រែ',
    'Action Rate-Limiter & Anti-Bot Honeypot': 'ប្រព័ន្ធកម្រិតសំណើ Rate-Limiter & អន្ទាក់ Bot',
    'Throttles rapid automated floods & bot submissions': 'ទប់ស្កាត់ការបាញ់ Flood និង Bot ស្វ័យប្រវត្តិ',
    'ACTIVE': 'សកម្ម',

    // --- Stats Highlight ---
    'Years Technical Experience': 'ឆ្នាំនៃបទពិសោធន៍បច្ចេកទេស',
    'Companies IT Managed': 'ក្រុមហ៊ុនដែលគ្រប់គ្រងប្រព័ន្ធ IT',
    'High Uptime & Support': 'ស្ថិរភាពប្រព័ន្ធ និងការគាំទ្រខ្ពស់',
    'Computer Science Degree': 'បរិញ្ញាបត្រវិទ្យាសាស្ត្រកុំព្យូទ័រ',

    // --- Featured Projects Showcase ---
    'Featured Enterprise Projects & Architectures': '<i class="fas fa-rocket" style="color: #00b4d8;"></i> គម្រោងសហគ្រាស និងស្ថាបត្យកម្មប្រព័ន្ធឆ្នើមៗ',
    'All (6)': 'ទាំងអស់ (៦)',
    'Systems & AD': 'ប្រព័ន្ធ & AD',
    'MikroTik & Network': 'MikroTik & បណ្ដាញ',
    'Web & Angular': 'វេបសាយ & Angular',
    'AI & Storage': 'AI & ផ្ទុកទិន្នន័យ',
    'Windows Server & Security': '<i class="fas fa-server"></i> Windows Server & សុវត្ថិភាព',
    '● Production': '● កំពុងដំណើរការ',
    'Active Directory (AD DS) & GPO Enterprise Hardening': 'ការពង្រឹងសុវត្ថិភាព Active Directory (AD DS) & GPO កម្រិតសហគ្រាស',
    'Architected centralized Domain Controllers, Organizational Units (OUs), Group Policy security baselines, USB/endpoint restrictions, and role-based NTFS shared folder ACLs across 3 corporate environments.':
      'រៀបចំ Domain Controllers កណ្ដាល, រចនាសម្ព័ន្ធ Organizational Units (OUs), គោលនយោបាយសុវត្ថិភាព GPO, ការកម្រិតសិទ្ធិ USB/Endpoint និងសិទ្ធិចូលប្រើឯកសាររួម NTFS ACLs សម្រាប់ក្រុមហ៊ុនចំនួន ៣។',
    'Database Server': '<i class="fas fa-database"></i> ម៉ាស៊ីនមេទិន្នន័យ',
    '● Multi-Client': '● អ្នកប្រើប្រាស់ច្រើន',
    'QuickBooks Enterprise Multi-User Dedicated Server': 'ម៉ាស៊ីនមេ QuickBooks Enterprise សម្រាប់អ្នកប្រើប្រាស់ច្រើនព្រមគ្នា',
    'Deployed dedicated Windows Server hosting QuickBooks Database Server Manager with optimized SMB shares, firewall port rules, and concurrent lock-free multi-user access for finance departments.':
      'ដំឡើងម៉ាស៊ីនមេ Windows Server ដាច់ដោយឡែកជាមួយ QuickBooks Database Server Manager, រៀបចំ SMB Shares, កំណត់ច្បាប់ Firewall និងអនុញ្ញាតឱ្យផ្នែកគណនេយ្យប្រើប្រាស់ព្រមគ្នាដោយរលូន។',
    'Network & Firewall': '<i class="fas fa-network-wired"></i> បណ្ដាញ & ជញ្ជាំងភ្លើង',
    '● 99.9% Uptime': '● ស្ថិរភាព ៩៩.៩%',
    'MikroTik RouterOS Enterprise Backbone & VLAN Firewall': 'បណ្ដាញស្នូល MikroTik RouterOS & ជញ្ជាំងភ្លើងបែងចែក VLAN',
    'Engineered MikroTik RouterOS routing, VLAN segmentation, QoS bandwidth queues, anti-brute-force firewall filters, and seamless commercial Wi-Fi roaming across multi-floor offices.':
      'រៀបចំ MikroTik RouterOS Routing, ការបែងចែក VLAN, ការគ្រប់គ្រងល្បឿន QoS Bandwidth, ច្បាប់ជញ្ជាំងភ្លើងការពារ Brute-Force និងប្រព័ន្ធ Wi-Fi ការិយាល័យច្រើនជាន់។',
    'Storage & DR': '<i class="fas fa-hdd"></i> ផ្ទុកទិន្នន័យ & សង្គ្រោះប្រព័ន្ធ',
    '● Ransomware Safe': '● ការពារ Ransomware',
    'Synology NAS 3-2-1 Automated Backup & Disaster Recovery': 'ប្រព័ន្ធបម្រុងទុកស្វ័យប្រវត្តិ Synology NAS 3-2-1 & សង្គ្រោះគ្រាអាសន្ន',
    'Designed automated daily backup schedules, immutable snapshot retention policies, granular ACL permissions, and verified bare-metal & file-level disaster recovery procedures.':
      'រចនាកាលវិភាគបម្រុងទុកស្វ័យប្រវត្តិប្រចាំថ្ងៃ, ប្រព័ន្ធ Snapshot រក្សាទិន្នន័យសុវត្ថិភាព, ការកំណត់សិទ្ធិ ACL និងការធ្វើតេស្តសង្គ្រោះទិន្នន័យគ្រាអាសន្ន។',
    'AI & Automation': '<i class="fas fa-robot"></i> AI & ស្វ័យប្រវត្តិកម្ម',
    '● 24/7 Automated': '● ស្វ័យប្រវត្តិ ២៤/៧',
    'n8n + OpenAI Intelligent IT Monitoring & Alerting': 'ប្រព័ន្ធតាមដាន IT ឆ្លាតវៃ និងជូនដំណឹងដោយ n8n + OpenAI',
    'Integrated n8n automation pipelines with PowerShell health scripts and ChatGPT APIs to automatically diagnose server anomalies, summarize incidents, and push real-time alerts to Telegram.':
      'ភ្ជាប់ប្រព័ន្ធស្វ័យប្រវត្តិកម្ម n8n ជាមួយស្គ្រីប PowerShell និង ChatGPT API ដើម្បីវិភាគបញ្ហាម៉ាស៊ីនមេ សង្ខេបហេតុការណ៍ និងផ្ញើការជូនដំណឹងផ្ទាល់ទៅកាន់ Telegram ភ្លាមៗ។',
    'Full-Stack Web': '<i class="fas fa-code"></i> វេបសាយ Full-Stack',
    '● Angular MVVM': '● ស្ថាបត្យកម្ម Angular MVVM',
    'Angular MVVM Single-Page Web Apps & REST APIs': 'កម្មវិធីវេបសាយ Angular MVVM & ការតភ្ជាប់ REST APIs',
    'Built modular single-page web applications with Angular (MVVM architecture), reactive two-way data binding, reusable UI components, and secure REST API integration with Laravel & SQL databases.':
      'អភិវឌ្ឍន៍កម្មវិធីវេបសាយ Single-Page ជាមួយ Angular (MVVM), ការភ្ជាប់ទិន្នន័យ Two-Way Data Binding, UI Components អាចប្រើឡើងវិញ និងការតភ្ជាប់ REST API ជាមួយ Laravel និងមូលដ្ឋានទិន្នន័យ SQL។',

    // --- Interactive Terminal ---
    'Interactive SysAdmin & Security Terminal': '<i class="fas fa-terminal" style="color: #06d6a0;"></i> ស្ថានីយបញ្ជា SysAdmin & សុវត្ថិភាពអន្តរកម្ម',
    'WAF Protected Input': '<i class="fas fa-lock"></i> ការពារដោយ WAF',
    "Welcome to Sambath Mongkol's Enterprise SysAdmin & Security Terminal!": 'សូមស្វាគមន៍មកកាន់ស្ថានីយបញ្ជា SysAdmin & សុវត្ថិភាពរបស់ សម្បត្តិ មង្គល!',
    'Click any command pill above or type help, whoami, skills, projects, network, security, or waf-test below.':
      'ចុចប៊ូតុងបញ្ជាខាងលើ ឬវាយពាក្យ <strong style="color: #06d6a0;">help</strong>, <strong style="color: #06d6a0;">whoami</strong>, <strong style="color: #06d6a0;">skills</strong>, <strong style="color: #06d6a0;">projects</strong>, <strong style="color: #06d6a0;">network</strong>, <strong style="color: #06d6a0;">security</strong>, <strong style="color: #06d6a0;">waf-test</strong> ឬ <strong style="color: #06d6a0;">lang</strong> ខាងក្រោម។',
    'Run': 'ដំណើរការ',

    // --- Work Experience ---
    'Work Experience': '<i class="fas fa-briefcase" style="color: #00b4d8;"></i> បទពិសោធន៍ការងារ',
    'Professional Work Experience': '<i class="fas fa-briefcase" style="margin-right: 8px;"></i> បទពិសោធន៍ការងារវិជ្ជាជីវៈ',
    'More details': 'ព័ត៌មានលម្អិត <i class="fas fa-arrow-right"></i>',
    'Technical Support Specialist': 'អ្នកជំនាញគាំទ្របច្ចេកទេស (Technical Support Specialist)',
    '2025 – Present': '២០២៥ – បច្ចុប្បន្ន',
    '🏢 Sun Computer Solution': '🏢 ក្រុមហ៊ុន Sun Computer Solution',
    'Full IT support and infrastructure maintenance for 3 companies, ensuring high availability and zero operational disruption.':
      'ផ្ដល់ការគាំទ្រផ្នែក IT និងថែទាំហេដ្ឋារចនាសម្ព័ន្ធពេញលេញសម្រាប់ <strong>ក្រុមហ៊ុនចំនួន ៣</strong> ធានាបាននូវស្ថិរភាពខ្ពស់ និងគ្មានការរំខានដល់ប្រតិបត្តិការការងារ។',
    'Windows Server administration: Active Directory (AD DS), user permissions, security policies, GPO, and file shares.':
      'គ្រប់គ្រង Windows Server៖ <strong>Active Directory (AD DS)</strong>, សិទ្ធិអ្នកប្រើប្រាស់, គោលនយោបាយសុវត្ថិភាព, GPO និងការចែករំលែកឯកសារ។',
    'Network engineering: MikroTik routers, switches, enterprise Wi-Fi, IP subnetting, LAN configuration.':
      'វិស្វកម្មបណ្ដាញ៖ <strong>រ៉ោតទ័រ MikroTik</strong>, Switches, Wi-Fi សហគ្រាស, ការបែងចែក IP Subnet និងការដំឡើង LAN។',
    'Deployed dedicated QuickBooks Multi-user Database Server for shared multi-client accounting workflows.':
      'ដំឡើងម៉ាស៊ីនមេ <strong>QuickBooks Multi-user Database Server</strong> ដាច់ដោយឡែកសម្រាប់ប្រព័ន្ធគណនេយ្យប្រើប្រាស់រួមគ្នា។',
    'Cloud & Email services: Microsoft 365, Google Workspace, Outlook, SMTP, IMAP.':
      'សេវាកម្ម Cloud និងអ៊ីមែល៖ <strong>Microsoft 365, Google Workspace</strong>, Outlook, SMTP និង IMAP។',
    'Disaster recovery & data safety: Synology NAS automated daily backups and recovery testing.':
      'ការសង្គ្រោះទិន្នន័យ និងសុវត្ថិភាព៖ ប្រព័ន្ធបម្រុងទុកស្វ័យប្រវត្តិប្រចាំថ្ងៃលើ <strong>Synology NAS</strong> និងការធ្វើតេស្តសង្គ្រោះ។',
    'Implemented automated monitoring & AI assistance workflows using n8n and ChatGPT API.':
      'បង្កើតប្រព័ន្ធតាមដានស្វ័យប្រវត្តិ និងជំនួយការ AI ដោយប្រើប្រាស់ <strong>n8n</strong> និង ChatGPT API។',
    'Programmer & Front-end Developer': 'អ្នកសរសេរកម្មវិធី & អភិវឌ្ឍន៍ Front-end',
    'Programmer / Web Developer': 'អ្នកសរសេរកម្មវិធី / អភិវឌ្ឍន៍វេបសាយ',
    '2024 (1 Year)': '២០២៤ (១ ឆ្នាំ)',
    '🏢 Professional AI Training And Software Development Center': '🏢 មជ្ឈមណ្ឌលបណ្ដុះបណ្ដាល AI និងអភិវឌ្ឍន៍សូហ្វវែរវិជ្ជាជីវៈ',
    'Developed modern, responsive web interfaces using HTML5, CSS3, JavaScript, and Angular Framework (MVVM).':
      'អភិវឌ្ឍន៍ផ្ទាំងវេបសាយទំនើប និងរលូនលើគ្រប់ឧបករណ៍ដោយប្រើ <strong>HTML5, CSS3, JavaScript</strong> និង <strong>Angular Framework</strong> (MVVM)។',
    'Engineered reusable UI components, template rendering, and bi-directional data binding.':
      'បង្កើត UI Components ដែលអាចប្រើប្រាស់ឡើងវិញ, Template Rendering និងការភ្ជាប់ទិន្នន័យ Bi-directional។',
    'Integrated front-end views with REST APIs and back-end databases.':
      'តភ្ជាប់ផ្ទាំង Front-end ជាមួយ REST APIs និងមូលដ្ឋានទិន្នន័យ Back-end។',
    'Optimized rendering efficiency and cross-browser responsiveness.':
      'បង្កើនល្បឿនដំណើរការផ្ទាំងវេបសាយ និងភាពឆបគ្នាលើគ្រប់កម្មវិធីរុករក (Browser)។',
    'Graphic Designer': 'អ្នករចនាក្រាហ្វិក (Graphic Designer)',
    '2022 – 2023': '២០២២ – ២០២៣',
    '2022 – 2023 (4 Months)': '២០២២ – ២០២៣ (៤ ខែ)',
    '🏢 Step Forward International School': '🏢 សាលាអន្តរជាតិ Step Forward',
    'Created marketing materials, banners, social media collaterals with Adobe Photoshop, Illustrator & CorelDRAW.':
      'រចនាផ្ទាំងផ្សព្វផ្សាយទីផ្សារ បដា និងរូបភាពបណ្ដាញសង្គមដោយប្រើ <strong>Adobe Photoshop, Illustrator & CorelDRAW</strong>។',
    'Event Support / Volunteer': 'អ្នកស្ម័គ្រចិត្ត & គាំទ្រព្រឹត្តិការណ៍',
    '2023 – 2024': '២០២៣ – ២០២៤',

    // --- About Page Detailed Bullets & Summary ---
    'Professional Summary': '<i class="fas fa-user-tie" style="margin-right: 8px;"></i> សង្ខេបប្រវត្តិវិជ្ជាជីវៈ',
    'Highly motivated IT Support Specialist and Web Developer with a Bachelor’s degree in Computer Science (Year II) from the Royal University of Phnom Penh (RUPP). Equipped with comprehensive hands-on experience in technical troubleshooting, multi-client system maintenance, network assistance, and custom web software solutions.':
      'ជា <strong>អ្នកជំនាញ IT Support</strong> និង <strong>អ្នកអភិវឌ្ឍន៍វេបសាយ</strong> ដែលមានឆន្ទៈខ្ពស់ និងកំពុងសិក្សាថ្នាក់បរិញ្ញាបត្រវិទ្យាសាស្ត្រកុំព្យូទ័រ (ឆ្នាំទី ២) នៅ <strong>សាកលវិទ្យាល័យភូមិន្ទភ្នំពេញ (RUPP)</strong>។ មានបទពិសោធន៍ផ្ទាល់យ៉ាងទូលំទូលាយក្នុងការដោះស្រាយបញ្ហាបច្ចេកទេស ការថែទាំប្រព័ន្ធអតិថិជនច្រើន ការជួយសម្រួលបណ្ដាញ និងការបង្កើតកម្មវិធីវេបសាយ។',
    'Experienced in supporting academic environments, enterprise IT operations, Windows Server administration, email architecture (Microsoft 365 / Google Workspace), NAS disaster recovery, QuickBooks multi-user dedicated database setups, and both remote and on-site client technical support. Demonstrates sharp problem-solving capabilities, a proactive, customer-focused mindset, and eager drive to excel in a high-impact IT career.':
      'មានបទពិសោធន៍គាំទ្របរិស្ថានសិក្សា និងប្រតិបត្តិការ IT កម្រិតសហគ្រាស ការគ្រប់គ្រង Windows Server, ប្រព័ន្ធអ៊ីមែល (Microsoft 365 / Google Workspace), ការសង្គ្រោះទិន្នន័យ NAS, ការដំឡើងម៉ាស៊ីនមេ QuickBooks អ្នកប្រើប្រាស់ច្រើន និងការគាំទ្រទាំងពីចម្ងាយ និងផ្ទាល់ដល់ទីតាំង។ មានសមត្ថភាពដោះស្រាយបញ្ហារហ័ស និងផ្ដោតលើអតិថិជន។',
    'Provided full IT support and maintenance for 3 companies, ensuring high availability, network resilience, and minimal downtime.':
      'ផ្ដល់ការគាំទ្រ និងថែទាំ IT ពេញលេញសម្រាប់ <strong>ក្រុមហ៊ុនចំនួន ៣</strong> ធានាបាននូវស្ថិរភាពប្រព័ន្ធ និងកាត់បន្ថយការរអាក់រអួលជាអតិបរមា។',
    'Installed, configured, and maintained Windows client machines, drivers, Microsoft Office, endpoint antivirus, printers, scanners, CCTV, and peripheral IT hardware.':
      'ដំឡើង កំណត់រចនាសម្ព័ន្ធ និងថែទាំកុំព្យូទ័រ Windows, Drivers, Microsoft Office, កម្មវិធីកម្ចាត់មេរោគ, ម៉ាស៊ីនព្រីន, ម៉ាស៊ីនស្កេន, កាមេរ៉ា CCTV និងឧបករណ៍ IT ផ្សេងៗ។',
    'Administered Windows Server: Active Directory (AD DS), domain controllers, user accounts, security permissions, shared folders, and Group Policy (GPO).':
      'គ្រប់គ្រង <strong>Windows Server</strong>៖ Active Directory (AD DS), Domain Controllers, គណនីអ្នកប្រើប្រាស់, សិទ្ធិសុវត្ថិភាព, ថតឯកសាររួម និង Group Policy (GPO)។',
    'Managed corporate network infrastructure including LAN, enterprise Wi-Fi, switches, routers, MikroTik RouterOS, TP-Link, and subnet IP planning.':
      'គ្រប់គ្រងហេដ្ឋារចនាសម្ព័ន្ធបណ្ដាញក្រុមហ៊ុនរួមមាន LAN, Wi-Fi សហគ្រាស, Switches, Routers, <strong>MikroTik RouterOS</strong>, TP-Link និងការរៀបចំផែនការ IP Subnet។',
    'Architected and deployed QuickBooks multi-user environment using a dedicated server with high-performance shared network access.':
      'រៀបចំ និងដំឡើងប្រព័ន្ធ <strong>QuickBooks អ្នកប្រើប្រាស់ច្រើន</strong> លើម៉ាស៊ីនមេដាច់ដោយឡែកជាមួយការតភ្ជាប់បណ្ដាញល្បឿនលឿន។',
    'Installed and managed QuickBooks Database Server Manager to facilitate concurrent multi-user database access across multiple client computers.':
      'ដំឡើង និងគ្រប់គ្រង QuickBooks Database Server Manager ដើម្បីឱ្យកុំព្យូទ័រច្រើនគ្រឿងចូលប្រើមូលដ្ឋានទិន្នន័យព្រមគ្នាបានយ៉ាងរលូន។',
    'Configured and administered cloud email infrastructures: Microsoft 365, Google Workspace, Outlook clients, SMTP, and IMAP protocols.':
      'ដំឡើង និងគ្រប់គ្រងប្រព័ន្ធអ៊ីមែល Cloud៖ <strong>Microsoft 365, Google Workspace</strong>, កម្មវិធី Outlook, SMTP និង IMAP។',
    'Implemented and maintained robust backup architectures on Synology NAS, including automated scheduled backups, access control lists, and disaster recovery drills.':
      'រៀបចំ និងថែទាំប្រព័ន្ធបម្រុងទុកទិន្នន័យលើ <strong>Synology NAS</strong> រួមមានការបម្រុងទុកស្វ័យប្រវត្តិ សិទ្ធិ ACL និងការហាត់សមសង្គ្រោះទិន្នន័យ។',
    'Managed cloud storage services: Google Drive, OneDrive, and Dropbox.':
      'គ្រប់គ្រងសេវាផ្ទុកទិន្នន័យ Cloud៖ Google Drive, OneDrive និង Dropbox។',
    'Delivered rapid remote and on-site technical support using AnyDesk, TeamViewer, Windows CMD, PowerShell, and MikroTik Terminal.':
      'ផ្ដល់ការគាំទ្របច្ចេកទេសរហ័សទាំងពីចម្ងាយ និងផ្ទាល់ដោយប្រើ AnyDesk, TeamViewer, Windows CMD, PowerShell និង MikroTik Terminal។',
    'Implemented automation workflows using n8n and integrated AI tools (ChatGPT, OpenAI APIs) to streamline support ticketing, server monitoring, and business alerting.':
      'បង្កើតប្រព័ន្ធស្វ័យប្រវត្តិកម្មដោយប្រើ <strong>n8n</strong> និងភ្ជាប់ឧបករណ៍ AI (ChatGPT, OpenAI APIs) សម្រាប់គ្រប់គ្រង Ticket, តាមដានម៉ាស៊ីនមេ និងផ្ញើការជូនដំណឹង។',
    'Prepared structured monthly IT maintenance reports and thoroughly documented technical troubleshooting runbooks.':
      'រៀបចំរបាយការណ៍ថែទាំ IT ប្រចាំខែ និងចងក្រងឯកសារណែនាំការដោះស្រាយបញ្ហាបច្ចេកទេស។',
    'Developed responsive, interactive web applications using HTML5, CSS3, and JavaScript (ES6+).':
      'អភិវឌ្ឍន៍កម្មវិធីវេបសាយទំនើប និងរស់រវើកដោយប្រើ HTML5, CSS3 និង JavaScript (ES6+)។',
    'Built front-end single-page applications with the Angular framework utilizing the MVVM architectural pattern.':
      'បង្កើតកម្មវិធី Single-Page Front-end ជាមួយ <strong>Angular framework</strong> តាមគំរូស្ថាបត្យកម្ម MVVM។',
    'Designed intuitive user interfaces with a focus on usability, clean component hierarchy, and cross-device responsiveness.':
      'រចនាផ្ទាំងប្រើប្រាស់ងាយស្រួលយល់ រចនាសម្ព័ន្ធ Component ស្អាត និងបង្ហាញបានល្អគ្រប់ទំហំអេក្រង់។',
    'Authored and maintained modular, clean, and testable front-end codebases.':
      'សរសេរ និងថែទាំកូដ Front-end ប្រកបដោយសណ្ដាប់ធ្នាប់ ងាយស្រួលតេស្ត និងពង្រីកបន្ថែម។',
    'Integrated client-side templates and forms with RESTful backend APIs and application business logic.':
      'តភ្ជាប់ផ្ទាំង និងទម្រង់ទិន្នន័យជាមួយ RESTful Backend APIs និងតក្កវិជ្ជាកម្មវិធី។',
    'Diagnosed and resolved UI bugs and enhanced web asset delivery and rendering speed.':
      'ស្វែងរក និងជួសជុលបញ្ហា UI ព្រមទាំងបង្កើនល្បឿនផ្ទុកទំព័រវេបសាយ។',
    'Designed promotional and digital marketing assets for school campaigns and internal communications.':
      'រចនារូបភាពផ្សព្វផ្សាយទីផ្សារឌីជីថលសម្រាប់យុទ្ធនាការសាលា និងការទំនាក់ទំនងផ្ទៃក្នុង។',
    'Created branding graphics, banners, flyers, and social media visual content.':
      'បង្កើតក្រាហ្វិកម៉ាកយីហោ បដា ខិត្តប័ណ្ណ និងមាតិកាបណ្ដាញសង្គម។',
    'Maintained strict consistency across brand palettes, typography, and graphic guidelines.':
      'រក្សាស្តង់ដារពណ៌ អក្សរ និងអត្តសញ្ញាណម៉ាកយីហោបានយ៉ាងច្បាស់លាស់។',
    'Designed promotional graphics and digital materials for event communications and on-site signage.':
      'រចនាក្រាហ្វិកផ្សព្វផ្សាយ និងស្លាកសញ្ញាសម្រាប់ព្រឹត្តិការណ៍ពិព័រណ៍សៀវភៅកម្ពុជា។',
    'Assisted event organizers in visual content production and technical desk support.':
      'ជួយគណៈកម្មការរៀបចំព្រឹត្តិការណ៍ក្នុងការផលិតមាតិការូបភាព និងគាំទ្រផ្នែកបច្ចេកទេស។',

    // --- Technical Arsenal & Education ---
    'Technical Arsenal': '<i class="fas fa-tools" style="color: #06d6a0;"></i> ឃ្លាំងជំនាញបច្ចេកទេស',
    'Systems & Infrastructure': '<i class="fas fa-server"></i> ប្រព័ន្ធ & ហេដ្ឋារចនាសម្ព័ន្ធ',
    'Networking & Hardware': '<i class="fas fa-network-wired"></i> បណ្ដាញ & ឧបករណ៍រឹង',
    'Web & Development': '<i class="fas fa-code"></i> វេបសាយ & ការសរសេរកូដ',
    'Automation & Design': '<i class="fas fa-robot"></i> ស្វ័យប្រវត្តិកម្ម & រចនាក្រាហ្វិក',
    'Education & Certifications': '<i class="fas fa-graduation-cap" style="color: #00b4d8;"></i> ការសិក្សា & វិញ្ញាបនបត្រ',
    'University Degree': 'សញ្ញាបត្រសាកលវិទ្យាល័យ',
    "Bachelor's Degree": 'ថ្នាក់បរិញ្ញាបត្រ',
    'Royal University of Phnom Penh (RUPP)': 'សាកលវិទ្យាល័យភូមិន្ទភ្នំពេញ (RUPP)',
    "Bachelor's Degree in Computer Science": 'បរិញ្ញាបត្រវិទ្យាសាស្ត្រកុំព្យូទ័រ',
    'Computer Science (Year II)': 'វិទ្យាសាស្ត្រកុំព្យូទ័រ (ឆ្នាំទី ២)',
    'Year II • Phnom Penh, Cambodia 🇰🇭': 'ឆ្នាំទី ២ • ភ្នំពេញ កម្ពុជា 🇰🇭',
    'Phnom Penh, Cambodia 🇰🇭': 'ភ្នំពេញ កម្ពុជា 🇰🇭',
    '📍 Phnom Penh, Cambodia 🇰🇭': '📍 ភ្នំពេញ កម្ពុជា 🇰🇭',
    'Professional Course': 'វគ្គសិក្សាវិជ្ជាជីវៈ',
    'Technical Training': 'ការបណ្ដុះបណ្ដាលបច្ចេកទេស',
    'Front-end & Back-end Web Development': 'ការអភិវឌ្ឍន៍វេបសាយ Front-end & Back-end',
    'Creative Training': 'វគ្គបណ្ដុះបណ្ដាលរចនា',
    'Graphic Design Specialist': 'អ្នកជំនាញរចនាក្រាហ្វិក',
    'Graphic Design & Creative Arts': 'ការរចនាក្រាហ្វិក និងសិល្បៈច្នៃប្រឌិត',
    'Personal Data & Languages': '<i class="fas fa-id-card" style="margin-right: 8px;"></i> ព័ត៌មានផ្ទាល់ខ្លួន និងភាសា',
    'Nationality': 'សញ្ជាតិ',
    'Khmer 🇰🇭': 'ខ្មែរ 🇰🇭',
    'Languages': 'ភាសា',
    'Khmer (Native) • English (Intermediate)': 'ខ្មែរ (ភាសាកំណើត) • អង់គ្លេស (កម្រិតមធ្យមវិជ្ជាជីវៈ)',
    'Habits & Interests': 'ចំណូលចិត្ត និងទម្លាប់',
    'Coding, Tech Research, Reading Books, Music': 'សរសេរកូដ, ស្រាវជ្រាវបច្ចេកវិទ្យា, អានសៀវភៅ, តន្ត្រី',
    'Contact Information': '<i class="fas fa-address-book" style="margin-right: 8px;"></i> ព័ត៌មានទំនាក់ទំនង',
    'Phone:': 'ទូរស័ព្ទ៖',
    'Email:': 'អ៊ីមែល៖',
    'GitHub:': 'GitHub៖',
    'Address:': 'អាសយដ្ឋាន៖',
    'Snoun Pich Village, Sangkat Kantouk, Khan Kamboul, Phnom Penh, Cambodia 🇰🇭':
      'ភូមិស្ងួនពេជ្រ សង្កាត់កន្ទោក ខណ្ឌកំបូល រាជធានីភ្នំពេញ កម្ពុជា 🇰🇭',

    // --- Contact Composer ---
    'WAF-SANITIZED & HONEYPOT PROTECTED CHANNEL': '<i class="fas fa-shield-alt"></i> បណ្ដាញទំនាក់ទំនងការពារដោយ WAF & HONEYPOT',
    "Let's Connect & Work Together!": 'តោះទំនាក់ទំនង និងសហការការងារជាមួយគ្នា!',
    'Whether you need enterprise IT support, Windows Server & MikroTik engineering, or full-stack web development, send a direct verified message below.':
      'មិនថាអ្នកត្រូវការសេវា IT Support កម្រិតសហគ្រាស, វិស្វកម្ម Windows Server & MikroTik ឬការអភិវឌ្ឍន៍វេបសាយ Full-Stack ទេ សូមផ្ញើសារផ្ទាល់ដែលការពារសុវត្ថិភាពខាងក្រោម។',
    'Verify Payload & Send Message': '<i class="fas fa-paper-plane"></i> ផ្ទៀងផ្ទាត់សុវត្ថិភាព & ផ្ញើសារ',
    'Dispatch via Email (sambathmongkol89@gmail.com)': 'ផ្ញើតាមរយៈ Email (sambathmongkol89@gmail.com)',
    'Dispatch via Telegram (@sambathmongkol)': 'ផ្ញើតាមរយៈ Telegram (@sambathmongkol)',

    // --- Right Panel & Footer ---
    'Featured Projects': '<i class="fas fa-bolt"></i> គម្រោងលេចធ្លោ',
    'Core Technologies': '<i class="fas fa-tags"></i> បច្ចេកវិទ្យាស្នូល',
    'QuickBooks Multi-User Dedicated Server': '<i class="fas fa-angle-right" style="color: #00b4d8; margin-right: 6px;"></i> ម៉ាស៊ីនមេ QuickBooks អ្នកប្រើប្រាស់ច្រើន',
    'MikroTik RouterOS Enterprise Setup': '<i class="fas fa-angle-right" style="color: #06d6a0; margin-right: 6px;"></i> ការដំឡើង MikroTik RouterOS សហគ្រាស',
    'Synology NAS Disaster Recovery': '<i class="fas fa-angle-right" style="color: #f72585; margin-right: 6px;"></i> ប្រព័ន្ធសង្គ្រោះទិន្នន័យ Synology NAS',
    'Angular MVVM Web Applications': '<i class="fas fa-angle-right" style="color: #c77dff; margin-right: 6px;"></i> កម្មវិធីវេបសាយ Angular MVVM',
    'n8n AI Automation & Alerting': '<i class="fas fa-angle-right" style="color: #ffb703; margin-right: 6px;"></i> ស្វ័យប្រវត្តិកម្ម AI n8n & ការជូនដំណឹង',
    'Some rights reserved.': 'រក្សាសិទ្ធិគ្រប់យ៉ាង។',

    // --- Categories Page ---
    'Technical Domains & Categories': 'ផ្នែកជំនាញបច្ចេកទេស និងប្រភេទការងារ',
    'Core specializations, engineering domains, and enterprise solutions by Sambath Mongkol':
      'ជំនាញឯកទេសស្នូល ផ្នែកវិស្វកម្ម និងដំណោះស្រាយសហគ្រាសដោយ <strong>សម្បត្តិ មង្គល</strong>',
    '6 Core Domains': '<i class="fas fa-layer-group"></i> ៦ ផ្នែកស្នូល',
    'Production Ready': '<i class="fas fa-check-circle"></i> រួចរាល់សម្រាប់ប្រតិបត្តិការ',
    'Systems Administration & Active Directory': 'ការគ្រប់គ្រងប្រព័ន្ធ & Active Directory',
    'Enterprise Windows Server Infrastructure': 'ហេដ្ឋារចនាសម្ព័ន្ធ Windows Server សហគ្រាស',
    '4 Implementations': '៤ គម្រោងអនុវត្ត',
    'Management of Windows Server environments, Active Directory Domain Services (AD DS), Group Policy Objects (GPO), user access control, security policies, and high-uptime client workstation support across 3 companies.':
      'ការគ្រប់គ្រងបរិស្ថាន Windows Server, Active Directory (AD DS), គោលនយោបាយ Group Policy (GPO), ការត្រួតពិនិត្យសិទ្ធិអ្នកប្រើប្រាស់ និងការគាំទ្រកុំព្យូទ័រការងារប្រកបដោយស្ថិរភាពខ្ពស់នៅក្នុងក្រុមហ៊ុនចំនួន ៣។',
    'Network Engineering & MikroTik': 'វិស្វកម្មបណ្ដាញ & MikroTik',
    'Corporate LAN, WAN & Bandwidth Routing': 'បណ្ដាញក្រុមហ៊ុន LAN, WAN & ការគ្រប់គ្រងល្បឿន',
    '3 Network Architectures': '៣ ស្ថាបត្យកម្មបណ្ដាញ',
    'Deploying and maintaining network backbones: MikroTik RouterOS configuration, IP routing and subnet planning, switches, managed routers, enterprise Wi-Fi access points, and remote CLI management.':
      'ការដំឡើង និងថែទាំបណ្ដាញស្នូល៖ ការកំណត់រចនាសម្ព័ន្ធ MikroTik RouterOS, ការរៀបចំ IP Routing & Subnet, Switches, Routers, Wi-Fi សហគ្រាស និងការគ្រប់គ្រងពីចម្ងាយតាម CLI។',
    'Full-Stack & Front-end Web Development': 'ការអភិវឌ្ឍន៍វេបសាយ Full-Stack & Front-end',
    'Modern Web Apps with Angular MVVM & APIs': 'កម្មវិធីវេបសាយទំនើបជាមួយ Angular MVVM & APIs',
    '4 Web Applications': '៤ កម្មវិធីវេបសាយ',
    'End-to-end web engineering: building responsive single-page applications with Angular (MVVM pattern), reusable components, reactive data binding, backend API integration, PHP, Laravel, and database schemas.':
      'វិស្វកម្មវេបសាយពេញលេញ៖ ការបង្កើតកម្មវិធី Single-Page ជាមួយ Angular (MVVM), Components អាចប្រើឡើងវិញ, ការតភ្ជាប់ Backend API, PHP, Laravel និងរចនាសម្ព័ន្ធមូលដ្ឋានទិន្នន័យ។',
    'IT Automation & AI Integration': 'ស្វ័យប្រវត្តិកម្ម IT & ការបញ្ចូលបច្ចេកវិទ្យា AI',
    'n8n Pipelines, PowerShell & ChatGPT APIs': 'ប្រព័ន្ធ n8n, PowerShell & ChatGPT APIs',
    '2 Automation Stacks': '២ ប្រព័ន្ធស្វ័យប្រវត្តិកម្ម',
    'Integrating modern workflow automation with n8n and AI tools (ChatGPT, OpenAI APIs) to automate ticket triage, server health monitors, instant Telegram/Email alerts, and custom PowerShell administrative scripts.':
      'ការភ្ជាប់ប្រព័ន្ធស្វ័យប្រវត្តិកម្មទំនើបជាមួយ n8n និងឧបករណ៍ AI (ChatGPT, OpenAI APIs) ដើម្បីគ្រប់គ្រង Ticket, តាមដានសុខភាពម៉ាស៊ីនមេ, ជូនដំណឹង Telegram/Email និងស្គ្រីប PowerShell។',
    'Enterprise Software & NAS Storage': 'សូហ្វវែរសហគ្រាស & ប្រព័ន្ធផ្ទុក NAS',
    'QuickBooks Multi-user & Synology Disaster Recovery': 'QuickBooks អ្នកប្រើប្រាស់ច្រើន & ការសង្គ្រោះទិន្នន័យ Synology',
    '3 Solutions': '៣ ដំណោះស្រាយ',
    'Specialized deployment of QuickBooks Multi-user Database Server for multi-client concurrent accounting access, plus Synology NAS automated backup systems with scheduled retention and disaster recovery protocols.':
      'ការដំឡើងម៉ាស៊ីនមេ QuickBooks អ្នកប្រើប្រាស់ច្រើនសម្រាប់ការងារគណនេយ្យព្រមគ្នា និងប្រព័ន្ធបម្រុងទុកស្វ័យប្រវត្តិ Synology NAS ជាមួយនីតិវិធីសង្គ្រោះគ្រាអាសន្ន។',
    'Graphic Design & Visual Branding': 'ការរចនាក្រាហ្វិក & អត្តសញ្ញាណម៉ាក',
    'Creative Media, Banners & Brand Standards': 'មាតិកាច្នៃប្រឌិត បដា & ស្តង់ដារម៉ាកយីហោ',
    '3 Creative Portfolios': '៣ ស្នាដៃរចនា',
    'Professional digital graphics created at Step Forward International School and Cambodia Book Fair, utilizing Adobe Photoshop, Adobe Illustrator, and CorelDRAW to establish clean visual identities.':
      'ស្នាដៃក្រាហ្វិកវិជ្ជាជីវៈនៅសាលាអន្តរជាតិ Step Forward និងពិព័រណ៍សៀវភៅកម្ពុជា ដោយប្រើប្រាស់ Adobe Photoshop, Illustrator និង CorelDRAW។',

    // --- Tags Page ---
    'Skills & Technology Tags': 'ជំនាញ និងស្លាកបច្ចេកវិទ្យា',
    "Explore Sambath Mongkol's complete technical stack across systems, networking, web, and automation":
      'ស្វែងយល់ពីជំនាញបច្ចេកវិទ្យាពេញលេញរបស់ សម្បត្តិ មង្គល ផ្នែកប្រព័ន្ធ បណ្ដាញ វេបសាយ និងស្វ័យប្រវត្តិកម្ម',

    // --- Archives Page ---
    'Career & Project Archives': 'ប្រវត្តិអាជីព និងស្នាដៃគម្រោង',
    'Chronological timeline of enterprise implementations, engineering milestones & achievements by Sambath Mongkol':
      'កាលប្បវត្តិនៃការអនុវត្តគម្រោងសហគ្រាស ស្នាដៃវិស្វកម្ម និងសមិទ្ធផលរបស់ <strong>សម្បត្តិ មង្គល</strong>',
    '2022 – 2026': '<i class="fas fa-history"></i> ២០២២ – ២០២៦',
    '12+ Key Milestones': '<i class="fas fa-check-double"></i> ១២+ សមិទ្ធផលសំខាន់ៗ',
    'Enterprise IT & AI Automation': 'ប្រព័ន្ធ IT សហគ្រាស & AI',
    'Sun Computer Solution & RUPP': 'Sun Computer Solution & RUPP',
    'Angular Web & Full-Stack': 'វេបសាយ Angular & Full-Stack',
    'Graphic Design & Foundations': 'រចនាក្រាហ្វិក & មូលដ្ឋានគ្រឹះ',
    'Enterprise Infrastructure & Advanced Automation': 'ហេដ្ឋារចនាសម្ព័ន្ធសហគ្រាស & ស្វ័យប្រវត្តិកម្មកម្រិតខ្ពស់',
    'QuickBooks Enterprise Multi-User Database Server Deployment': 'ការដំឡើងម៉ាស៊ីនមេ QuickBooks Enterprise អ្នកប្រើប្រាស់ច្រើន',
    'n8n Intelligent Automation & AI Alerting Integration': 'ការភ្ជាប់ស្វ័យប្រវត្តិកម្មឆ្លាតវៃ n8n & ការជូនដំណឹង AI',
    'Synology NAS Automated Multi-Tier Backup & Disaster Recovery Architecture': 'ស្ថាបត្យកម្មបម្រុងទុកស្វ័យប្រវត្តិ Synology NAS & សង្គ្រោះទិន្នន័យ',
    'MikroTik RouterOS Network Optimization & Corporate Wi-Fi Upgrade': 'ការបង្កើនប្រសិទ្ធភាពបណ្ដាញ MikroTik RouterOS & Wi-Fi ក្រុមហ៊ុន',
    'Joined Sun Computer Solution — Technical Support Specialist': 'ចូលបម្រើការងារនៅ Sun Computer Solution — អ្នកជំនាញ IT Support',
    'Active Directory Domain Services & GPO Infrastructure Implementation': 'ការអនុវត្តប្រព័ន្ធ Active Directory (AD DS) & គោលនយោបាយ GPO',
    'Royal University of Phnom Penh (RUPP) — Computer Science Studies': 'សាកលវិទ្យាល័យភូមិន្ទភ្នំពេញ (RUPP) — ការសិក្សាវិទ្យាសាស្ត្រកុំព្យូទ័រ',
    'Web Engineering & Front-end Development': 'វិស្វកម្មវេបសាយ & ការអភិវឌ្ឍន៍ Front-end',
    'Programmer at Professional AI Training & Software Development Center': 'អ្នកសរសេរកម្មវិធីនៅមជ្ឈមណ្ឌលបណ្ដុះបណ្ដាល AI & អភិវឌ្ឍន៍សូហ្វវែរ',
    'ETEC Center — Front-End & Back-End Web Development Graduate': 'មជ្ឈមណ្ឌល ETEC — បញ្ចប់វគ្គអភិវឌ្ឍន៍វេបសាយ Front-End & Back-End',
    'Visual Design & Technical Foundations': 'ការរចនាក្រាហ្វិក & មូលដ្ឋានបច្ចេកទេស',
    'Graphic Designer at Step Forward International School': 'អ្នករចនាក្រាហ្វិកនៅសាលាអន្តរជាតិ Step Forward',
    'Cambodia Book Fair — Event Support & Digital Media Volunteer': 'ពិព័រណ៍សៀវភៅកម្ពុជា — អ្នកស្ម័គ្រចិត្តគាំទ្រព្រឹត្តិការណ៍ & ឌីជីថល',
    'Engineered and deployed a dedicated multi-user accounting environment using QuickBooks Database Server Manager on Windows Server, enabling simultaneous secure access for finance workstations across shared network paths.':
      'រៀបចំ និងដំឡើងប្រព័ន្ធគណនេយ្យអ្នកប្រើប្រាស់ច្រើនដោយប្រើ QuickBooks Database Server Manager លើ Windows Server អនុញ្ញាតឱ្យកុំព្យូទ័រផ្នែកហិរញ្ញវត្ថុចូលប្រើព្រមគ្នាដោយសុវត្ថិភាព។',
    'Built end-to-end automation pipelines connecting n8n workflows with ChatGPT APIs to streamline IT support ticketing, server health status probes, and instant notifications to management.':
      'បង្កើតប្រព័ន្ធស្វ័យប្រវត្តិកម្មពេញលេញភ្ជាប់ n8n ជាមួយ ChatGPT API ដើម្បីគ្រប់គ្រង IT Support Ticket, តាមដានសុខភាពម៉ាស៊ីនមេ និងផ្ញើការជូនដំណឹងភ្លាមៗជូនថ្នាក់ដឹកនាំ។',
    'Architected enterprise NAS backup procedures: automated scheduled replication, access permissions, shared folder ACLs, snapshot retention, and systematic disaster recovery verification.':
      'រៀបចំនីតិវិធីបម្រុងទុកទិន្នន័យ NAS កម្រិតសហគ្រាស៖ ការចម្លងទិន្នន័យស្វ័យប្រវត្តិតាមកាលវិភាគ, សិទ្ធិចូលប្រើ ACL, ការរក្សាទុក Snapshot និងការផ្ទៀងផ្ទាត់សង្គ្រោះគ្រាអាសន្ន។',
    'Configured enterprise MikroTik routers, IP routing tables, bandwidth queues, VLAN segmentation, and commercial TP-Link access points to eliminate network congestion.':
      'កំណត់រចនាសម្ព័ន្ធរ៉ោតទ័រ MikroTik សហគ្រាស, តារាង IP Routing, Bandwidth Queues, ការបែងចែក VLAN និង Access Points ដើម្បីបំបាត់ការកកស្ទះបណ្ដាញ។',
    'Took ownership of full-lifecycle IT support, hardware rollouts, Windows Server AD maintenance, and emergency response across 3 commercial enterprises with top customer satisfaction ratings.':
      'ទទួលបន្ទុកគាំទ្រ IT ពេញលេញ ការដំឡើងឧបករណ៍ ការថែទាំ Windows Server AD និងការឆ្លើយតបបន្ទាន់សម្រាប់ក្រុមហ៊ុនពាណិជ្ជកម្មចំនួន ៣ ដោយទទួលបានការពេញចិត្តខ្ពស់។',
    'Configured enterprise Domain Controllers, structured Organizational Units (OUs), applied Group Policies for desktop security, and provisioned user access control matrices.':
      'ដំឡើង Domain Controllers កម្រិតសហគ្រាស, រៀបចំ Organizational Units (OUs), អនុវត្ត Group Policies សម្រាប់សុវត្ថិភាពកុំព្យូទ័រ និងកំណត់សិទ្ធិអ្នកប្រើប្រាស់។',
    "Advancing core computer science knowledge at Cambodia's premier public university: data structures, relational database management, operating systems, and computer networks.":
      'ពង្រីកចំណេះដឹងស្នូលផ្នែកវិទ្យាសាស្ត្រកុំព្យូទ័រនៅសាកលវិទ្យាល័យរដ្ឋឈានមុខគេរបស់កម្ពុជា៖ រចនាសម្ព័ន្ធទិន្នន័យ, ការគ្រប់គ្រងមូលដ្ឋានទិន្នន័យ, ប្រព័ន្ធប្រតិបត្តិការ និងបណ្ដាញកុំព្យូទ័រ។',
    'Developed client-facing single-page web applications using the Angular framework under MVVM architecture, built custom reusable UI components, and integrated data communication via REST APIs.':
      'អភិវឌ្ឍន៍កម្មវិធីវេបសាយ Single-Page ដោយប្រើ Angular Framework តាមស្ថាបត្យកម្ម MVVM, បង្កើត UI Components និងភ្ជាប់ទិន្នន័យតាមរយៈ REST APIs។',
    'Intensive training in full-stack web technologies: HTML5, CSS3, JavaScript, Bootstrap, jQuery, PHP, Laravel framework, and SQL relational databases.':
      'វគ្គបណ្ដុះបណ្ដាលស៊ីជម្រៅផ្នែកវេបសាយ Full-Stack៖ HTML5, CSS3, JavaScript, Bootstrap, jQuery, PHP, Laravel Framework និងមូលដ្ឋានទិន្នន័យ SQL។',
    'Produced corporate branding assets, event banners, and marketing graphics with Adobe Creative Suite (Photoshop, Illustrator, CorelDRAW).':
      'ផលិតក្រាហ្វិកអត្តសញ្ញាណម៉ាក បដាព្រឹត្តិការណ៍ និងផ្ទាំងផ្សព្វផ្សាយទីផ្សារដោយប្រើ Adobe Photoshop, Illustrator និង CorelDRAW។',
    "Volunteered in digital content creation, signage designs, and technical on-site coordination for Cambodia's prominent national book fair.":
      'ស្ម័គ្រចិត្តផលិតមាតិកាឌីជីថល រចនាស្លាកសញ្ញា និងសម្របសម្រួលបច្ចេកទេសផ្ទាល់នៅពិព័រណ៍សៀវភៅថ្នាក់ជាតិកម្ពុជា។',

    // --- 404 Page ---
    'Endpoint Not Found or Restricted': 'រកមិនឃើញទំព័រ ឬត្រូវបានកម្រិតសិទ្ធិចូលប្រើ',
    "The resource you requested does not exist or is protected by Sambath Mongkol's Zero-Trust Web Security Shield.":
      'ធនធានដែលអ្នកស្នើសុំមិនមានទេ ឬកំពុងត្រូវបានការពារដោយ <strong>ប្រព័ន្ធការពារសុវត្ថិភាព Zero-Trust របស់ សម្បត្តិ មង្គល</strong>។',
    'Return to Secure Portfolio': '<i class="fas fa-home"></i> ត្រឡប់ទៅទំព័រដើមសុវត្ថិភាព'
  };

  // Attribute Translations (placeholder, title, aria-label)
  const ATTR_KM = {
    'Search skills, projects, experience, or commands (WAF protected)...': 'ស្វែងរកជំនាញ គម្រោង បទពិសោធន៍ ឬពាក្យបញ្ជា (ការពារដោយ WAF)...',
    'Type a command (e.g. help, whoami, security, waf-test)...': 'វាយពាក្យបញ្ជា (ឧ. help, whoami, security, waf-test, lang)...',
    'Your Name / Company *': 'ឈ្មោះរបស់អ្នក / ក្រុមហ៊ុន *',
    'Subject (e.g. IT Infrastructure Support / Web Development Project) *': 'ប្រធានបទ (ឧ. គាំទ្រប្រព័ន្ធ IT / គម្រោងអភិវឌ្ឍន៍វេបសាយ) *',
    'Write your message here (Protected against XSS/SQLi by Zero-Trust WAF)...': 'សរសេរសាររបស់អ្នកនៅទីនេះ (ការពារប្រឆាំង XSS/SQLi ដោយ Zero-Trust WAF)...',
    'Quick Search & Command Palette (Ctrl+K)': 'ស្វែងរករហ័ស & ផ្ទាំងបញ្ជា (Ctrl+K)',
    'Zero-Trust Security Shield Status': 'ស្ថានភាពប្រព័ន្ធការពារសុវត្ថិភាព Zero-Trust',
    'Toggle Light/Dark Mode': 'ប្ដូរពណ៌ផ្ទៃ ភ្លឺ / ងងឹត',
    'Click for Light Mode': 'ចុចដើម្បីប្ដូរទៅផ្ទៃភ្លឺ',
    'Click for Dark Mode': 'ចុចដើម្បីប្ដូរទៅផ្ទៃងងឹត'
  };

  // Pure short UI text tokens (Topbar & buttons)
  const TEXT_KM = {
    'Search / Cmd': 'ស្វែងរក / បញ្ជា',
    'Shield:': 'ការពារ៖',
    'HOME': 'ទំព័រដើម',
    'Home': 'ទំព័រដើម',
    'CATEGORIES': 'ប្រភេទជំនាញ',
    'Categories': 'ប្រភេទជំនាញ',
    'TAGS': 'បច្ចេកវិទ្យា',
    'Tags': 'បច្ចេកវិទ្យា',
    'ARCHIVES': 'ប្រវត្តិស្នាដៃ',
    'Archives': 'ប្រវត្តិស្នាដៃ',
    'ABOUT': 'អំពីខ្ញុំ & CV',
    'About': 'អំពីខ្ញុំ & CV'
  };

  // ============================================================================
  // KHMER GOOGLE FONT LOADER (Kantumruy Pro + Noto Sans Khmer)
  // ============================================================================
  function ensureKhmerFontsLoaded() {
    if (document.getElementById('mongkol-khmer-fonts')) return;
    const link = document.createElement('link');
    link.id = 'mongkol-khmer-fonts';
    link.rel = 'stylesheet';
    link.href = 'https://fonts.googleapis.com/css2?family=Kantumruy+Pro:wght@400;500;600;700&family=Noto+Sans+Khmer:wght@400;600;700;800&display=swap';
    document.head.appendChild(link);
  }

  // ============================================================================
  // TRANSLATION EXECUTION ENGINE (LOSSLESS SNAPSHOT BASED)
  // ============================================================================
  function translateContainer(rootEl, lang) {
    if (!rootEl || !rootEl.querySelectorAll) return;

    // 1. Restore or Translate Attributes (placeholder, title)
    const attrEls = rootEl.querySelectorAll('[placeholder], [title]');
    attrEls.forEach(function (el) {
      if (!originalAttrMap.has(el)) {
        originalAttrMap.set(el, {
          placeholder: el.getAttribute('placeholder'),
          title: el.getAttribute('title')
        });
        trackedAttrEls.add(el);
      }
      const orig = originalAttrMap.get(el);
      if (lang === 'km') {
        if (orig.placeholder && ATTR_KM[orig.placeholder]) {
          el.setAttribute('placeholder', ATTR_KM[orig.placeholder]);
        }
        if (orig.title && ATTR_KM[orig.title]) {
          el.setAttribute('title', ATTR_KM[orig.title]);
        }
      } else {
        if (orig.placeholder !== null) el.setAttribute('placeholder', orig.placeholder);
        if (orig.title !== null) el.setAttribute('title', orig.title);
      }
    });

    // 2. Restore or Translate Block Elements with Exact Normalized Match
    const selector = 'h1, h2, h3, h4, h5, h6, p, li, span, strong, a, button, small, option, div';
    const candidates = rootEl.querySelectorAll(selector);

    if (lang === 'en') {
      trackedHtmlEls.forEach(function (el) {
        if (rootEl === document || rootEl.contains(el)) {
          if (originalHtmlMap.has(el)) {
            el.innerHTML = originalHtmlMap.get(el);
          }
        }
      });
      trackedTextNodes.forEach(function (node) {
        if (originalTextMap.has(node)) {
          node.nodeValue = originalTextMap.get(node);
        }
      });
      return;
    }

    // Apply Khmer (lang === 'km')
    candidates.forEach(function (el) {
      if (el.closest('#mongkol-lang-switcher') || el.closest('#mongkol-term-output')) return;
      // Avoid replacing large container divs that hold multiple block children
      if (el.tagName === 'DIV' && el.querySelector('p, h1, h2, h3, h4, ul, div, form, button')) return;

      // Preserve icons & child spans on navigation links and interactive controls
      if ((el.tagName === 'A' || el.tagName === 'BUTTON') && el.querySelector('span')) return;

      const rawText = norm(el.textContent);
      if (!rawText) return;

      const replacement = EXACT_HTML_KM[rawText];
      if (replacement) {
        // Never wipe out an existing FontAwesome/SVG icon when replacement is plain text
        if (el.querySelector('i.fa, i.fas, i.fab, i.far, svg') && !replacement.includes('<i')) {
          return;
        }
        if (!originalHtmlMap.has(el)) {
          originalHtmlMap.set(el, el.innerHTML);
          trackedHtmlEls.add(el);
        }
        el.innerHTML = replacement;
      }
    });

    // 3. Fallback TextNode translation for short inline UI spans/labels
    const walker = document.createTreeWalker(rootEl === document ? document.body : rootEl, NodeFilter.SHOW_TEXT, null);
    let node;
    while ((node = walker.nextNode())) {
      if (!node.parentElement) continue;
      if (node.parentElement.closest('script, style, #mongkol-lang-switcher, #mongkol-term-output')) continue;
      const t = norm(node.nodeValue);
      if (t && TEXT_KM[t]) {
        if (!originalTextMap.has(node)) {
          originalTextMap.set(node, node.nodeValue);
          trackedTextNodes.add(node);
        }
        node.nodeValue = node.nodeValue.replace(t, TEXT_KM[t]);
      }
    }
  }

  // ============================================================================
  // LANGUAGE SWITCHER PILL UI (TOPBAR OR FLOATING FALLBACK)
  // ============================================================================
  function updateSwitcherUI(lang) {
    const enBtn = document.getElementById('lang-btn-en');
    const kmBtn = document.getElementById('lang-btn-km');
    if (enBtn && kmBtn) {
      if (lang === 'km') {
        kmBtn.classList.add('active-lang');
        enBtn.classList.remove('active-lang');
        kmBtn.setAttribute('aria-pressed', 'true');
        enBtn.setAttribute('aria-pressed', 'false');
      } else {
        enBtn.classList.add('active-lang');
        kmBtn.classList.remove('active-lang');
        enBtn.setAttribute('aria-pressed', 'true');
        kmBtn.setAttribute('aria-pressed', 'false');
      }
    }
  }

  function injectLanguageSwitcher() {
    if (document.getElementById('mongkol-lang-switcher')) return;

    const switcher = document.createElement('div');
    switcher.id = 'mongkol-lang-switcher';
    switcher.className = 'mongkol-lang-pill no-print';
    switcher.setAttribute('role', 'group');
    switcher.setAttribute('aria-label', 'Language Switcher (Alt+L)');
    switcher.title = 'Switch Language: English / ភាសាខ្មែរ (Alt + L)';
    switcher.innerHTML =
      '<button type="button" id="lang-btn-en" class="lang-seg-btn active-lang" data-lang="en">EN</button>' +
      '<button type="button" id="lang-btn-km" class="lang-seg-btn" data-lang="km">ខ្មែរ</button>';

    const topbarActions = document.getElementById('mongkol-topbar-actions');
    const topbar = document.getElementById('topbar');

    if (topbarActions) {
      topbarActions.insertBefore(switcher, topbarActions.firstChild);
    } else if (topbar) {
      switcher.style.marginLeft = 'auto';
      topbar.appendChild(switcher);
    } else {
      // Fallback for 404.html or pages without topbar
      switcher.style.cssText = 'position:fixed;top:16px;right:16px;z-index:10040;';
      document.body.appendChild(switcher);
    }

    switcher.querySelectorAll('.lang-seg-btn').forEach(function (btn) {
      btn.addEventListener('click', function () {
        const targetLang = btn.getAttribute('data-lang');
        setLanguage(targetLang, true);
      });
    });

    updateSwitcherUI(currentLang);
  }

  function showLangToast(lang) {
    let container = document.getElementById('mongkol-security-toast-container');
    if (!container) {
      container = document.createElement('div');
      container.id = 'mongkol-security-toast-container';
      container.style.cssText = 'position:fixed;bottom:76px;right:20px;z-index:10050;display:flex;flex-direction:column;gap:8px;max-width:340px;';
      document.body.appendChild(container);
    }
    const toast = document.createElement('div');
    toast.style.cssText = 'background:rgba(15,23,42,0.96);backdrop-filter:blur(12px);color:#f8fafc;border:1px solid #00b4d8;border-left:4px solid #00b4d8;border-radius:10px;padding:10px 14px;font-size:0.86rem;box-shadow:0 10px 25px rgba(0,0,0,0.45);display:flex;align-items:center;gap:10px;transition:opacity 0.3s ease;';
    toast.innerHTML = lang === 'km'
      ? '<span style="font-size:1.1rem;">🇰🇭</span><div><strong>ភាសាខ្មែរ</strong> — បានបកប្រែគេហទំព័រទាំងមូលរួចរាល់ (Alt+L)</div>'
      : '<span style="font-size:1.1rem;">🇬🇧</span><div><strong>English</strong> — Full interface restored (Alt+L)</div>';
    container.appendChild(toast);
    setTimeout(function () {
      toast.style.opacity = '0';
      setTimeout(function () { toast.remove(); }, 300);
    }, 2600);
  }

  function setLanguage(lang, notify) {
    // Strict whitelist validation (Zero-Trust safe)
    const safeLang = lang === 'km' ? 'km' : 'en';
    currentLang = safeLang;

    if (safeLang === 'km') {
      ensureKhmerFontsLoaded();
    }

    document.documentElement.setAttribute('lang', safeLang);
    document.documentElement.setAttribute('data-lang', safeLang);
    try {
      localStorage.setItem(STORAGE_KEY, safeLang);
    } catch (_) {}

    // Always restore English first before applying Khmer so snapshots stay pure
    if (safeLang === 'en') {
      translateContainer(document, 'en');
    } else {
      translateContainer(document, 'en');
      translateContainer(document, 'km');
    }

    updateSwitcherUI(safeLang);

    // Dispatch event for security-shield.js / terminal / command palette
    window.dispatchEvent(new CustomEvent('mongkol:langchange', { detail: { lang: safeLang } }));

    if (notify) {
      showLangToast(safeLang);
    }
  }

  function detectInitialLanguage() {
    try {
      const params = new URLSearchParams(window.location.search);
      const urlLang = (params.get('lang') || '').toLowerCase();
      if (urlLang === 'km' || urlLang === 'en') return urlLang;
    } catch (_) {}

    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved === 'km' || saved === 'en') return saved;
    } catch (_) {}

    return 'en';
  }

  function init() {
    ensureKhmerFontsLoaded();
    currentLang = detectInitialLanguage();

    // Delay slightly if topbar actions are injected by security-shield.js on DOMContentLoaded
    injectLanguageSwitcher();
    setTimeout(function () {
      // Ensure switcher sits neatly inside #mongkol-topbar-actions if injected later
      const switcher = document.getElementById('mongkol-lang-switcher');
      const topbarActions = document.getElementById('mongkol-topbar-actions');
      if (switcher && topbarActions && !topbarActions.contains(switcher)) {
        switcher.style.marginLeft = '';
        topbarActions.insertBefore(switcher, topbarActions.firstChild);
      }
      setLanguage(currentLang, false);
    }, 60);

    // Keyboard shortcut: Alt + L to toggle Khmer <-> English
    document.addEventListener('keydown', function (e) {
      if (e.altKey && e.key && e.key.toLowerCase() === 'l') {
        e.preventDefault();
        setLanguage(currentLang === 'km' ? 'en' : 'km', true);
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Expose frozen public API
  window.MongkolI18n = Object.freeze({
    version: '3.0.0',
    getLanguage: function () { return currentLang; },
    setLanguage: function (lang) { setLanguage(lang, true); },
    toggle: function () { setLanguage(currentLang === 'km' ? 'en' : 'km', true); },
    translateElement: function (el) {
      if (currentLang === 'km' && el) {
        translateContainer(el, 'km');
      }
    }
  });
})();
