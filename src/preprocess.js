const fs = require('fs');
const path = require('path');
const { parse } = require('csv-parse/sync');

function parsePP(raw) 
{
  const match = raw.match(/\d+/);
  if (match) return parseInt(match[0]);

  return null;
}

function parseHP(raw) 
{
  const match = raw.match(/\d+/);
  if (match) return parseInt(match[0]);
  
  return null;
}

function parsePrice(raw) 
{
  const cleaned = raw.replace(/,/g, '');
  const match = cleaned.match(/\d+/);
  if (match) return parseInt(match[0]);
  
  return null;
}

function parseWeight(raw) 
{
  const match = raw.match(/[\d.]+/);
  if (match) return parseFloat(match[0]);
  
  return null;
}

function parseCategories(raw) 
{
  return raw.split('|').map(c => c.trim().toLowerCase());
}

function classifyProfile(car) {
  if (car.pp === null) return 'unknown';

  const isRacing = car.categories.some(c =>
    ['racing car', 'gt500', 'le mans', 'nurburgring 24 hours', 'kart', 
     'professionally tuned', 'hypercar', 'gran turismo award'].includes(c)
  );

  let level;
  if (isRacing) {
    level = car.pp > 600 ? 'pro' : 'inter'; // pista só tem pro e inter
  } else {
    if (car.pp > 600)       level = 'pro';
    else if (car.pp >= 400) level = 'inter';
    else                    level = 'amateur';
  }

  return isRacing
    ? 'track_' + level
    : 'street_' + level;
}

function preprocess() {
  const csvPath = path.join(__dirname, '..', 'data', 'gt7_cars.csv');

  const raw = fs.readFileSync(csvPath, 'utf-8');
  const records = parse(raw, {
    columns: true,
    skip_empty_lines: true,
    trim: true,
  });

  const cars = records.map(row => {
    const categories = parseCategories(row.category);
    const pp = parsePP(row.pp);

    const car = {
      model:        row.model,
      pp:           pp,
      hp:           parseHP(row.hp),
      price:        parsePrice(row.price),
      weight:       parseWeight(row.lbs),
      transmission: row.transmission,
      categories:   categories,
      profile:      classifyProfile({ pp, categories }),
      imgUrl:       row.img_url,
    };

    return car;
  });

  const cleanCars = cars.filter(car => car.profile !== 'unknown');

  const outputPath = path.join(__dirname, '..', 'data', 'cars_clean.json');
  fs.writeFileSync(outputPath, JSON.stringify(cleanCars, null, 2), 'utf-8');

  console.log(`Pré-processamento concluído! ${cleanCars.length} carros salvos.`);
}

preprocess();
