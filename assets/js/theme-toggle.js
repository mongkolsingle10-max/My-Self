/**
 * Sambath Mongkol - Modern Smooth Dark/Light Mode Switcher
 */
(function() {
  const sunSvg = '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ffb703" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" style="filter: drop-shadow(0 0 6px rgba(255, 183, 3, 0.6));"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>';
  
  const moonSvg = '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#00b4d8" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" style="filter: drop-shadow(0 0 6px rgba(0, 180, 216, 0.6));"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>';

  function applyTheme(theme) {
    document.documentElement.setAttribute('data-bs-theme', theme);
    document.documentElement.dataset.bsTheme = theme;
    localStorage.setItem('theme', theme);

    const btn = document.getElementById('mode-toggle');
    if (btn) {
      btn.innerHTML = theme === 'dark' ? sunSvg : moonSvg;
      btn.setAttribute('title', theme === 'dark' ? 'Click for Light Mode' : 'Click for Dark Mode');
      btn.style.transform = 'rotate(360deg)';
      setTimeout(() => { btn.style.transform = ''; }, 300);
    }
  }

  function setupToggle() {
    const saved = localStorage.getItem('theme') || document.documentElement.dataset.bsTheme || 'dark';
    applyTheme(saved);

    const btn = document.getElementById('mode-toggle');
    if (btn) {
      btn.onclick = function(e) {
        e.preventDefault();
        e.stopPropagation();
        const current = document.documentElement.dataset.bsTheme || 'dark';
        const next = current === 'dark' ? 'light' : 'dark';
        applyTheme(next);
      };
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setupToggle);
  } else {
    setupToggle();
  }
})();
