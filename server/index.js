/* eslint-disable import/extensions */
/* eslint-disable camelcase */
const express = require('express');

const app = express();
const path = require('path');
const dummy = require('../dummyData.js');

// const apiUrl = 'http://52.26.193.201:3000/';
const port = 3000;
const prefix = '/qa';

app.use(express.static('public'));

// Potentially scrapping the code below
// ------------------------------------------------------------------------
// app.use(express.json());
// should fix CORS
// app.use((req, res, next) => {
//   res.header('Access-Control-Allow-Origin', '*');
//   next();
// });
// ------------------------------------------------------------------------

// Send bundle.js file (THIS IS FOR PROXY USE ONLY)
app.get('/qaModule', (req, res) => {
  res.sendFile(path.resolve(`${__dirname}/../public/dist/bundle.js`));
});

app.get(`${prefix}/questions`, async (req, res) => {
  // Undetermined if values below will remain needed or not yet
  // const { qLimit, aLimit, product_id } = req.query;
  // Dummy data
  const data = dummy.dummyQuestions;
  // Dummy questions
  const questions = data.results;
  // A boolean from legacy code that is supposed to deal with whether there is more questions than
  // what should be shown somehow? Scrap or keep?
  const isMoreQuestions = false;

  // Client currently expects questions and isMoreQuestions
  res.send({ questions, isMoreQuestions });
});

app.get(`${prefix}/moreAnswers`, (req, res) => {
  // Undetermined if values below will remain needed or not yet
  // const { question_id } = req.query;
  // Dummy data
  const data = dummy.dummyAnswers;
  // Dummy answers
  const { answers } = data;
  // A boolean from legacy code that is supposed to deal with whether there is more answers than
  // what should be shown somehow? Scrap or keep?
  const isMoreAnswers = false;

  res.send({ answers, isMoreAnswers });
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
