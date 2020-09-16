# Delphi System Designs - Questions and Answers Microserver

> Delphi System Designs is an e-commerce platform specializing in aftermarket automotive parts.
This repository contains the code for the questions and answers microservice of this platforms e-commerce product pages.
I inherited a legacy front-end code base to this application and was tasked with building out a scalable back-end that could handle
web traffic at a minimum of 1000 requests per second under load.

## Table of Contents

1. [Related Projects](#related-projects)
2. [Achievements and Optimizations](#achievements-and-optimizations)
3. [Technologies Used](#technologies-used)
4. [Requirements](#requirements)
5. [Development](#development)
6. [Questions and Answers API](#questions-and-answers-api)

## Related Projects

  - https://github.com/Back-end-to-the-Future/product-overview
  - https://github.com/Back-end-to-the-Future/ratings-and-reviews-module
  - https://github.com/Back-end-to-the-Future/Zach_Proxy

## Achievements and Optimizations

 - Seeded a PostgreSQL database with 35 million records
 - Optimized PostgreSQL query times from 30+ seconds to 12ms through indexing
 - Achieved a throughput of 1085 requests per second when load testing locally.
 
 ![Alt Text](https://i.imgur.com/TCD7KhS.png)
 
## Technologies Used

 - JavaScript
 - React
 - Bootstrap
 - Express
 - Node.js
 - Jest
 - Enzyme
 - Amazon Web Services
 - Artillery
 - New Relic

## Requirements

- Node 6.13.0 or greater
- npm

## Development

### Installing Dependencies

> The following commands will install the application dependencies, run webpack to compile the application and start the development server

    npm install
    npm run react-dev
    npm run start

From within the root directory:

```sh
npm install
```

# Questions and Answers API
### List Questions

`GET /qa/:product_id`
Retrieves a list of questions for a particular product.  This list *does not* include any reported questions.

Parameters

| Parameter  | Type    | Description                                               |
| ---------- | ------- | --------------------------------------------------------- |
| product_id | integer | Specifies the product for which to retrieve questions.    |
| page       | integer | Selects the page of results to return.  Default 1.        |
| count      | integer | Specifies how many results per page to return. Default 5. |

Response

`Status: 200 OK `

```json
{
  "product_id": "5",
  "results": [{
        "question_id": 37,
        "question_body": "Why is this product cheaper here than other sites?",
        "question_date": "2018-10-18T00:00:00.000Z",
        "asker_name": "williamsmith",
        "question_helpfulness": 4,
        "reported": 0,
        "answers": {
          68: {
            "id": 68,
            "body": "We are selling it here without any markup from the middleman!",
            "date": "2018-08-18T00:00:00.000Z",
            "answerer_name": "Seller",
            "helpfulness": 4,
            "photos": []
            // ...
          }
        }
      },
      {
        "question_id": 38,
        "question_body": "How long does it last?",
        "question_date": "2019-06-28T00:00:00.000Z",
        "asker_name": "funnygirl",
        "question_helpfulness": 2,
        "reported": 0,
        "answers": {
          70: {
            "id": 70,
            "body": "Some of the seams started splitting the first time I wore it!",
            "date": "2019-11-28T00:00:00.000Z",
            "answerer_name": "sillyguy",
            "helpfulness": 6,
            "photos": [],
          },
          78: {
            "id": 78,
            "body": "9 lives",
            "date": "2019-11-12T00:00:00.000Z",
            "answerer_name": "iluvdogz",
            "helpfulness": 31,
            "photos": [],
          }
        }
      },
      // ...
  ]
}
```



### Answers List

Returns answers for a given question. This list *does not* include any reported answers.

`GET /qa/:question_id/answers`

Parameters

| Parameter   | Type    | Description                                               |
| ----------- | ------- | --------------------------------------------------------- |
| question_id | integer | Required ID of the Question requested                     |
| page        | integer | Selects the page of results to return.  Default 1.        |
| count       | integer | Specifies how many results per page to return. Default 5. |

Response

`Status: 200 OK `

```json
{
  "question": "1",
  "page": 0,
  "count": 5,
  "results": [
    {
      "answer_id": 8,
      "body": "What a great question!",
      "date": "2018-01-04T00:00:00.000Z",
      "answerer_name": "metslover",
      "helpfulness": 8,
      "photos": [],
    },
    {
      "answer_id": 5,
      "body": "Something pretty durable but I can't be sure",
      "date": "2018-01-04T00:00:00.000Z",
      "answerer_name": "metslover",
      "helpfulness": 5,
      "photos": [{
          "id": 1,
          "url": "urlplaceholder/answer_5_photo_number_1.jpg"
        },
        {
          "id": 2,
          "url": "urlplaceholder/answer_5_photo_number_2.jpg"
        },
        // ...
      ]
    },
    // ...
  ]
}
```



### Add a Question

Adds a question for the given product

`POST /qa/:product_id`

Parameters

| Parameter  | Type    | Description                                         |
| ---------- | ------- | --------------------------------------------------- |
| product_id | integer | Required ID of the Product to post the question for |

Body Parameters

| Parameter | Type | Description                      |
| --------- | ---- | -------------------------------- |
| body      | text | Text of question being asked     |
| name      | text | Username for question asker      |
| email     | text | Email address for question asker |

Response

`Status: 201 CREATED `



### Add an Answer

Adds an answer for the given question

`POST /qa/:question_id/answers`

Parameters

| Parameter   | Type    | Description                                        |
| ----------- | ------- | -------------------------------------------------- |
| question_id | integer | Required ID of the question to post the answer for |

Body Parameters

| Parameter | Type   | Description                                         |
| --------- | ------ | --------------------------------------------------- |
| body      | text   | Text of question being asked                        |
| name      | text   | Username for question asker                         |
| email     | text   | Email address for question asker                    |
| photos    | [text] | An array of urls corresponding to images to display |

Response

`Status: 201 CREATED `



### Mark Question as Helpful

Updates a question to show it was found helpful.

`PUT /qa/question/:question_id/helpful`

Parameters

| Parameter   | Type    | Description                           |
| ----------- | ------- | ------------------------------------- |
| question_id | integer | Required ID of the question to update |

Response

`Status: 204 NO CONTENT `



### Report Question

Updates a question to show it was reported. Note, this action does not delete the question, but the question will not be returned in the above GET request.

`PUT /qa/question/:question_id/report`

Parameters

| Parameter   | Type    | Description                           |
| ----------- | ------- | ------------------------------------- |
| question_id | integer | Required ID of the question to update |

Response

`Status: 204 NO CONTENT `



### Mark Answer as Helpful

Updates an answer to show it was found helpful.

`PUT /qa/answer/:answer_id/helpful`

Parameters

| Parameter | Type    | Description                         |
| --------- | ------- | ----------------------------------- |
| answer_id | integer | Required ID of the answer to update |

Response

`Status: 204 NO CONTENT `



### Report Answer

Updates an answer to show it has been reported.  Note, this action does not delete the answer, but the answer will not be returned in the above GET request.

`PUT /qa/answer/:answer_id/report`

Parameters

| Parameter | Type    | Description                         |
| --------- | ------- | ----------------------------------- |
| answer_id | integer | Required ID of the answer to update |

Response

`Status: 204 NO CONTENT `


