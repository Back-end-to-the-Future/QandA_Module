const faker = require('faker');
const fs = require('fs');
const moment = require('moment');
const { performance } = require('perf_hooks');

const writeAnswers = fs.createWriteStream('./fakerAnswers.csv');
writeAnswers.write('body,date,answerer_name,helpfulness,question_id,reported\n', 'utf8');

const t0 = performance.now();

const writeFullAnswers = (writer, encoding, callback) => {
  let i = 20000000;
  function write() {
    let ok = true;
    do {
      i -= 1;
      const answerBodyLength = Math.floor(Math.random() * (13 - 3 + 1)) + 3;
      const helpfulnessCount = Math.floor(Math.random() * 30);
      const questionID = Math.floor(Math.random() * (10000000 - 1 + 1)) + 1;

      const data = `${faker.lorem.words(answerBodyLength)}?,${moment(faker.date.past()).format('YYYY-MM-DD')},${faker.name.firstName()} ${faker.name.lastName()},${helpfulnessCount},${questionID},0\n`;

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

writeFullAnswers(writeAnswers, 'utf-8', () => {
  writeAnswers.end();
  const t1 = performance.now();
  console.log(`Data successfully created in ${(t1 - t0).toFixed(2)}ms`);
});
