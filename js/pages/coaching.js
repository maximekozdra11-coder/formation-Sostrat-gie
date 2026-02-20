// ===== Coaching Page =====
function renderCoaching() {
  return `
    <div class="coaching-hero">
      <div class="hero-icon">🆘</div>
      <h2>SOS Coach</h2>
      <p>Vous faites face à une situation pédagogique complexe ? Réservez une session flash de 30 minutes avec votre coach.</p>
      <div class="coaching-price">⚡ 30 min — Séance flash</div>
    </div>

    <div class="card" style="text-align:center;margin-bottom:1rem;">
      <p style="font-size:0.9rem;color:var(--text-muted);margin-bottom:1rem;">Décrivez votre situation et réservez directement par email. Réponse sous 2h en jours ouvrés.</p>
      <a href="mailto:coach@formateurpro.fr?subject=Demande%20SOS%20Coach&body=Bonjour%2C%0A%0AJe%20souhaite%20r%C3%A9server%20une%20session%20flash%20de%2030%20minutes.%0A%0ASituation%20%3A%20%5BD%C3%A9crivez%20votre%20situation%20ici%5D%0A%0AMerci%20!"
         class="btn btn-accent btn-full">
        📧 Réserver ma session SOS
      </a>
    </div>

    <div class="section-title">
      <span class="icon">📅</span>
      <h2>Calendrier de supervision</h2>
    </div>

    <div class="card">
      <p style="font-size:0.82rem;color:var(--text-muted);margin-bottom:1rem;">Rejoignez nos sessions de supervision collective pour partager vos expériences et monter en compétences.</p>
      ${SUPERVISION_SESSIONS.map(s => renderCalendarItem(s)).join('')}
    </div>

    <div class="section-title" style="margin-top:0.5rem;">
      <span class="icon">💡</span>
      <h2>Pourquoi le coaching ?</h2>
    </div>

    <div class="card" style="background:linear-gradient(135deg,#F3F0FF,#EEF0FF);border-color:rgba(107,78,255,0.15);">
      ${[
        { icon: '🎯', title: 'Diagnostic personnalisé', text: 'Identifiez vos axes de développement prioritaires.' },
        { icon: '💪', title: 'Montée en compétences', text: 'Travaillez des situations concrètes de votre pratique.' },
        { icon: '🌱', title: 'Accompagnement continu', text: 'Évoluez à votre rythme avec un suivi bienveillant.' }
      ].map(b => `
        <div style="display:flex;gap:0.75rem;align-items:flex-start;margin-bottom:0.85rem;">
          <span style="font-size:1.4rem;flex-shrink:0;">${b.icon}</span>
          <div>
            <div style="font-weight:700;font-size:0.9rem;margin-bottom:0.15rem;">${b.title}</div>
            <div style="font-size:0.82rem;color:var(--text-muted);">${b.text}</div>
          </div>
        </div>
      `).join('')}
      <a href="mailto:coach@formateurpro.fr?subject=Diagnostic%20personnalis%C3%A9&body=Bonjour%2C%0A%0AJe%20souhaite%20un%20diagnostic%20personnalis%C3%A9%20de%20ma%20pratique%20de%20formateur."
         class="btn btn-primary btn-sm btn-full" style="margin-top:0.25rem;">
        📬 Me contacter pour un diagnostic
      </a>
    </div>
  `;
}

function renderCalendarItem(session) {
  return `
    <div class="calendar-item">
      <div class="calendar-date">
        <div class="cal-day">${session.day}</div>
        <div class="cal-month">${session.month}</div>
      </div>
      <div class="calendar-info">
        <div class="calendar-title">${session.title}</div>
        <div class="calendar-detail">${session.date} à ${session.time}</div>
      </div>
      <div>
        <div class="calendar-platform">${session.platform}</div>
        <a href="mailto:coach@formateurpro.fr?subject=Inscription%20${encodeURIComponent(session.title)}&body=Bonjour%2C%20je%20souhaite%20m'inscrire%20%C3%A0%20la%20session%20${encodeURIComponent(session.title)}%20du%20${encodeURIComponent(session.date)}."
           class="btn btn-ghost btn-sm" style="margin-top:4px;padding:0.3rem 0.6rem;font-size:0.72rem;">
          S'inscrire
        </a>
      </div>
    </div>
  `;
}
