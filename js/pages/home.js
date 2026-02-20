// ===== Home Page =====
function renderHome() {
  const sessions = getSessions();
  const avgRating = sessions.length
    ? (sessions.reduce((s, e) => s + (e.rating || 0), 0) / sessions.length).toFixed(1)
    : '—';
  const challenge = DAILY_CHALLENGES[new Date().getDate() % DAILY_CHALLENGES.length];
  const showNotif = sessions.length >= 3 && !localStorage.getItem('fp_notif_dismissed');

  return `
    <div class="gradient-banner">
      <div style="font-size:0.8rem;opacity:0.85;font-weight:600;text-transform:uppercase;letter-spacing:0.07em;margin-bottom:0.25rem;">FormateurPro</div>
      <h1 style="color:white;font-size:1.5rem;margin-bottom:0.3rem;">Bonjour, Formateur·rice ! 👋</h1>
      <p style="opacity:0.88;font-size:0.9rem;">Prêt·e à faire la différence aujourd'hui ?</p>
    </div>

    ${showNotif ? `
    <div class="notif-banner" id="notifBanner">
      <span class="notif-icon">🎉</span>
      <span>Bravo pour vos animations ce mois-ci ! Et si on faisait une séance de supervision pour passer au niveau supérieur ?</span>
      <button class="notif-close" onclick="dismissNotif()">✕</button>
    </div>` : ''}

    <div class="stats-row">
      <div class="stat-card">
        <div class="stat-value">${sessions.length}</div>
        <div class="stat-label">Animations<br>journalisées</div>
      </div>
      <div class="stat-card">
        <div class="stat-value">${avgRating}</div>
        <div class="stat-label">Note<br>moyenne</div>
      </div>
    </div>

    <div class="challenge-card">
      <div class="challenge-label">⚡ Défi du jour</div>
      <div class="challenge-text">${challenge}</div>
    </div>

    <div class="section-title">
      <span class="icon">🗂️</span>
      <h2>Accès rapide</h2>
    </div>
    <div class="quick-grid">
      <div class="quick-card" onclick="navigate('toolbox')">
        <div class="qc-icon">🧰</div>
        <div class="qc-title">Boîte à Outils</div>
        <div class="qc-sub">Fiches, séquences, checklist</div>
      </div>
      <div class="quick-card" onclick="navigate('journal')">
        <div class="qc-icon">📓</div>
        <div class="qc-title">Journal de Bord</div>
        <div class="qc-sub">Auto-évaluation & graphiques</div>
      </div>
      <div class="quick-card" onclick="navigate('coaching')">
        <div class="qc-icon">⭐</div>
        <div class="qc-title">Coaching</div>
        <div class="qc-sub">SOS Coach & supervision</div>
      </div>
      <div class="quick-card" onclick="navigate('quiz')">
        <div class="qc-icon">❓</div>
        <div class="qc-title">Diagnostic</div>
        <div class="qc-sub">Quiz personnalisé</div>
      </div>
    </div>

    ${sessions.length > 0 ? `
    <div class="card" style="background:linear-gradient(135deg,#F3F0FF,#EEF0FF);border-color:rgba(107,78,255,0.2);">
      <div style="font-size:0.75rem;font-weight:700;color:var(--primary);text-transform:uppercase;letter-spacing:0.06em;margin-bottom:0.3rem;">💡 Astuce</div>
      <p style="font-size:0.88rem;color:var(--text);">Vous avez enregistré <strong>${sessions.length} animation${sessions.length > 1 ? 's' : ''}</strong>. Consultez vos graphiques de progression pour identifier vos tendances !</p>
      <button class="btn btn-ghost btn-sm mt-1" onclick="navigate('journal');setTimeout(()=>document.getElementById('tabStats')?.click(),200)">Voir mes graphiques →</button>
    </div>` : `
    <div class="card" style="text-align:center;padding:1.5rem;">
      <div style="font-size:2rem;margin-bottom:0.5rem;">🌱</div>
      <p style="font-size:0.88rem;color:var(--text-muted);">Commencez votre journal en enregistrant votre première animation !</p>
      <button class="btn btn-primary btn-sm mt-1" onclick="navigate('journal')">Commencer →</button>
    </div>`}
  `;
}

function dismissNotif() {
  localStorage.setItem('fp_notif_dismissed', '1');
  const el = document.getElementById('notifBanner');
  if (el) el.remove();
}
