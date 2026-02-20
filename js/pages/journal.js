// ===== Journal Page =====
let activeJournalTab = 'form';
let chartRating = null;
let chartEnergy = null;

// ===== Form State =====
let formRating  = 0;
let formEnergy  = 5;

function renderJournal() {
  return `
    <div class="section-title">
      <span class="icon">📓</span>
      <h2>Journal de Bord</h2>
    </div>
    <div class="tabs">
      <button class="tab-btn ${activeJournalTab === 'form'    ? 'active' : ''}" id="tabForm"  onclick="switchJournalTab('form')">✏️ Nouvelle entrée</button>
      <button class="tab-btn ${activeJournalTab === 'history' ? 'active' : ''}"             onclick="switchJournalTab('history')">📜 Historique</button>
      <button class="tab-btn ${activeJournalTab === 'stats'   ? 'active' : ''}" id="tabStats" onclick="switchJournalTab('stats')">📊 Graphiques</button>
    </div>
    <div id="journalContent">${renderJournalTab(activeJournalTab)}</div>
  `;
}

function switchJournalTab(tab) {
  activeJournalTab = tab;
  const el = document.getElementById('journalContent');
  if (el) el.innerHTML = renderJournalTab(tab);
  document.querySelectorAll('#journal .tab-btn').forEach(b => {
    b.classList.toggle('active',
      (b.textContent.includes('Nouvelle') && tab === 'form') ||
      (b.textContent.includes('Historique') && tab === 'history') ||
      (b.textContent.includes('Graphiques') && tab === 'stats')
    );
  });
  if (tab === 'stats') setTimeout(renderCharts, 100);
}

function renderJournalTab(tab) {
  if (tab === 'form')    return renderJournalForm();
  if (tab === 'history') return renderHistory();
  if (tab === 'stats')   return renderStats();
  return '';
}

// ===== Form =====
function renderJournalForm() {
  const today = new Date().toISOString().split('T')[0];
  return `
    <div class="card">
      <h3 style="margin-bottom:1rem;">📝 Feedback post-animation</h3>

      <div class="form-group">
        <label class="form-label">Date de l'animation</label>
        <input class="form-input" type="date" id="jDate" value="${today}">
      </div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:0.75rem;">
        <div class="form-group">
          <label class="form-label">Durée (h)</label>
          <input class="form-input" type="number" id="jDuration" placeholder="ex: 3.5" min="0.5" max="16" step="0.5">
        </div>
        <div class="form-group">
          <label class="form-label">Nb participants</label>
          <input class="form-input" type="number" id="jParticipants" placeholder="ex: 12" min="1" max="200">
        </div>
      </div>

      <div class="form-group">
        <label class="form-label">Thème / Sujet</label>
        <input class="form-input" id="jTheme" placeholder="ex: Leadership Agile">
      </div>

      <div class="form-group">
        <label class="form-label">Note globale</label>
        <div class="star-rating" id="starRating">
          ${[1,2,3,4,5].map(n => `
            <button class="star-btn ${n <= formRating ? 'filled' : ''}" onclick="setRating(${n})" type="button">★</button>
          `).join('')}
        </div>
      </div>

      <div class="form-group">
        <label class="form-label">Énergie du groupe — <span id="energyVal">${formEnergy}</span>/10</label>
        <div class="slider-container">
          <span>😴</span>
          <input type="range" class="range-slider" id="jEnergy" min="1" max="10" value="${formEnergy}"
            oninput="updateEnergy(this.value)">
          <span>🔥</span>
          <span class="slider-value" id="energyDisplay">${formEnergy}</span>
        </div>
      </div>

      <div class="form-group">
        <label class="form-label">✅ Ce qui a bien marché</label>
        <textarea class="form-textarea" id="jGood" placeholder="Les points positifs, les moments de flow..."></textarea>
      </div>
      <div class="form-group">
        <label class="form-label">🔧 Points à améliorer</label>
        <textarea class="form-textarea" id="jImprove" placeholder="Ce que je ferais différemment la prochaine fois..."></textarea>
      </div>
      <div class="form-group">
        <label class="form-label">🎯 Prochain défi à relever</label>
        <textarea class="form-textarea" id="jChallenge" placeholder="Mon engagement pour la prochaine animation..."></textarea>
      </div>

      <button class="btn btn-primary btn-full" onclick="saveJournalEntry()">💾 Enregistrer</button>
    </div>
  `;
}

function setRating(n) {
  formRating = n;
  document.querySelectorAll('#starRating .star-btn').forEach((btn, i) => {
    btn.classList.toggle('filled', i < n);
  });
}

function updateEnergy(val) {
  formEnergy = parseInt(val);
  const disp = document.getElementById('energyDisplay');
  const lbl  = document.getElementById('energyVal');
  if (disp) disp.textContent = val;
  if (lbl)  lbl.textContent  = val;
}

function saveJournalEntry() {
  const date         = document.getElementById('jDate')?.value;
  const duration     = parseFloat(document.getElementById('jDuration')?.value) || 0;
  const participants = parseInt(document.getElementById('jParticipants')?.value) || 0;
  const theme        = document.getElementById('jTheme')?.value.trim();
  const good         = document.getElementById('jGood')?.value.trim();
  const improve      = document.getElementById('jImprove')?.value.trim();
  const challenge    = document.getElementById('jChallenge')?.value.trim();

  if (!date) { showToast('⚠️ Veuillez indiquer une date'); return; }
  if (!theme) { showToast('⚠️ Veuillez indiquer le thème'); return; }
  if (formRating === 0) { showToast('⚠️ Donnez une note globale (étoiles)'); return; }

  const entry = {
    id: Date.now().toString(),
    date, duration, participants, theme,
    rating: formRating,
    energy: formEnergy,
    good, improve, challenge,
    createdAt: new Date().toISOString()
  };

  const sessions = getSessions();
  sessions.push(entry);
  saveSessions(sessions);

  formRating = 0;
  formEnergy = 5;
  showToast('✅ Animation enregistrée !');
  switchJournalTab('history');
}

// ===== History =====
function renderHistory() {
  const sessions = getSessions().slice().reverse();
  if (!sessions.length) {
    return `
      <div class="empty-state">
        <div class="empty-icon">📖</div>
        <p>Aucune animation enregistrée pour l'instant.<br>Commencez par remplir votre premier feedback !</p>
        <button class="btn btn-primary btn-sm mt-1" onclick="switchJournalTab('form')">+ Nouvelle entrée</button>
      </div>
    `;
  }
  return `
    <div style="margin-bottom:0.75rem;font-size:0.82rem;color:var(--text-muted);">${sessions.length} animation${sessions.length > 1 ? 's' : ''} enregistrée${sessions.length > 1 ? 's' : ''}</div>
    ${sessions.map(e => renderLogEntry(e)).join('')}
  `;
}

function renderLogEntry(entry) {
  const stars = Array.from({length:5}, (_,i) => `<span>${i < entry.rating ? '⭐' : '☆'}</span>`).join('');
  const date  = new Date(entry.date).toLocaleDateString('fr-FR', {day:'numeric', month:'short', year:'numeric'});
  return `
    <div class="log-entry" id="le-${entry.id}">
      <div class="log-entry-header">
        <div class="log-entry-title">${entry.theme}</div>
        <div class="log-entry-date">${date}</div>
      </div>
      <div class="log-entry-meta">
        ${entry.duration ? `<span class="log-meta-badge">⏱️ ${entry.duration}h</span>` : ''}
        ${entry.participants ? `<span class="log-meta-badge">👥 ${entry.participants} participants</span>` : ''}
        <span class="log-meta-badge">⚡ Énergie: ${entry.energy}/10</span>
      </div>
      <div class="log-entry-stars">${stars}</div>
      ${entry.good    ? `<p style="font-size:0.82rem;color:var(--text);margin-top:0.5rem;"><strong>✅ </strong>${entry.good}</p>` : ''}
      ${entry.improve ? `<p style="font-size:0.82rem;color:var(--text-muted);margin-top:0.25rem;"><strong>🔧 </strong>${entry.improve}</p>` : ''}
      <div class="log-entry-actions">
        <button class="btn btn-danger btn-sm" onclick="deleteEntry('${entry.id}')">🗑️ Supprimer</button>
      </div>
    </div>
  `;
}

function deleteEntry(id) {
  const sessions = getSessions().filter(s => s.id !== id);
  saveSessions(sessions);
  const el = document.getElementById('le-' + id);
  if (el) {
    el.classList.add('removing');
    setTimeout(() => switchJournalTab('history'), 350);
  }
  showToast('🗑️ Entrée supprimée');
}

// ===== Stats / Charts =====
function renderStats() {
  const sessions = getSessions();
  if (sessions.length < 2) {
    return `
      <div class="empty-state">
        <div class="empty-icon">📊</div>
        <p>Enregistrez au moins 2 animations pour voir vos graphiques de progression !</p>
        <button class="btn btn-primary btn-sm mt-1" onclick="switchJournalTab('form')">+ Nouvelle entrée</button>
      </div>
    `;
  }
  return `
    <div class="card">
      <h3 style="margin-bottom:1rem;">📈 Évolution de la note globale</h3>
      <div class="chart-container">
        <canvas id="chartRating"></canvas>
      </div>
    </div>
    <div class="card">
      <h3 style="margin-bottom:1rem;">⚡ Énergie du groupe</h3>
      <div class="chart-container">
        <canvas id="chartEnergy"></canvas>
      </div>
    </div>
  `;
}

function renderCharts() {
  const sessions = getSessions().slice(-10);
  if (!sessions.length || !window.Chart) return;

  const labels = sessions.map(s => {
    const d = new Date(s.date);
    return d.toLocaleDateString('fr-FR', {day:'numeric', month:'short'});
  });
  const ratings = sessions.map(s => s.rating);
  const energies = sessions.map(s => s.energy);

  const rCtx = document.getElementById('chartRating');
  const eCtx = document.getElementById('chartEnergy');
  if (!rCtx || !eCtx) return;

  if (chartRating)  { chartRating.destroy();  chartRating  = null; }
  if (chartEnergy)  { chartEnergy.destroy();  chartEnergy  = null; }

  const commonOpts = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: {
      y: { beginAtZero: true, grid: { color: 'rgba(107,78,255,0.06)' }, ticks: { font: { size: 11 } } },
      x: { grid: { display: false }, ticks: { font: { size: 10 }, maxRotation: 45 } }
    }
  };

  chartRating = new Chart(rCtx, {
    type: 'line',
    data: {
      labels,
      datasets: [{
        data: ratings,
        borderColor: '#6B4EFF',
        backgroundColor: 'rgba(107,78,255,0.1)',
        tension: 0.4,
        fill: true,
        pointBackgroundColor: '#6B4EFF',
        pointRadius: 5,
        borderWidth: 2
      }]
    },
    options: { ...commonOpts, scales: { ...commonOpts.scales, y: { ...commonOpts.scales.y, max: 5 } } }
  });

  chartEnergy = new Chart(eCtx, {
    type: 'bar',
    data: {
      labels,
      datasets: [{
        data: energies,
        backgroundColor: energies.map(v => v >= 7 ? 'rgba(76,175,80,0.7)' : v >= 4 ? 'rgba(107,78,255,0.6)' : 'rgba(255,107,107,0.7)'),
        borderRadius: 8,
        borderWidth: 0
      }]
    },
    options: { ...commonOpts, scales: { ...commonOpts.scales, y: { ...commonOpts.scales.y, max: 10 } } }
  });
}
