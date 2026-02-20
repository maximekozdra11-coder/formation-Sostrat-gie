// ===== FormateurPro — Main App =====

// ===== LocalStorage Helpers =====
function getSessions() {
  try { return JSON.parse(localStorage.getItem('fp_sessions') || '[]'); }
  catch { return []; }
}
function saveSessions(sessions) {
  localStorage.setItem('fp_sessions', JSON.stringify(sessions));
}

// ===== Toast =====
let toastTimer = null;
function showToast(message) {
  let toast = document.getElementById('toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'toast';
    toast.className = 'toast';
    document.body.appendChild(toast);
  }
  toast.textContent = message;
  toast.classList.add('show');
  if (toastTimer) clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), 2800);
}

// ===== Routing =====
const PAGES = ['home', 'toolbox', 'journal', 'coaching', 'quiz'];
let currentPage = 'home';

function navigate(page) {
  if (!PAGES.includes(page)) page = 'home';
  currentPage = page;

  // Update nav
  document.querySelectorAll('.nav-item').forEach(el => {
    el.classList.toggle('active', el.dataset.page === page);
  });

  // Render page
  renderPage(page);

  // Update URL hash
  history.replaceState(null, '', '#' + page);
}

function renderPage(page) {
  PAGES.forEach(p => {
    const el = document.getElementById(p);
    if (el) el.classList.remove('active');
  });
  const el = document.getElementById(page);
  if (!el) return;
  el.classList.add('active');

  switch (page) {
    case 'home':
      el.innerHTML = renderHome();
      break;
    case 'toolbox':
      el.innerHTML = renderToolbox();
      break;
    case 'journal':
      el.innerHTML = renderJournal();
      break;
    case 'coaching':
      el.innerHTML = renderCoaching();
      break;
    case 'quiz':
      el.innerHTML = renderQuiz();
      break;
  }
}

// ===== PWA Service Worker =====
function registerServiceWorker() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js')
      .then(() => console.log('Service Worker registered'))
      .catch(err => console.warn('SW registration failed:', err));
  }
}

// ===== Init =====
document.addEventListener('DOMContentLoaded', () => {
  registerServiceWorker();

  // Determine initial page from hash
  const hash = location.hash.replace('#', '');
  const initial = PAGES.includes(hash) ? hash : 'home';
  navigate(initial);

  // Handle browser back/forward
  window.addEventListener('popstate', () => {
    const h = location.hash.replace('#', '');
    navigate(PAGES.includes(h) ? h : 'home');
  });
});
