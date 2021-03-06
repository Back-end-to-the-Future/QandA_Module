/* eslint-disable no-shadow */
/* eslint-disable no-param-reassign */
/* eslint-disable eqeqeq */
/* eslint-disable guard-for-in */
/* eslint-disable no-restricted-syntax */
/* eslint-disable no-console */
/* eslint-disable import/extensions */
/* eslint-disable camelcase */
require('newrelic');
const express = require('express');
const moment = require('moment');

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
    text: 'SELECT * FROM q_and_a_schema.questions WHERE product_id = $1 AND reported = 0',
    values: [`${product_id}`],
  };

  await pool.query(questionsQuery)
    .then((response) => {
      questions = response.rows;
      questions.forEach((el) => {
        if (el.reported === 0) {
          questionIDs.push(el.question_id);
        }
      });
    })
    .catch((err) => {
      console.log(err);
    });

  // ANSWERS QUERY
  async function asyncForEach(array, callback) {
    for (let index = 0; index < array.length; index += 1) {
      // eslint-disable-next-line no-await-in-loop
      await callback(array[index], index, array);
    }
  }

  const getAnswers = async () => {
    await asyncForEach(questionIDs, async (el) => {
      const answersQuery = {
        name: 'fetch-answers',
        text: 'SELECT * FROM q_and_a_schema.answers WHERE question_id = $1 AND reported = 0',
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

          for (const key in modifiedQuestion.answers) {
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
        if (i + 1 === answerIDs.length) {
          res.send({ questions });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  });
});

app.get(`${prefix}/moreAnswers`, async (req, res) => {
  // ---------------------------------------------------------------

  // THIS ROUTE IS POTENTIALLY NOT ABLE TO BE IMPLEMENTED WITHOUT CLIENTSIDE REFACTOR

  // ---------------------------------------------------------------
  // Undetermined if values below will remain needed or not yet
  const { question_id } = req.query;
  const isMoreAnswers = false;
  // console.log(question_id);
  const answerIDs = [];
  const answers = {};

  // const getAnswers = async () => {
  // await asyncForEach(questionIDs, async (el) => {
  const answersQuery = {
    name: 'fetch-answers',
    text: 'SELECT * FROM q_and_a_schema.answers WHERE question_id = $1',
    values: [`${question_id}`],
  };

  // await pool.query(answersQuery)
  //   .then((answerData) => {
  //     // console.log(answers.rows)
  //     // Store answer ID's needed for photos query
  //     answerData.rows.forEach((ansId) => {
  //       answerIDs.push(ansId.id);
  //     });
  //     return answerData;
  //   })
  //   .then((answersData) => {
  //     // console.log(answersData.rows);
  //     answers = answersData.rows;
  //   })
  //   .catch((err) => {
  //     console.log(err);
  //   });

  // // console.log(answers);
  // // PHOTOS QUERY
  // answerIDs.forEach((ansID, i) => {
  //   const photoQuery = {
  //     name: 'fetch-photos',
  //     text: 'SELECT * FROM q_and_a_schema.photos WHERE answer_id = $1',
  //     values: [`${ansID}`],
  //   };

  //   pool.query(photoQuery)
  //     .then((photos) => {
  //       // photos have answer id and must match answers id number
  //       // questions.map((question) => {
  //       const modifiedAnswer = answer;

  //       for (const key in modifiedQuestion.answers) {
  //         if (modifiedQuestion.answers[key].photos === undefined) {
  //           modifiedQuestion.answers[key].photos = [];

  //           photos.rows.forEach((photo) => {
  //             // eslint-disable-next-line max-len
  //             if (key == photo.answer_id && !modifiedQuestion.answers[key].photos.hasOwnProperty()) {
  //               modifiedQuestion.answers[key].photos.push(photo.link);
  //             }
  //           });
  //         } else {
  //           photos.rows.forEach((photo) => {
  //             if (key == photo.answer_id) {
  //               modifiedQuestion.answers[key].photos.push(photo.link);
  //             }
  //           });
  //         }
  //       }
  //       return modifiedQuestion;
  //       // });
  //     })
  //     .then(() => {
  //       if (i + 1 === answerIDs.length) {
  //         // res.send({ answers, isMoreAnswers });
  //       }
  //     })
  //     .catch((err) => {
  //       console.log(err);
  //     });
  // });

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
  const { answer_id } = req.body;
  pool.query(`UPDATE q_and_a_schema.answers SET helpfulness = helpfulness + 1 WHERE id = ${answer_id}`);
  res.sendStatus(204);
});

// ROUTE TO REPORT QUESTIONS
app.put(`${prefix}/question/report`, (req, res) => {
  const { question_id } = req.body;
  pool.query(`UPDATE q_and_a_schema.questions SET reported = reported + 1 WHERE question_id = ${question_id}`);
  res.sendStatus(204);
});

// ROUTE TO REPORT ANSWERS
app.put(`${prefix}/answer/report`, (req, res) => {
  const { answer_id } = req.body;
  pool.query(`UPDATE q_and_a_schema.answers SET reported = reported + 1 WHERE id = ${answer_id}`);
  res.sendStatus(204);
});

// ROUTE TO VOTE QUESTIONS HELPFUL
app.put(`${prefix}/question/helpful`, (req, res) => {
  const { question_id } = req.body;
  pool.query(`UPDATE q_and_a_schema.questions SET question_helpfulness = question_helpfulness + 1 WHERE question_id = ${question_id}`);
  res.sendStatus(204);
});

// ROUTE TO ADD A NEW QUESTION
app.post(`${prefix}/question/add`, (req, res) => {
  const { product_id, ...questionSub } = req.body;

  const date = new Date();
  const currentDate = moment(date).format('YYYY-MM-DD');

  const text = 'INSERT INTO q_and_a_schema.questions(question_body, question_date, asker_name, question_helpfulness, reported, product_id) VALUES($1, $2, $3, $4, $5, $6) RETURNING *';
  const values = [questionSub.body, currentDate, questionSub.name, 0, 0, product_id.toString()];

  pool.query(text, values, (err, res) => {
    if (err) {
      console.log(err.stack);
    }
  });

  res.sendStatus(201);
});

// ROUTE TO ADD AN ANSWER TO A QUESTION
app.post(`${prefix}/answer/add`, (req, res) => {
  const { question_id, ...answerSub } = req.body;
  const date = new Date();
  const currentDate = moment(date).format('YYYY-MM-DD');

  const text = 'INSERT INTO q_and_a_schema.answers(body, date, answerer_name, helpfulness, question_id, reported) VALUES($1, $2, $3, $4, $5, $6) RETURNING *';
  const values = [answerSub.body, currentDate, answerSub.name, 0, question_id, 0];

  pool.query(text, values, (err, res) => {
    if (err) {
      console.log(err.stack);
    } else if (answerSub.photos !== null) {
      const findAnswer = 'SELECT * FROM q_and_a_schema.answers WHERE question_id = $1 ORDER BY id DESC LIMIT 1';
      const value = [question_id];

      pool.query(findAnswer, value, (err, res) => {
        if (err) {
          console.log(err.stack);
        } else {
          const photoInsert = 'INSERT INTO q_and_a_schema.photos(link, answer_id) VALUES($1, $2) RETURNING *';
          const vals = [answerSub.photos, res.rows[0].id];

          pool.query(photoInsert, vals, (error, res) => {
            if (error) {
              console.log(error.stack);
            }
          });
        }
      });
    }
  });

  res.sendStatus(201);
});

app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`listening on port ${port}`);
});
