// API CALL TO QA/QUESTIONS
module.exports.dummyQuestions = {
  product_id: '3',
  results: [
    {
      question_id: 29,
      question_body: 'What fabric is the top made of?',
      question_date: '2018-11-08T00:00:00.000Z',
      asker_name: 'wonderwoman',
      question_helpfulness: 5,
      reported: 0,
      answers: {
        14: {
          id: 14,
          body: "Something pretty soft but I can't be sure",
          date: '2018-01-08T00:00:00.000Z',
          answerer_name: 'superman',
          helpfulness: 5,
          photos: [],
        },
        85: {
          id: 85,
          body: 'Its the best! Seriously magic fabric',
          date: '2018-11-08T00:00:00.000Z',
          answerer_name: 'superman',
          helpfulness: 4,
          photos: [],
        },
        86: {
          id: 86,
          body: 'Supposedly suede, but I think its synthetic',
          date: '2018-12-08T00:00:00.000Z',
          answerer_name: 'superman',
          helpfulness: 8,
          photos: [],
        },
        124986: {
          id: 124986,
          body: 'All made of the best material known to man!',
          date: '2020-08-20T00:00:00.000Z',
          answerer_name: 'Seller',
          helpfulness: 2,
          photos: [
            'https://images.unsplash.com/photo-1542291026-7eec264c27ff?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60',
            'https://images.unsplash.com/photo-1463100099107-aa0980c362e6?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60',
            'https://images.unsplash.com/photo-1578116922645-3976907a7671?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60',
            'https://images.unsplash.com/photo-1575537302964-96cd47c06b1b?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60',
            'https://images.unsplash.com/photo-1449505278894-297fdb3edbc1?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60',
          ],
        },
      },
    },
    {
      question_id: 30,
      question_body: 'Why is this product cheaper here than other sites?',
      question_date: '2018-07-28T00:00:00.000Z',
      asker_name: 'l33tgamer',
      question_helpfulness: 4,
      reported: 0,
      answers: {
        103: {
          id: 103,
          body: 'This site is awesome!',
          date: '2018-09-28T00:00:00.000Z',
          answerer_name: 'n00bgamer',
          helpfulness: 7,
          photos: [],
        },
        104: {
          id: 104,
          body: "I can't find it cheaper anywhere else?",
          date: '2018-09-28T00:00:00.000Z',
          answerer_name: 'n00bgamer',
          helpfulness: 8,
          photos: [],
        },
        105: {
          id: 105,
          body: 'The other sites are marking it up!',
          date: '2018-09-28T00:00:00.000Z',
          answerer_name: 'Seller',
          helpfulness: 9,
          photos: [],
        },
      },
    },
    {
      question_id: 16,
      question_body: 'How long does it last?',
      question_date: '2018-08-24T00:00:00.000Z',
      asker_name: 'funnygirl',
      question_helpfulness: 0,
      reported: 0,
      answers: {},
    },
    {
      question_id: 26,
      question_body: "I'm allergic to dye #17, does this product contain any?",
      question_date: '2018-10-08T00:00:00.000Z',
      asker_name: 'rhcp81',
      question_helpfulness: 0,
      reported: 0,
      answers: {
        4: {
          id: 4,
          body: 'No',
          date: '2018-08-08T00:00:00.000Z',
          answerer_name: 'Seller',
          helpfulness: 4,
          photos: [],
        },
      },
    },
  ],
};

// API CALL TO QA/Answers
module.exports.dummyAnswers = {
  answers: [
    {
      answer_id: 105,
      body: 'The other sites are marking it up!',
      date: '2018-09-28T00:00:00.000Z',
      answerer_name: 'Seller',
      helpfulness: 9,
      photos: [],
    },
    {
      answer_id: 104,
      body: "I can't find it cheaper anywhere else?",
      date: '2018-09-28T00:00:00.000Z',
      answerer_name: 'n00bgamer',
      helpfulness: 8,
      photos: [],
    },
    {
      answer_id: 103,
      body: 'This site is awesome!',
      date: '2018-09-28T00:00:00.000Z',
      answerer_name: 'n00bgamer',
      helpfulness: 7,
      photos: [],
    },
  ],
  // isMoreAnswers: false,
};
