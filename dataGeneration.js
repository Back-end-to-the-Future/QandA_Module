/* eslint-disable no-console */
const faker = require('faker');
const fs = require('fs');

let seedQuestions = 'question_body,question_date,asker_name,question_helpfulness,reported,product_id,\n';
let seedAnswers = 'body,date,answerer_name,helpfulness,question_id,\n';
let seedPhotos = 'link,answer_id\n';

// SAMPLE CSV
// question_body,question_date,asker_name,question_helpfulness,reported,product_id,
// test question,1991-01-05,Jeff,3,false

// Generates the table data for questions
const generateQuestions = () => {
  for (let i = 0; i < 10; i += 1) {
    const questionBodyLength = Math.floor(Math.random() * (13 - 3 + 1)) + 3;
    const helpfulnessCount = Math.floor(Math.random() * 30);

    seedQuestions = seedQuestions.concat(
      `${faker.lorem.words(questionBodyLength)}?,${faker.date.past()},${faker.name.firstName()} ${faker.name.lastName()},${helpfulnessCount},0,${i}\n`,
    );
  }

  fs.writeFile('./fakerQuestions.csv', seedQuestions, (err) => {
    if (err) {
      console.log(err);
    }
  });
};

// Generates the table data for answers
const generateAnswers = () => {
  for (let i = 0; i < 10; i += 1) {
    const answerBodyLength = Math.floor(Math.random() * (13 - 3 + 1)) + 3;
    const helpfulnessCount = Math.floor(Math.random() * 30);
    // const questionID = Math.floor(Math.random() );

    seedAnswers = seedAnswers.concat(
      `${faker.lorem.words(answerBodyLength)}?,${faker.date.past()},${faker.name.firstName()} ${faker.name.lastName()},${helpfulnessCount},\n`,
    );
  }

  fs.writeFile('./fakerAnswers.csv', seedAnswers, (err) => {
    if (err) {
      console.log(err);
    }
  });
};

const generatePhotos = () => {
  for (let i = 0; i < 1; i += 1) {
    seedPhotos = seedPhotos.concat(
      `${faker.image.imageUrl()},${i},\n`,
    );
  }

  fs.writeFile('./fakerPhotos.csv', seedPhotos, (err) => {
    if (err) {
      console.log(err);
    }
  });
};

// generateQuestions();
// generateAnswers();
// generatePhotos();

console.log(faker.address.streetAddress());