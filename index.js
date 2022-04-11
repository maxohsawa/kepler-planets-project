const { parse } = require('csv-parse');
const fs = require('fs');

const results = [];

/*
  - koi_disposition represents whether the planet has been CONFIRMED
  - koi_insol represents the amount of stellar emissions that the planet receives as a proportion compared to what Earth receives from Sol. This value should be between 0.36 and 1.11
  - koi_prad represents the planetary radius as a proportion of Earth's radius. This value should be a maximum of 1.6 as larger planets tend to be gaseous
*/
function isHabitablePlanet(planet) {
  return planet['koi_disposition'] === 'CONFIRMED'
    && planet['koi_insol'] > 0.36 && planet['koi_insol'] < 1.11
    && planet['koi_prad'] < 1.6;
}

fs.createReadStream('kepler_data.csv')
  .pipe(parse({
    comment: '#',
    columns: true
  }))
  .on('data', (data) => {
    if (isHabitablePlanet(data)) {
      results.push(data);
    }
  })
  .on('end', () => {
    console.log(results);
    console.log(`${results.length} habitable planets found!`);
  })
  .on('error', (err) => {
    console.log(err);
  })