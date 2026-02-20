// ===== Toolbox Page =====
let activeToolTab = 'fiches';
let checklistState = JSON.parse(localStorage.getItem('fp_checklist') || '{}');
let sessionPlan = null;
let timerInterval = null;
let timerCurrentStep = 0;
let timerRemaining = 0;
let timerRunning = false;

function renderToolbox() {
  return `
    <div class="section-title">
      <span class="icon">🧰</span>
      <h2>Boîte à Outils</h2>
    </div>

    <div class="tabs">
      <button class="tab-btn ${activeToolTab === 'fiches' ? 'active' : ''}" onclick="switchToolTab('fiches')">🃏 Fiches mémo</button>
      <button class="tab-btn ${activeToolTab === 'sequence' ? 'active' : ''}" onclick="switchToolTab('sequence')">⏱️ Séquenceur</button>
      <button class="tab-btn ${activeToolTab === 'checklist' ? 'active' : ''}" onclick="switchToolTab('checklist')">✅ Checklist</button>
    </div>

    <div id="toolContent">${renderToolTab(activeToolTab)}</div>
  `;
}

function switchToolTab(tab) {
  activeToolTab = tab;
  const el = document.getElementById('toolContent');
  if (el) el.innerHTML = renderToolTab(tab);
  document.querySelectorAll('.tab-btn').forEach((b, i) => {
    const tabs = ['fiches', 'sequence', 'checklist'];
    b.classList.toggle('active', tabs[i] === tab);
  });
  if (tab === 'checklist') renderChecklistProgress();
  if (tab === 'sequence' && sessionPlan) renderTimerView();
}

// ===== Technique Cards =====
function renderToolTab(tab) {
  if (tab === 'fiches')    return renderFiches();
  if (tab === 'sequence')  return renderSequencer();
  if (tab === 'checklist') return renderChecklist();
  return '';
}

let ficheFilterCat = 'all';
function renderFiches() {
  const cats = [
    { id: 'all',        label: 'Toutes',         icon: '📚' },
    { id: 'icebreaker', label: 'Brise-Glace',     icon: '🌟' },
    { id: 'debrief',    label: 'Debriefing',       icon: '🌹' },
    { id: 'conflict',   label: 'Conflits',         icon: '🔄' }
  ];

  const filtered = ficheFilterCat === 'all'
    ? TECHNIQUES
    : TECHNIQUES.filter(t => t.category === ficheFilterCat);

  return `
    <div class="tabs" style="margin-bottom:0.75rem;">
      ${cats.map(c => `
        <button class="tab-btn ${ficheFilterCat === c.id ? 'active' : ''}"
          onclick="filterFiches('${c.id}')">${c.icon} ${c.label}</button>
      `).join('')}
    </div>
    <div id="fichesList">
      ${filtered.map(t => renderTechniqueCard(t)).join('')}
    </div>
  `;
}

function filterFiches(cat) {
  ficheFilterCat = cat;
  const el = document.getElementById('fichesList');
  if (!el) return switchToolTab('fiches');
  const filtered = cat === 'all' ? TECHNIQUES : TECHNIQUES.filter(t => t.category === cat);
  el.innerHTML = filtered.map(t => renderTechniqueCard(t)).join('');
  const cats = ['all', 'icebreaker', 'debrief', 'conflict'];
  document.querySelectorAll('.tabs')[1]?.querySelectorAll('.tab-btn').forEach((b, i) => {
    b.classList.toggle('active', cats[i] === cat);
  });
}

function renderTechniqueCard(t) {
  const typeClass = t.category === 'icebreaker' ? 'type-icebreaker' : t.category === 'debrief' ? 'type-debrief' : 'type-conflict';
  const typeLabel = t.category === 'icebreaker' ? 'Brise-Glace' : t.category === 'debrief' ? 'Debriefing' : 'Gestion Conflits';
  return `
    <div class="technique-card" id="tc-${t.id}">
      <div class="technique-header" onclick="toggleTechnique('${t.id}')">
        <div class="technique-meta">
          <span class="technique-icon">${t.icon}</span>
          <div>
            <div class="technique-title">${t.title}</div>
            <span class="technique-type ${typeClass}">${typeLabel}</span>
          </div>
        </div>
        <span class="technique-chevron">▼</span>
      </div>
      <div class="technique-body">
        <div class="technique-row">
          <span class="technique-badge">⏱️ ${t.duration}</span>
          <span class="technique-badge">📦 ${t.material}</span>
        </div>
        <p class="technique-desc">${t.description}</p>
        <div class="technique-tip">💡 <strong>Astuce :</strong> ${t.tip}</div>
      </div>
    </div>
  `;
}

function toggleTechnique(id) {
  const el = document.getElementById('tc-' + id);
  if (el) el.classList.toggle('open');
}

// ===== Checklist =====
function renderChecklist() {
  const total = CHECKLIST_ITEMS.length;
  const done = CHECKLIST_ITEMS.filter(i => checklistState[i.id]).length;
  const pct = Math.round((done / total) * 100);

  return `
    <div class="card">
      <div class="flex-between mb-1">
        <h3>📋 Pré-animation</h3>
        <span style="font-size:0.82rem;color:var(--text-muted);font-weight:600;">${done}/${total}</span>
      </div>
      <div class="checklist-progress">
        <div class="checklist-progress-bar" id="checklistBar" style="width:${pct}%"></div>
      </div>
      ${pct === 100 ? '<div style="text-align:center;padding:0.5rem;color:var(--success);font-weight:700;font-size:0.9rem;">🎉 Tout est prêt !</div>' : ''}
      <ul class="checklist" id="checklistItems">
        ${CHECKLIST_ITEMS.map(item => `
          <li class="checklist-item ${checklistState[item.id] ? 'checked' : ''}"
              onclick="toggleCheckItem('${item.id}')">
            <div class="check-box">${checklistState[item.id] ? '✓' : ''}</div>
            <span class="check-label">${item.text}</span>
          </li>
        `).join('')}
      </ul>
      <div style="margin-top:1rem;display:flex;gap:0.5rem;">
        <button class="btn btn-ghost btn-sm" onclick="resetChecklist()">🔄 Réinitialiser</button>
      </div>
    </div>
  `;
}

function toggleCheckItem(id) {
  checklistState[id] = !checklistState[id];
  localStorage.setItem('fp_checklist', JSON.stringify(checklistState));
  const total = CHECKLIST_ITEMS.length;
  const done = CHECKLIST_ITEMS.filter(i => checklistState[i.id]).length;
  const pct = Math.round((done / total) * 100);
  const bar = document.getElementById('checklistBar');
  if (bar) bar.style.width = pct + '%';
  const item = document.querySelector(`[onclick="toggleCheckItem('${id}')"]`);
  if (item) {
    item.classList.toggle('checked', checklistState[id]);
    const box = item.querySelector('.check-box');
    if (box) box.textContent = checklistState[id] ? '✓' : '';
  }
  if (pct === 100) showToast('✅ Tout est prêt ! Bonne animation !');
  renderChecklistProgress();
}

function renderChecklistProgress() {
  const total = CHECKLIST_ITEMS.length;
  const done = CHECKLIST_ITEMS.filter(i => checklistState[i.id]).length;
  const pct = Math.round((done / total) * 100);
  const bar = document.getElementById('checklistBar');
  if (bar) bar.style.width = pct + '%';
}

function resetChecklist() {
  checklistState = {};
  localStorage.setItem('fp_checklist', JSON.stringify(checklistState));
  switchToolTab('checklist');
  showToast('🔄 Checklist réinitialisée');
}

// ===== Session Sequencer =====
let sessionSteps = [{ name: '', duration: 10 }];

function renderSequencer() {
  if (sessionPlan) return renderTimerView();
  return `
    <div class="card">
      <h3 style="margin-bottom:1rem;">🎯 Générateur de séquence</h3>
      <div class="form-group">
        <label class="form-label">Titre de la session</label>
        <input class="form-input" id="seqTitle" placeholder="ex: Formation Leadership" value="">
      </div>
      <div class="form-group">
        <label class="form-label">Durée totale (minutes)</label>
        <input class="form-input" id="seqDuration" type="number" value="60" min="10" max="480">
      </div>
      <div class="form-group">
        <label class="form-label">Objectif principal</label>
        <textarea class="form-textarea" id="seqObjective" placeholder="À la fin de cette session, les participants seront capables de..."></textarea>
      </div>
      <div class="form-group">
        <label class="form-label">Matériels nécessaires</label>
        <input class="form-input" id="seqMaterials" placeholder="ex: Paperboard, post-its, marqueurs">
      </div>

      <div class="form-group">
        <label class="form-label">Étapes de la session</label>
        <div class="steps-container" id="stepsContainer">
          ${sessionSteps.map((s, i) => renderStepRow(s, i)).join('')}
        </div>
        <button class="btn btn-ghost btn-sm" onclick="addStep()">+ Ajouter une étape</button>
      </div>

      <button class="btn btn-primary btn-full" onclick="generateSession()">
        ▶ Générer & Démarrer le timer
      </button>
    </div>
  `;
}

function renderStepRow(step, index) {
  return `
    <div class="step-row" id="step-${index}">
      <input class="form-input" placeholder="Nom de l'étape (ex: Accueil)" value="${step.name}"
        oninput="updateStep(${index}, 'name', this.value)">
      <input class="form-input step-dur" type="number" min="1" max="180" placeholder="min" value="${step.duration}"
        oninput="updateStep(${index}, 'duration', parseInt(this.value)||5)">
      <button class="btn-remove" onclick="removeStep(${index})">✕</button>
    </div>
  `;
}

function updateStep(index, field, value) {
  sessionSteps[index][field] = value;
}

function addStep() {
  sessionSteps.push({ name: '', duration: 10 });
  const container = document.getElementById('stepsContainer');
  if (container) {
    const div = document.createElement('div');
    div.innerHTML = renderStepRow(sessionSteps[sessionSteps.length - 1], sessionSteps.length - 1);
    container.appendChild(div.firstElementChild);
  }
}

function removeStep(index) {
  if (sessionSteps.length <= 1) { showToast('⚠️ Au moins une étape requise'); return; }
  sessionSteps.splice(index, 1);
  const container = document.getElementById('stepsContainer');
  if (container) container.innerHTML = sessionSteps.map((s, i) => renderStepRow(s, i)).join('');
}

function generateSession() {
  const title    = document.getElementById('seqTitle')?.value.trim() || 'Ma Session';
  const duration = parseInt(document.getElementById('seqDuration')?.value) || 60;
  const objective= document.getElementById('seqObjective')?.value.trim() || '';
  const materials= document.getElementById('seqMaterials')?.value.trim() || '';
  const steps    = sessionSteps.filter(s => s.name.trim() || s.duration > 0).map(s => ({
    name: s.name.trim() || 'Étape',
    duration: parseInt(s.duration) || 5
  }));
  if (!steps.length) { showToast('⚠️ Ajoutez au moins une étape'); return; }

  sessionPlan = { title, duration, objective, materials, steps };
  timerCurrentStep = 0;
  timerRemaining = steps[0].duration * 60;
  timerRunning = false;

  const el = document.getElementById('toolContent');
  if (el) el.innerHTML = renderTimerView();
}

function renderTimerView() {
  if (!sessionPlan) return renderSequencer();
  const step = sessionPlan.steps[timerCurrentStep];
  const total = step.duration * 60;
  const pct = Math.round(((total - timerRemaining) / total) * 100);
  const mins = Math.floor(timerRemaining / 60);
  const secs = timerRemaining % 60;
  const timeStr = `${String(mins).padStart(2,'0')}:${String(secs).padStart(2,'0')}`;

  return `
    <div class="card" style="margin-bottom:0.75rem;">
      <div class="flex-between">
        <div>
          <div style="font-size:0.75rem;color:var(--text-muted);font-weight:600;text-transform:uppercase;letter-spacing:0.06em;">Session en cours</div>
          <div style="font-weight:700;font-size:1rem;">${sessionPlan.title}</div>
        </div>
        <button class="btn btn-ghost btn-sm" onclick="resetSession()">✕ Quitter</button>
      </div>
      ${sessionPlan.objective ? `<p style="font-size:0.82rem;color:var(--text-muted);margin-top:0.5rem;">🎯 ${sessionPlan.objective}</p>` : ''}
    </div>

    <div class="timer-container ${timerRunning ? 'timer-running' : ''}">
      <div class="timer-header">
        <div>
          <div style="font-size:0.72rem;color:var(--text-muted);font-weight:600;text-transform:uppercase;">Étape ${timerCurrentStep + 1} / ${sessionPlan.steps.length}</div>
          <div class="timer-step-name">${step.name}</div>
        </div>
        <span style="font-size:0.82rem;color:var(--text-muted);">${step.duration} min</span>
      </div>

      <div class="timer-display">
        <div class="timer-time" id="timerDisplay">${timeStr}</div>
      </div>

      <div class="timer-progress-bar">
        <div class="timer-progress-fill" id="timerProgressFill" style="width:${pct}%"></div>
      </div>

      <div class="timer-controls">
        <button class="btn btn-ghost btn-sm" onclick="prevStep()" ${timerCurrentStep === 0 ? 'disabled style="opacity:0.4"' : ''}>⏮ Préc.</button>
        <button class="btn btn-primary" id="timerPlayBtn" onclick="toggleTimer()" style="min-width:100px;">
          ${timerRunning ? '⏸ Pause' : '▶ Démarrer'}
        </button>        <button class="btn btn-ghost btn-sm" onclick="nextStep()" ${timerCurrentStep >= sessionPlan.steps.length - 1 ? 'disabled style="opacity:0.4"' : ''}>Suiv. ⏭</button>
      </div>
    </div>

    <div class="card" style="margin-top:0.75rem;">
      <h3 style="margin-bottom:0.75rem;font-size:0.9rem;">📋 Toutes les étapes</h3>
      <div class="timer-steps-list">
        ${sessionPlan.steps.map((s, i) => `
          <div class="timer-step-item ${i === timerCurrentStep ? 'active' : i < timerCurrentStep ? 'done' : ''}"
               onclick="jumpToStep(${i})">
            <span>${i < timerCurrentStep ? '✓ ' : ''}${s.name || 'Étape ' + (i+1)}</span>
            <span>${s.duration} min</span>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

function toggleTimer() {
  timerRunning = !timerRunning;
  if (timerRunning) {
    timerInterval = setInterval(tickTimer, 1000);
  } else {
    clearInterval(timerInterval);
  }
  const btn = document.getElementById('timerPlayBtn');
  if (btn) btn.textContent = timerRunning ? '⏸ Pause' : '▶ Reprendre';
  const cont = document.querySelector('.timer-container');
  if (cont) cont.classList.toggle('timer-running', timerRunning);
}

function tickTimer() {
  if (timerRemaining <= 0) {
    clearInterval(timerInterval);
    timerRunning = false;
    showToast('⏰ Étape terminée !');
    if (timerCurrentStep < sessionPlan.steps.length - 1) {
      setTimeout(() => nextStep(), 1000);
    } else {
      showToast('🎉 Session terminée ! Bravo !');
      resetSession();
    }
    return;
  }
  timerRemaining--;
  updateTimerDisplay();
}

function updateTimerDisplay() {
  const mins = Math.floor(timerRemaining / 60);
  const secs = timerRemaining % 60;
  const timeStr = `${String(mins).padStart(2,'0')}:${String(secs).padStart(2,'0')}`;
  const disp = document.getElementById('timerDisplay');
  if (disp) disp.textContent = timeStr;
  const step = sessionPlan.steps[timerCurrentStep];
  const total = step.duration * 60;
  const pct = Math.round(((total - timerRemaining) / total) * 100);
  const fill = document.getElementById('timerProgressFill');
  if (fill) fill.style.width = pct + '%';
}

function nextStep() {
  if (!sessionPlan || timerCurrentStep >= sessionPlan.steps.length - 1) return;
  clearInterval(timerInterval);
  timerRunning = false;
  timerCurrentStep++;
  timerRemaining = sessionPlan.steps[timerCurrentStep].duration * 60;
  const el = document.getElementById('toolContent');
  if (el) el.innerHTML = renderTimerView();
}

function prevStep() {
  if (!sessionPlan || timerCurrentStep <= 0) return;
  clearInterval(timerInterval);
  timerRunning = false;
  timerCurrentStep--;
  timerRemaining = sessionPlan.steps[timerCurrentStep].duration * 60;
  const el = document.getElementById('toolContent');
  if (el) el.innerHTML = renderTimerView();
}

function jumpToStep(index) {
  clearInterval(timerInterval);
  timerRunning = false;
  timerCurrentStep = index;
  timerRemaining = sessionPlan.steps[index].duration * 60;
  const el = document.getElementById('toolContent');
  if (el) el.innerHTML = renderTimerView();
}

function resetSession() {
  clearInterval(timerInterval);
  timerRunning = false;
  sessionPlan = null;
  sessionSteps = [{ name: '', duration: 10 }];
  switchToolTab('sequence');
}
