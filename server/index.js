/* eslint-disable no-param-reassign */
/* eslint-disable eqeqeq */
/* eslint-disable guard-for-in */
/* eslint-disable no-restricted-syntax */
/* eslint-disable no-console */
/* eslint-disable import/extensions */
/* eslint-disable camelcase */
const express = require('express');

const app = express();
const path = require('path');
const dummy = require('../dummyData.js');
const pool = require('../db.js');

// const apiUrl = 'http://52.26.193.201:3000/';
const port = 3000;
const prefix = '/qa';

app.use(express.static('public'));

// Potentially scrapping the code below
// ------------------------------------------------------------------------
app.use(express.json());
// should fix CORS
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  next();
});
// ------------------------------------------------------------------------

// Send bundle.js file (THIS IS FOR PROXY USE ONLY)
app.get('/qaModule', (req, res) => {
  res.sendFile(path.resolve(`${__dirname}/../public/dist/bundle.js`));
});

app.get(`${prefix}/questions`, async (req, res) => {
  // Undetermined if values below will remain needed or not yet
  // const { qLimit, aLimit, product_id } = req.query;
  const { product_id } = req.query;
  // const isMoreQuestions = false;
  // let questionsResult = '';
  const questionIDs = [];
  const answerIDs = [];
  let questions = [];
  // const answers = [];

  // QUESTIONS QUERY
  const questionsQuery = {
    name: 'fetch-questions',
    text: 'SELECT * FROM q_and_a_schema.questions WHERE product_id = $1',
    values: [`${product_id}`],
  };

  await pool.query(questionsQuery)
    .then((response) => {
      questions = response.rows;
      questions.forEach((el) => {
        questionIDs.push(el.question_id);
      });
    })
    .catch((err) => {
      console.log(err);
    });

  // ANSWERS QUERY
  async function asyncForEach(array, callback) {
    for (let index = 0; index < array.length; index += 1) {
      await callback(array[index], index, array);
    }
  }

  const getAnswers = async () => {
    await asyncForEach(questionIDs, async (el) => {
      const answersQuery = {
        name: 'fetch-answers',
        text: 'SELECT * FROM q_and_a_schema.answers WHERE question_id = $1',
        values: [`${el}`],
      };

      await pool.query(answersQuery)
        .then((answers) => {
          // Store answer ID's needed for photos query
          answers.rows.forEach((ansId) => {
            answerIDs.push(ansId.id);
          });
          return answers;
        })
        .then((answers) => {
          questions.map((question) => {
            const modifiedQuestion = question;

            if (question.answers === undefined) {
              // If answers property doesn't exist create it
              modifiedQuestion.answers = {};
            } else {
              // Iterate over answers to assign them to questions
              answers.rows.forEach((answer) => {
                if (answer.question_id == question.question_id) {
                  // Check if specific question already has the current answer
                  // eslint-disable-next-line no-prototype-builtins
                  if (!modifiedQuestion.answers.hasOwnProperty(answer)) {
                    modifiedQuestion.answers[answer.id] = answer;
                  }
                }
              });
            }
            return modifiedQuestion;
          });
        })
        .catch((err) => {
          console.log(err);
        });
    });
  };
  await getAnswers();

  // PHOTOS QUERY
  answerIDs.forEach((ansID, i) => {
    const photoQuery = {
      name: 'fetch-photos',
      text: 'SELECT * FROM q_and_a_schema.photos WHERE answer_id = $1',
      values: [`${ansID}`],
    };

    pool.query(photoQuery)
      .then((photos) => {
        // photos have answer id and must match answers id number
        questions.map((question) => {
          const modifiedQuestion = question;

          for (let key in modifiedQuestion.answers) {
            if (modifiedQuestion.answers[key].photos === undefined) {
              modifiedQuestion.answers[key].photos = [];

              photos.rows.forEach((photo) => {
                // eslint-disable-next-line max-len
                if (key == photo.answer_id && !modifiedQuestion.answers[key].photos.hasOwnProperty()) {
                  modifiedQuestion.answers[key].photos.push(photo.link);
                }
              });
            } else {
              photos.rows.forEach((photo) => {
                if (key == photo.answer_id) {
                  modifiedQuestion.answers[key].photos.push(photo.link);
                }
              });
            }
          }
          return modifiedQuestion;
        });
      })
      .then(() => {
        console.log(questions[1]);
        if (i + 1 === answerIDs.length) {
          res.send({ questions });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  });

  // Dummy data
  // const data = dummy.dummyQuestions;
  // // Dummy questions
  // const questions = data.results;
  // // res.send(questions)
  // A boolean from legacy code that is supposed to deal with whether there is more questions than
  // // what should be shown somehow? Scrap or keep?
  // const isMoreQuestions = false;

  // // Client currently expects questions and isMoreQuestions
  // res.send({ questions });
});

app.get(`${prefix}/moreAnswers`, (req, res) => {
  // Undetermined if values below will remain needed or not yet
  const { question_id } = req.query;
  const isMoreAnswers = false;
  // console.log(question_id);

  let answers = '';
  const query = {
    name: 'fetch-answers',
    text: 'SELECT * FROM q_and_a_schema.answers WHERE question_id = $1',
    values: [`${question_id}`],
  };
  // console.log(query);

  pool.query(query)
    .then((response) => {
      answers = response.rows;
      console.log(answers);
      res.send({ answers, isMoreAnswers });
    })
    .catch((err) => {
      console.log(err);
    });

  // Dummy data
  // const data = dummy.dummyAnswers;
  // Dummy answers
  // const { answers } = data;
  // A boolean from legacy code that is supposed to deal with whether
  // there is more answers than
  // what should be shown somehow? Scrap or keep?
  // const isMoreAnswers = false;

  // res.send({ answers, isMoreAnswers });
});

app.put(`${prefix}/answer/helpful`, (req, res) => {
  // Undetermined if values below will remain needed or not yet
  // const { answer_id } = req.body;
  res.sendStatus(204);
});

// ROUTE TO REPORT QUESTIONS
app.put(`${prefix}/question/report`, (req, res) => {
  // Undetermined if values below will remain needed or not yet
  // const { question_id } = req.body;
  res.sendStatus(204);
});

// ROUTE TO REPORT ANSWERS
app.put(`${prefix}/answer/report`, (req, res) => {
  // Undetermined if values below will remain needed or not yet
  // const { answer_id } = req.body;
  res.sendStatus(204);
});

// ROUTE TO VOTE QUESTIONS HELPFUL
app.put(`${prefix}/question/helpful`, (req, res) => {
  // Undetermined if values below will remain needed or not yet
  // const { question_id } = req.body;
  res.sendStatus(204);
});

// ROUTE TO ADD A NEW QUESTION
app.post(`${prefix}/question/add`, (req, res) => {
  // Undetermined if values below will remain needed or not yet
  // const { product_id, ...questionSub } = req.body;
  res.sendStatus(201);
});

// ROUTE TO ADD AN ANSWER TO A QUESTION
app.post(`${prefix}/answer/add`, (req, res) => {
  // Undetermined if values below will remain needed or not yet
  // const { question_id, ...answerSub } = req.query;
  res.sendStatus(201);
});

app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`listening on port ${port}`);
});
