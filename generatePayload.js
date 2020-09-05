const faker = require('faker');
const fs = require('fs');
const moment = require('moment');
const { performance } = require('perf_hooks');

const writePayload = fs.createWriteStream('./payload.csv');
writePayload.write('product_id,body,date,name,helpfulness,email,question_id,photos\n', 'utf8');

const t0 = performance.now();

const writeFullPayload = (writer, encoding, callback) => {
  let i = 100000;
  function write() {
    let ok = true;
    do {
      i -= 1;
      const questionBodyLength = Math.floor(Math.random() * (13 - 3 + 1)) + 3;
      // const helpfulnessCount = Math.floor(Math.random() * 30);
      const qID = Math.floor(Math.random() * (100000 - 1 + 1) + 1);
      // const questionid = Math.floor(Math.random() * qIDArr.length);
      const prodID = Math.floor(Math.random() * (100000 - 1 + 1) + 1);

      const data = `${prodID},${faker.lorem.words(questionBodyLength)}?,${moment(faker.date.past()).format('YYYY-MM-DD')},${faker.name.firstName()} ${faker.name.lastName()},0,testemail@gmail.com,${qID},http://placeimg.com/640/480\n`;

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

writeFullPayload(writePayload, 'utf-8', () => {
  writePayload.end();
  const t1 = performance.now();
  console.log(`Data successfully created in ${(t1 - t0).toFixed(2)}ms`);
});
