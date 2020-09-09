const faker = require('faker');
// const fs = require('fs');
// const moment = require('moment');
// const { performance } = require('perf_hooks');

// const writePayload = fs.createWriteStream('./payloadProdID.csv');
// writePayload.write('product_id,body,date,name,helpfulness,email,question_id,photos\n', 'utf8');

// const t0 = performance.now();

// const writeFullPayload = (writer, encoding, callback) => {
//   let i = 100000;
//   function write() {
//     let ok = true;
//     do {
//       i -= 1;
//       const questionBodyLength = Math.floor(Math.random() * (13 - 3 + 1)) + 3;
//       // const helpfulnessCount = Math.floor(Math.random() * 30);
//       const qID = Math.floor(Math.random() * (100000 - 1 + 1) + 1);
//       // const questionid = Math.floor(Math.random() * qIDArr.length);
//       const prodID = Math.floor(Math.random() * (100000 - 1 + 1) + 1);

//       const data = `${prodID},${faker.lorem.words(questionBodyLength)}?,${moment(faker.date.past()).format('YYYY-MM-DD')},${faker.name.firstName()} ${faker.name.lastName()},0,testemail@gmail.com,${qID},http://placeimg.com/640/480\n`;

//       if (i === 0) {
//         writer.write(data, encoding, callback);
//       } else {
//         ok = writer.write(data, encoding);
//       }
//     } while (i > 0 && ok);
//     if (i > 0) {
//       writer.once('drain', write);
//     }
//   }
//   write();
// };

// writeFullPayload(writePayload, 'utf-8', () => {
//   writePayload.end();
//   const t1 = performance.now();
//   console.log(`Data successfully created in ${(t1 - t0).toFixed(2)}ms`);
// });
module.exports = {
  generateQuestionID1: (context, events, done) => {
    context.vars.question_id = Math.floor(Math.random() * (3333333 - 1 + 1) + 1);
    return done();
  },

  generateQuestionID2: (context, events, done) => {
    context.vars.question_id = Math.floor(Math.random() * (6666666 - 3333333 + 1) + 3333333);
    return done();
  },

  generateQuestionID3: (context, events, done) => {
    context.vars.question_id = Math.floor(Math.random() * (10000000 - 6666666 + 1) + 6666666);
    return done();
  },

  generateProductID1: (context, events, done) => {
    context.vars.product_id = Math.floor(Math.random() * (500000 - 1 + 1) + 1);
    return done();
  },

  generateProductID2: (context, events, done) => {
    context.vars.product_id = Math.floor(Math.random() * (1000000 - 500000 + 1) + 500000);
    return done();
  },

  generateBody: (context, events, done) => {
    context.vars.body = faker.lorem.words(5);
    return done();
  },

  generateName: (context, events, done) => {
    context.vars.name = `${faker.name.firstName()} ${faker.name.lastName()}`;
    return done();
  },
};
