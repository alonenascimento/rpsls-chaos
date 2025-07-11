// Lista de tipos com emojis
const TYPES = [
  { name: 'Rock', emoji: '🪨' },
  { name: 'Paper', emoji: '📄' },
  { name: 'Scissors', emoji: '✂️' },
  { name: 'Lizard', emoji: '🦎' },
  { name: 'Spock', emoji: '🖖' }
];

// Regras de quem ganha de quem
const RULES = {
  'Scissors': ['Paper', 'Lizard'],
  'Paper': ['Rock', 'Spock'],
  'Rock': ['Lizard', 'Scissors'],
  'Lizard': ['Spock', 'Paper'],
  'Spock': ['Scissors', 'Rock']
};

// Lista de elementos na tela
let elements = [];

// Canvas
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Inicializa elementos aleatórios
function initElements() {
  elements = []; // limpa anterior
  const countPerType = 4; // 4 de cada tipo
  for (let t of TYPES) {
    for (let i = 0; i < countPerType; i++) {
      elements.push({
        type: t,
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 2,
        vy: (Math.random() - 0.5) * 2,
        size: 32
      });
    }
  }
}


// Atualiza posições e verifica colisões
function update() {
  for (let e of elements) {
    e.x += e.vx;
    e.y += e.vy;

    // Rebater nas bordas
    if (e.x < 0 || e.x > canvas.width) e.vx *= -1;
    if (e.y < 0 || e.y > canvas.height) e.vy *= -1;
  }

  checkCollisions();
}

// Checa colisão entre todos os pares
function checkCollisions() {
  for (let i = 0; i < elements.length; i++) {
    for (let j = i + 1; j < elements.length; j++) {
      let e1 = elements[i];
      let e2 = elements[j];

      const dx = e1.x - e2.x;
      const dy = e1.y - e2.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < e1.size / 2) {
        resolveCollision(e1, e2);
      }
    }
  }
}

// Aplica a regra: quem vence transforma o outro
function resolveCollision(e1, e2) {
  if (e1.type.name === e2.type.name) return; // mesmo tipo, nada acontece

  if (RULES[e1.type.name].includes(e2.type.name)) {
    // e1 vence → e2 vira e1
    e2.type = e1.type;
  } else if (RULES[e2.type.name].includes(e1.type.name)) {
    // e2 vence → e1 vira e2
    e1.type = e2.type;
  }
  // se não houver relação, nada acontece
}

// Desenha todos os elementos
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (let e of elements) {
    ctx.font = `${e.size}px sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(e.type.emoji, e.x, e.y);
  }
}

// Atualiza contagem de cada tipo e mostra na tela
function updateStats() {
  const counts = {};
  for (let t of TYPES) counts[t.name] = 0;
  for (let e of elements) counts[e.type.name]++;
  document.getElementById('stats').innerText =
    TYPES.map(t => `${t.emoji} ${counts[t.name]}`).join(' | ');
}

// Loop do jogo
function gameLoop() {
  update();
  draw();
  updateStats();
  requestAnimationFrame(gameLoop);
}

// Inicializa tudo
initElements();
gameLoop();

// INTERAÇÃO EXTRA: clique no canvas para adicionar elemento
canvas.addEventListener('click', (e) => {
  const typeName = prompt("Qual tipo adicionar? (Rock, Paper, Scissors, Lizard, Spock)");
  if (!typeName) return;

  const type = TYPES.find(t => t.name.toLowerCase() === typeName.toLowerCase());
  if (!type) {
    alert("Tipo inválido! Tente: Rock, Paper, Scissors, Lizard, Spock");
    return;
  }

  elements.push({
    type: type,
    x: e.offsetX,
    y: e.offsetY,
    vx: (Math.random() - 0.5) * 2,
    vy: (Math.random() - 0.5) * 2,
    size: 32
  });
});
