const tf = require('@tensorflow/tfjs');
const fs = require('fs');
const path = require('path');

const PROFILES = [
  'track_pro',
  'track_inter',
  'street_pro',
  'street_inter',
  'street_amateur',
];

const TRANSMISSIONS = ['FR', 'FF', 'MR', 'RR', '4WD'];

function normalize(value, min, max) {
  return (value - min) / (max - min);
}

function carToTensor(car, stats) {
  const pp = normalize(car.pp, stats.pp.min, stats.pp.max);
  const hp = normalize(car.hp ?? stats.hp.min, stats.hp.min, stats.hp.max);
  const weight = normalize(car.weight ?? stats.weight.min, stats.weight.min, stats.weight.max);

  const transIndex = TRANSMISSIONS.indexOf(car.transmission);
  const transmission = normalize(
    transIndex === -1 ? 0 : transIndex,
    0,
    TRANSMISSIONS.length - 1
  );

  return [pp, hp, weight, transmission];
}

function profileToLabel(profile) {
  return PROFILES.indexOf(profile);
}

// ─── Construção do modelo ─────────────────────────────────────────────────────

// Monta a arquitetura da rede neural.
// É uma rede simples com 3 camadas:
//   - Entrada: 4 features (pp, hp, weight, transmission)
//   - Intermediária: 16 neurônios (aprende padrões)
//   - Intermediária: 8 neurônios (refina os padrões)
//   - Saída: 5 neurônios (um por perfil) com softmax
//
// softmax garante que a saída seja uma distribuição de probabilidade:
// ex: [0.7, 0.1, 0.1, 0.05, 0.05] → 70% de chance de ser track_pro
function buildModel() {
  const model = tf.sequential();

  // Camada de entrada + primeira camada intermediária
  model.add(tf.layers.dense({
    inputShape: [4],    // 4 features de entrada
    units: 16,          // 16 neurônios
    activation: 'relu', // relu é a ativação mais comum para camadas intermediárias
  }));

  // Segunda camada intermediária
  model.add(tf.layers.dense({
    units: 8,
    activation: 'relu',
  }));

  // Camada de saída — um neurônio por perfil
  model.add(tf.layers.dense({
    units: PROFILES.length, // 5 perfis
    activation: 'softmax',  // converte para probabilidades
  }));

  // Compilar define como o modelo vai aprender:
  //   optimizer: 'adam' — algoritmo que ajusta os pesos durante o treino
  //   loss: 'sparseCategoricalCrossentropy' — função de erro para classificação
  //   metrics: ['accuracy'] — o que vamos monitorar durante o treino
  model.compile({
    optimizer: 'adam',
    loss: 'sparseCategoricalCrossentropy',
    metrics: ['accuracy'],
  });

  return model;
}

// ─── Treino ───────────────────────────────────────────────────────────────────

async function train() {
  // 1. Carregar os carros pré-processados
  const cars = JSON.parse(
    fs.readFileSync(path.join(__dirname, '..', 'data', 'cars_clean.json'), 'utf-8')
  );

  // 2. Calcular stats (min/max) para normalização
  // Precisamos do min e max de cada campo numérico para normalizar corretamente.
  // Usamos filter para ignorar nulls antes de calcular.
  const stats = {
    pp:     { min: Math.min(...cars.map(c => c.pp).filter(Boolean)),     max: Math.max(...cars.map(c => c.pp).filter(Boolean)) },
    hp:     { min: Math.min(...cars.map(c => c.hp).filter(Boolean)),     max: Math.max(...cars.map(c => c.hp).filter(Boolean)) },
    weight: { min: Math.min(...cars.map(c => c.weight).filter(Boolean)), max: Math.max(...cars.map(c => c.weight).filter(Boolean)) },
  };

  console.log('Stats calculados:', stats);

  // 3. Filtrar carros com perfil não reconhecido
  // (segurança extra — não deveria existir após o preprocess)
  const validCars = cars.filter(c => profileToLabel(c.profile) !== -1);
  console.log(`Carros válidos para treino: ${validCars.length}`);

  // 4. Converter carros em tensores
  // xs = features (entrada do modelo) — shape: [373, 4]
  // ys = labels (saída esperada)      — shape: [373]
  const xs = tf.tensor2d(validCars.map(c => carToTensor(c, stats)));
  const ys = tf.tensor1d(validCars.map(c => profileToLabel(c.profile)), 'float32');

  // 5. Construir o modelo
  const model = buildModel();
  model.summary(); // imprime a arquitetura no terminal

  // 6. Treinar
  // epochs: quantas vezes o modelo vai ver todos os dados
  // validationSplit: 20% dos dados são reservados para validar (não treinar)
  console.log('\nIniciando treino...\n');
  await model.fit(xs, ys, {
    epochs: 50,
    validationSplit: 0.2,
    callbacks: {
      // Imprime o progresso a cada 10 epochs
      onEpochEnd: (epoch, logs) => {
        if ((epoch + 1) % 10 === 0) {
          console.log(
            `Epoch ${epoch + 1}/50 — loss: ${logs.loss.toFixed(4)} — accuracy: ${(logs.acc * 100).toFixed(1)}%`
          );
        }
      },
    },
  });

  // 7. Salvar o modelo treinado
  const modelJson = model.toJSON();
  const weightsData = model.getWeights().map(w => Array.from(w.dataSync()));

  const modelToSave = { modelJson, weightsData };
  const modelPath = path.join(__dirname, '..', 'model', 'gt7_model.json');
  fs.writeFileSync(modelPath, JSON.stringify(modelToSave), 'utf-8');
  console.log('\nModelo salvo em model/gt7_model.json');

  // 8. Salvar os stats para usar na recomendação
  // O recommend.js vai precisar normalizar os dados da mesma forma
  const statsPath = path.join(__dirname, '..', 'data', 'stats.json');
  fs.writeFileSync(statsPath, JSON.stringify(stats, null, 2), 'utf-8');
  console.log('Stats salvos em data/stats.json');

  console.log('\nTreino concluído!');
}

train();