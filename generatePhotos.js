/* eslint-disable no-loop-func */
/* eslint-disable no-console */
const faker = require('faker');
const fs = require('fs');
const moment = require('moment');
const { performance } = require('perf_hooks');

const writePhotos = fs.createWriteStream('./fakerPhotos.csv');
writePhotos.write('link,answer_id,\n', 'utf8');

const t0 = performance.now();

const writeFullPhotos = (writer, encoding, callback) => {
  let i = 5000000;
  function write() {
    let ok = true;
    do {
      i -= 1;
      const answerID = Math.floor(Math.random() * (20000000 - 1 + 1)) + 1;

      const data = `${faker.image.imageUrl()},${answerID}\n`;

      if (i === 0) {
        writer.write(data, encoding, callback);
      } else {
        ok = writer.write(data, encoding);
      }
    } while (i > 0 && ok);
    if (i > 0) {
      writer.once('drain', write);
    }
  }
  write();
};

writeFullPhotos(writePhotos, 'utf-8', () => {
  writePhotos.end();
  const t1 = performance.now();
  console.log(`Data successfully created in ${(t1 - t0).toFixed(2)}ms`);
});
