// ===== Data: Technique Cards =====
const TECHNIQUES = [
  {
    id: 'bg1',
    category: 'icebreaker',
    icon: '🌟',
    title: 'Le Tour de Table Créatif',
    duration: '10-15 min',
    material: 'Aucun',
    description: 'Demandez à chaque participant de se présenter avec un objet symbolique qui le représente. Chacun partage brièvement pourquoi cet objet lui ressemble.',
    tip: 'Encouragez la créativité, pas l\'exhaustivité. Limitez à 1 minute par personne.'
  },
  {
    id: 'bg2',
    category: 'icebreaker',
    icon: '🤝',
    title: 'Les Points Communs',
    duration: '10 min',
    material: 'Papier, stylos',
    description: 'Formez des groupes de 3-4 personnes et demandez à chaque groupe de trouver 5 points communs insolites entre tous les membres.',
    tip: 'Fixez un délai court pour créer de l\'énergie et de l\'urgence positive dans le groupe.'
  },
  {
    id: 'db1',
    category: 'debrief',
    icon: '🌹',
    title: 'La Rose, l\'Épine, le Bourgeon',
    duration: '15-20 min',
    material: 'Tableau ou post-its',
    description: 'Rose = ce qui a bien marché, Épine = une difficulté rencontrée, Bourgeon = une idée ou potentiel à développer. Chaque participant partage ses trois éléments.',
    tip: 'Commencez toujours par la rose pour créer un climat positif avant d\'aborder les difficultés.'
  },
  {
    id: 'db2',
    category: 'debrief',
    icon: '🔢',
    title: '1-2-4-Tous',
    duration: '15 min',
    material: 'Aucun',
    description: '1 min de réflexion solo, 2 min en binôme, 4 min en groupe de 4, puis partage en plénière. La réflexion s\'enrichit progressivement.',
    tip: 'Idéal pour des sujets complexes où l\'on veut des réponses mûries et diversifiées.'
  },
  {
    id: 'cf1',
    category: 'conflict',
    icon: '🔄',
    title: 'Le Recadrage Positif',
    duration: '5-10 min',
    material: 'Aucun',
    description: 'Reformulez le problème en opportunité d\'apprentissage. Exemple : "Je vois que vous avez des perspectives différentes, enrichissons-nous de cette diversité."',
    tip: 'Restez neutre et bienveillant. Votre calme est contagieux — incarnez la posture que vous souhaitez voir dans le groupe.'
  },
  {
    id: 'cf2',
    category: 'conflict',
    icon: '⏸️',
    title: 'La Pause Stratégique',
    duration: '5 min',
    material: 'Aucun',
    description: 'Proposez une pause de 5 minutes quand la tension monte dans le groupe. Cela permet à chacun de se réguler émotionnellement.',
    tip: '"Je vous propose qu\'on prenne un moment pour se ressourcer avant de continuer." Utilisez ce temps pour reformuler les enjeux.'
  }
];

// ===== Data: Checklist =====
const CHECKLIST_ITEMS = [
  { id: 'c1',  text: 'Salle réservée et accessible' },
  { id: 'c2',  text: 'Matériel pédagogique imprimé' },
  { id: 'c3',  text: 'Vidéoprojecteur et câbles testés' },
  { id: 'c4',  text: 'Tableau blanc / paperboard avec marqueurs' },
  { id: 'c5',  text: 'Tour de table préparé (badges, feuille de présence)' },
  { id: 'c6',  text: 'Supports numériques testés' },
  { id: 'c7',  text: 'Minuterie / Timer prêt' },
  { id: 'c8',  text: 'Plan B préparé si équipement défaillant' },
  { id: 'c9',  text: 'Objectifs de la session clairs et affichés' },
  { id: 'c10', text: 'Énergie personnelle rechargée (repas, eau)' }
];

// ===== Data: Daily Challenges =====
const DAILY_CHALLENGES = [
  'Préparez 3 questions ouvertes pour relancer votre prochain groupe en cas de silence.',
  'Testez une nouvelle technique de démarrage que vous n\'avez jamais utilisée.',
  'Filmez ou enregistrez un extrait de votre prochaine animation pour l\'analyser.',
  'Demandez un feedback spontané à un participant à la fin de la session.',
  'Préparez une métaphore ou analogie pour expliquer votre concept principal.',
  'Concevez une activité collaborative de 10 minutes autour de votre thème.',
  'Notez 3 points forts de votre dernière animation que vous souhaitez reproduire.',
  'Identifiez un "participant difficile type" et préparez votre stratégie de gestion.',
  'Créez un quiz rapide (3 questions) pour tester les acquis de votre prochaine session.',
  'Pratiquez une technique de présence : respiration, posture, voix avant de commencer.'
];

// ===== Data: Supervision Calendar =====
const SUPERVISION_SESSIONS = [
  {
    day: '28',
    month: 'Fév',
    title: 'Supervision Groupe A',
    time: '14h00',
    platform: 'Zoom',
    date: '28 Février 2026'
  },
  {
    day: '15',
    month: 'Mar',
    title: 'Facilitation Avancée',
    time: '10h00',
    platform: 'Zoom',
    date: '15 Mars 2026'
  },
  {
    day: '5',
    month: 'Avr',
    title: 'Pratique Réflexive',
    time: '14h30',
    platform: 'Zoom',
    date: '5 Avril 2026'
  }
];

// ===== Data: Quiz =====
const QUIZ_QUESTIONS = [
  {
    id: 'q1',
    text: 'Quelle situation vous pose le plus de difficultés ?',
    options: [
      { id: 'q1a', text: 'Démarrer la formation (créer l\'énergie)', tag: 'icebreaker' },
      { id: 'q1b', text: 'Gérer les participants difficiles', tag: 'conflict' },
      { id: 'q1c', text: 'Maintenir l\'engagement tout au long', tag: 'engagement' },
      { id: 'q1d', text: 'Conclure et ancrer les apprentissages', tag: 'default' }
    ]
  },
  {
    id: 'q2',
    text: 'Comment gérez-vous les silences prolongés ?',
    options: [
      { id: 'q2a', text: 'Je me sens mal à l\'aise et je comble vite', tag: 'icebreaker' },
      { id: 'q2b', text: 'Je laisse le temps au groupe de réfléchir', tag: 'default' },
      { id: 'q2c', text: 'Je relance avec une question ciblée', tag: 'engagement' },
      { id: 'q2d', text: 'Je passe directement à la suite', tag: 'default' }
    ]
  },
  {
    id: 'q3',
    text: 'Votre plus grand défi en animation ?',
    options: [
      { id: 'q3a', text: 'La gestion du temps', tag: 'default' },
      { id: 'q3b', text: 'La diversité des niveaux', tag: 'engagement' },
      { id: 'q3c', text: 'Les conflits entre participants', tag: 'conflict' },
      { id: 'q3d', text: 'La confiance en soi', tag: 'icebreaker' }
    ]
  }
];

// ===== Data: Quiz Recommendations =====
const QUIZ_RECOMMENDATIONS = {
  icebreaker: {
    icon: '🚀',
    title: 'Boostez vos démarrages !',
    text: 'Vous semblez chercher à dynamiser le démarrage de vos formations. Nos séances de coaching sur les techniques d\'ouverture pourraient vous aider ! 🚀'
  },
  conflict: {
    icon: '💪',
    title: 'Maîtrisez la dynamique de groupe !',
    text: 'La gestion de groupe semble être votre priorité. Discutons d\'un accompagnement personnalisé sur la facilitation de groupes complexes. 💪'
  },
  engagement: {
    icon: '✨',
    title: 'Captivez votre audience !',
    text: 'Maintenir l\'engagement est un art ! Notre supervision de groupe est idéale pour partager vos expériences et découvrir de nouvelles approches. ✨'
  },
  default: {
    icon: '🎯',
    title: 'Poursuivez votre développement !',
    text: 'Bravo pour votre démarche réflexive ! Une session de diagnostic personnalisée vous permettrait d\'identifier vos axes de développement prioritaires. 🎯'
  }
};
