const faker = require('faker');
const fs = require('fs');
const moment = require('moment');
const { performance } = require('perf_hooks');

const writeQuestions = fs.createWriteStream('./fakerQuestions.csv');
writeQuestions.write('question_body,question_date,asker_name,question_helpfulness,reported,product_id,\n', 'utf8');

const t0 = performance.now();

const writeFullQuestions = (writer, encoding, callback) => {
  let i = 10000000;
  function write() {
    let ok = true;
    do {
      i -= 1;
      const questionBodyLength = Math.floor(Math.random() * (13 - 3 + 1)) + 3;
      const helpfulnessCount = Math.floor(Math.random() * 30);
      const productID = Math.floor(Math.random() * 1000000);

      const data = `${faker.lorem.words(questionBodyLength)}?,${moment(faker.date.past()).format('YYYY-MM-DD')},${faker.name.firstName()} ${faker.name.lastName()},${helpfulnessCount},0,${productID}\n`;

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

writeFullQuestions(writeQuestions, 'utf-8', () => {
  writeQuestions.end();
  const t1 = performance.now();
  console.log(`Data successfully created in ${(t1 - t0).toFixed(2)}ms`);
});
