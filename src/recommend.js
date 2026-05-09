const fs = require('fs');
const path = require('path');
const readline = require('readline');

const PROFILE_LABELS = {
  track_pro:      '🏁 Pista Profissional',
  track_inter:    '🏎️  Pista Intermediário',
  street_pro:     '🚗 Rua Profissional',
  street_inter:   '🚙 Rua Intermediário',
  street_amateur: '🛵 Rua Amador',
};

function interpretInput(input) {
  const text = input.toLowerCase().trim();

  const isTrack = ['pista', 'corrida', 'track', 'racing'].some(w => text.includes(w));
  const isStreet = ['rua', 'street', 'road'].some(w => text.includes(w));

  const isPro = ['profissional', 'pro', 'expert'].some(w => text.includes(w));
  const isInter = ['intermediário', 'intermediario', 'inter', 'médio', 'medio'].some(w => text.includes(w));
  const isAmateur = ['amador', 'amateur', 'iniciante', 'beginner'].some(w => text.includes(w));

  if (isTrack) {
    if (isPro)    return 'track_pro';
    if (isInter)  return 'track_inter';
    return 'track_pro';
  }

  if (isStreet) {
    if (isPro)     return 'street_pro';
    if (isInter)   return 'street_inter';
    if (isAmateur) return 'street_amateur';
    return 'street_inter';
  }

  return null;
}

function recommendCars(profile, cars, topN = 5) {
  return cars
    .filter(car => car.profile === profile)
    .sort((a, b) => b.pp - a.pp)
    .slice(0, topN);
}

function printRecommendations(cars, profile) {
  const label = PROFILE_LABELS[profile];
  console.log(`\n🎮 Recomendações para: ${label}\n`);
  console.log('─'.repeat(60));

  cars.forEach((car, index) => {
    console.log(`${index + 1}. ${car.model}`);
    console.log(`   PP: ${car.pp} | HP: ${car.hp ?? '?'} | Tração: ${car.transmission}`);
    console.log(`   Categorias: ${car.categories.join(', ')}`);
    console.log('');
  });
}

// ─── Interface de terminal ────────────────────────────────────────────────────

async function main() {
  // 1. Carregar os carros limpos
  const cars = JSON.parse(
    fs.readFileSync(path.join(__dirname, '..', 'data', 'cars_clean.json'), 'utf-8')
  );

  // 2. Interface de leitura do terminal
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  console.log('\n🎮 GT7 Car Recommendation System');
  console.log('─'.repeat(60));
  console.log('Exemplos de input:');
  console.log('  "pista profissional", "rua amador", "track inter"');
  console.log('─'.repeat(60));

  rl.question('\nDescreva seu estilo de piloto: ', (input) => {
    // 3. Interpretar o input
    const profile = interpretInput(input);

    if (!profile) {
      console.log('\n❌ Não entendi o estilo. Tente usar palavras como:');
      console.log('   pista / rua + profissional / intermediário / amador');
      rl.close();
      return;
    }

    // 4. Buscar e exibir recomendações
    const recommended = recommendCars(profile, cars);

    if (recommended.length === 0) {
      console.log('\n⚠️ Nenhum carro encontrado para esse perfil.');
      rl.close();
      return;
    }

    printRecommendations(recommended, profile);
    rl.close();
  });
}

main();