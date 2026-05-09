const fs = require('fs');
const path = require('path');
const { parse } = require('csv-parse/sync');

// ─── Helpers de limpeza ───────────────────────────────────────────────────────
// Cada função recebe o valor bruto do CSV (string) e retorna o valor limpo

function parsePP(raw) {
  // TODO: extrair o número de strings como "PP 377" ou retornar null se "PP ??"
}

function parseHP(raw) {
  // TODO: converter para inteiro, retornar null se inválido
}

function parsePrice(raw) {
  // TODO: remover "Cr", "≈", vírgulas e converter para inteiro
}

function parseWeight(raw) {
  // TODO: converter lbs para float
}

function parseCategories(raw) {
  // TODO: separar por "|" e retornar array de strings em lowercase
  // ex: "Midship|Racing Car" → ['midship', 'racing car']
}

// ─── Classificação nos 6 perfis ──────────────────────────────────────────────

function classifyProfile(car) {
  // TODO: recebe um carro já com pp (número) e categories (array)
  // Retorna um dos 6 perfis:
  //   'track_pro'     → Racing Car, PP > 600
  //   'track_inter'   → Racing Car, PP 400–600
  //   'track_amateur' → Racing Car, PP < 400
  //   'street_pro'    → Road Car, PP > 600
  //   'street_inter'  → Road Car, PP 400–600
  //   'street_amateur'→ Road Car, PP < 400
  // Dica: se pp === null, retorne 'unknown'
}

// ─── Pipeline principal ───────────────────────────────────────────────────────

function preprocess() {
  const csvPath = path.join(__dirname, '..', 'data', 'gt7_cars.csv');

  // TODO: ler e parsear o CSV

  // TODO: para cada linha, montar um objeto limpo com:
  //   { model, pp, hp, price, weight, transmission, categories, profile, imgUrl }

  // TODO: filtrar carros com profile === 'unknown'

  // TODO: salvar o resultado como data/cars_clean.json

  console.log('Pré-processamento concluído!');
}

preprocess();
