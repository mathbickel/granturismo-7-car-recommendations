const tf = require('@tensorflow/tfjs');
const fs = require('fs');
const path = require('path');
const readline = require('readline');

const PROFILES = [
  'track_pro',
  'track_inter',
  'track_amateur',
  'street_pro',
  'street_inter',
  'street_amateur',
];

const PROFILE_LABELS = {
  track_pro:      '🏁 Pista Profissional',
  track_inter:    '🏎️  Pista Intermediário',
  track_amateur:  '🔧 Pista Amador',
  street_pro:     '🚗 Rua Profissional',
  street_inter:   '🚙 Rua Intermediário',
  street_amateur: '🛵 Rua Amador',
};

// ─── Interpretação do input do usuário ───────────────────────────────────────

function interpretInput(userInput) {
  // TODO: recebe o texto livre do usuário e retorna um objeto com features estimadas
  // Dica: procure por palavras-chave como:
  //   'pista', 'corrida', 'track'   → isRacing = true
  //   'rua', 'street', 'road'       → isRacing = false
  //   'profissional', 'pro'         → level = 'pro'
  //   'intermediário', 'inter'      → level = 'inter'
  //   'amador', 'iniciante'         → level = 'amateur'
  // Retorne: { isRacing, level }
}

function profileFromInput(interpreted) {
  // TODO: a partir do { isRacing, level }, retornar o nome do perfil correspondente
  // ex: { isRacing: true, level: 'pro' } → 'track_pro'
}

// ─── Recomendação ─────────────────────────────────────────────────────────────

function recommendCars(profile, cars, topN = 5) {
  // TODO: filtrar os carros pelo perfil e retornar os topN
  // Sugestão de ordenação: por PP decrescente dentro do perfil
}

function printRecommendations(cars, profile) {
  // TODO: exibir no terminal os carros recomendados de forma legível
  // Sugestão de formato:
  //   🏆 Recomendações para: Pista Profissional
  //   1. Ferrari FXX K  |  PP: 906  |  HP: 1036  |  MR
  //   2. ...
}

// ─── Interface de terminal ────────────────────────────────────────────────────

async function main() {
  const cars = JSON.parse(
    fs.readFileSync(path.join(__dirname, '..', 'data', 'cars_clean.json'), 'utf-8')
  );

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  rl.question('\n🎮 Descreva seu estilo de piloto: ', (input) => {
    // TODO: usar interpretInput → profileFromInput → recommendCars → printRecommendations
    rl.close();
  });
}

main();
