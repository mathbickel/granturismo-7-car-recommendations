const tf = require('@tensorflow/tfjs');
const fs = require('fs');
const path = require('path');

// ─── Mapeamento de perfis para índices numéricos ──────────────────────────────
// O modelo de ML trabalha com números, não strings

const PROFILES = [
  'track_pro',
  'track_inter',
  'track_amateur',
  'street_pro',
  'street_inter',
  'street_amateur',
];

const TRANSMISSIONS = ['FR', 'FF', 'MR', 'RR', '4WD'];

// ─── Normalização ─────────────────────────────────────────────────────────────

function normalize(value, min, max) {
  // TODO: normalizar um valor para o intervalo [0, 1]
  // Fórmula: (value - min) / (max - min)
}

function carToTensor(car, stats) {
  // TODO: converter um carro em um array de features numéricas normalizadas
  // Features sugeridas:
  //   [pp_normalizado, hp_normalizado, weight_normalizado, transmission_index]
  // Dica: use TRANSMISSIONS.indexOf(car.transmission) para a transmissão
  // Dica: stats contém { pp: {min, max}, hp: {min, max}, weight: {min, max} }
}

function profileToLabel(profile) {
  // TODO: retornar o índice do perfil em PROFILES
}

// ─── Construção do modelo ─────────────────────────────────────────────────────

function buildModel() {
  // TODO: criar um modelo sequencial com:
  //   - Camada de entrada com 4 features
  //   - Uma ou duas camadas Dense intermediárias (sugestão: 16 e 8 neurônios, relu)
  //   - Camada de saída com 6 neurônios (um por perfil) e ativação softmax
  // Compilar com:
  //   optimizer: 'adam'
  //   loss: 'sparseCategoricalCrossentropy'
  //   metrics: ['accuracy']
}

// ─── Treino ───────────────────────────────────────────────────────────────────

async function train() {
  const cars = JSON.parse(
    fs.readFileSync(path.join(__dirname, '..', 'data', 'cars_clean.json'), 'utf-8')
  );

  // TODO: calcular stats (min/max) de pp, hp e weight para normalização

  // TODO: converter os carros em tensores de features (xs) e labels (ys)

  // TODO: construir e treinar o modelo (sugestão: epochs: 50, validationSplit: 0.2)

  // TODO: salvar o modelo treinado em model/gt7_model
  //   use: await model.save('file://./model/gt7_model')

  // TODO: salvar também o stats.json em data/ para usar na recomendação

  console.log('Treino concluído!');
}

train();
