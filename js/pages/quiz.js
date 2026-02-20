// ===== Quiz Page =====
let quizAnswers = {};
let quizCurrentQ = 0;
let quizDone = false;

function renderQuiz() {
  if (quizDone) return renderQuizResult();
  return `
    <div class="section-title">
      <span class="icon">❓</span>
      <h2>Diagnostic personnalisé</h2>
    </div>

    <div class="quiz-progress-header">
      <div class="quiz-progress-text">Question ${quizCurrentQ + 1} sur ${QUIZ_QUESTIONS.length}</div>
      <div class="quiz-progress-bar">
        <div class="quiz-progress-fill" style="width:${Math.round(((quizCurrentQ) / QUIZ_QUESTIONS.length) * 100)}%"></div>
      </div>
    </div>

    ${renderQuizQuestion(QUIZ_QUESTIONS[quizCurrentQ])}

    <div style="display:flex;gap:0.75rem;margin-top:1rem;">
      ${quizCurrentQ > 0 ? `<button class="btn btn-outline btn-sm" onclick="quizPrev()">← Précédent</button>` : ''}
      <button class="btn btn-primary ${quizCurrentQ > 0 ? '' : 'btn-full'}" style="flex:1;"
        onclick="quizNext()" id="quizNextBtn"
        ${!quizAnswers[QUIZ_QUESTIONS[quizCurrentQ].id] ? 'disabled style="opacity:0.5;cursor:not-allowed;"' : ''}>
        ${quizCurrentQ < QUIZ_QUESTIONS.length - 1 ? 'Suivant →' : 'Voir mon diagnostic 🎯'}
      </button>
    </div>

    <div class="card" style="background:linear-gradient(135deg,#F3F0FF,#EEF0FF);border-color:rgba(107,78,255,0.12);margin-top:1rem;text-align:center;">
      <p style="font-size:0.82rem;color:var(--text-muted);">Ce quiz est anonyme et ne prend que 2 minutes. Il vous aidera à identifier vos besoins de développement.</p>
    </div>
  `;
}

function renderQuizQuestion(q) {
  const selected = quizAnswers[q.id];
  return `
    <div class="quiz-question">
      <div class="quiz-q-number">Question ${quizCurrentQ + 1}</div>
      <div class="quiz-q-text">${q.text}</div>
      <div class="quiz-options">
        ${q.options.map(opt => `
          <button class="quiz-option ${selected === opt.id ? 'selected' : ''}"
            onclick="selectOption('${q.id}', '${opt.id}', '${opt.tag}')">
            ${opt.text}
          </button>
        `).join('')}
      </div>
    </div>
  `;
}

function selectOption(qId, optId, tag) {
  quizAnswers[qId] = optId;
  quizAnswers[qId + '_tag'] = tag;
  const nextBtn = document.getElementById('quizNextBtn');
  if (nextBtn) {
    nextBtn.removeAttribute('disabled');
    nextBtn.style.opacity = '1';
    nextBtn.style.cursor  = 'pointer';
  }
  document.querySelectorAll('.quiz-option').forEach(btn => {
    const isSelected = btn.textContent.trim() === QUIZ_QUESTIONS[quizCurrentQ].options.find(o => o.id === optId)?.text.trim();
    btn.classList.toggle('selected', isSelected);
  });
}

function quizNext() {
  if (!quizAnswers[QUIZ_QUESTIONS[quizCurrentQ].id]) return;
  if (quizCurrentQ < QUIZ_QUESTIONS.length - 1) {
    quizCurrentQ++;
    const el = document.getElementById('quiz');
    if (el) el.innerHTML = renderQuiz();
  } else {
    quizDone = true;
    const el = document.getElementById('quiz');
    if (el) el.innerHTML = renderQuizResult();
  }
}

function quizPrev() {
  if (quizCurrentQ > 0) {
    quizCurrentQ--;
    const el = document.getElementById('quiz');
    if (el) el.innerHTML = renderQuiz();
  }
}

function computeRecommendation() {
  const tags = QUIZ_QUESTIONS.map(q => quizAnswers[q.id + '_tag']).filter(Boolean);
  const counts = {};
  tags.forEach(t => { counts[t] = (counts[t] || 0) + 1; });
  const top = Object.entries(counts).sort((a, b) => b[1] - a[1])[0];
  const tag = top ? top[0] : 'default';
  return QUIZ_RECOMMENDATIONS[tag] || QUIZ_RECOMMENDATIONS.default;
}

function renderQuizResult() {
  const rec = computeRecommendation();
  return `
    <div class="quiz-result">
      <div class="result-icon">${rec.icon}</div>
      <h2>${rec.title}</h2>
      <p>${rec.text}</p>
      <a href="mailto:coach@formateurpro.fr?subject=Suite%20au%20quiz%20de%20diagnostic&body=Bonjour%2C%20suite%20%C3%A0%20mon%20quiz%20de%20diagnostic%2C%20je%20souhaite%20%C3%AAtre%20contact%C3%A9%20pour%20un%20accompagnement%20personnalis%C3%A9."
         class="btn" style="background:white;color:var(--primary);font-weight:700;margin-top:0.5rem;">
        📬 Discuter avec un coach
      </a>
    </div>
    <div style="text-align:center;margin-top:1.25rem;">
      <button class="btn btn-ghost btn-sm" onclick="resetQuiz()">🔄 Recommencer le quiz</button>
    </div>
  `;
}

function resetQuiz() {
  quizAnswers   = {};
  quizCurrentQ  = 0;
  quizDone      = false;
  const el = document.getElementById('quiz');
  if (el) el.innerHTML = renderQuiz();
}
