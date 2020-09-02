import React from 'react';
import axios from 'axios';
import 'regenerator-runtime/runtime.js';

import Accordion from 'react-bootstrap/Accordion';
import Container from 'react-bootstrap/Container';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import InputGroup from 'react-bootstrap/InputGroup';
import FormControl from 'react-bootstrap/FormControl';
import Alert from 'react-bootstrap/Alert';
import Chevron from './Chevron.jsx';
import Search from './Search.jsx';
import SubmitQuestion from './SubmitQuestion.jsx';
import Question from './Question.jsx';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      accOpen: false,
      // props.questions is for testing purposes
      questions: this.props.questions,
      product_name: this.props.product_name,
      product_id: this.props.product_id,
      showSubmitQuestion: false,
      filterDisplay: false,
      filteredQuestions: [],
    };

    this.getQuestions = this.getQuestions.bind(this);
    this.handleOpenSubmit = this.handleOpenSubmit.bind(this);
    this.handleCloseSubmit = this.handleCloseSubmit.bind(this);
    this.changeAnswers = this.changeAnswers.bind(this);
  }

  componentDidMount() {
    this.getQuestions();
  }

  async getQuestions(qLimit = 2, aLimit = 2) {
    const response = await axios.get('/qa/questions', {
      params: {
        qLimit,
        aLimit,
        product_id: this.state.product_id,
      },
    });

    const { isMoreQuestions } = response.data;
    // if (response.data.questions !== undefined) {
      const questions = response.data.questions.sort((a, b) => ((a.question_helpfulness > b.question_helpfulness) ? -1 : 1));
      this.setState({ questions, isMoreQuestions });
      
    // }
  }

  changeAnswers(question_id, newAnswers) {
    // makes deep copy of questions
    const questions = JSON.parse(JSON.stringify(this.state.questions));

    for (let i = 0; i < questions.length; i++) {
      if (questions[i].question_id === question_id) {
        questions[i].answers = newAnswers;
      }
    }

    this.setState({ questions });
  }

  handleOpenSubmit() {
    this.setState({ showSubmitQuestion: true });
  }

  handleCloseSubmit() {
    this.setState({ showSubmitQuestion: false });
  }

  render() {
    // handles undefined props.questions
    let displayQuestions = <span />;
    if (Array.isArray(this.state.questions)) {
      let { questions } = this.state;
      if (this.state.filterDisplay) {
        questions = this.state.filteredQuestions;
      }

      displayQuestions = questions.map((question, index) => (
        <Question
          product_name={this.props.product_name}
          changeAnswers={this.changeAnswers}
          question={question}
          key={index}
        />
      ));

      if (this.state.filterDisplay && displayQuestions.length === 0) {
        displayQuestions = (
          <Alert variant="secondary" id="noQuestionAlert">
            I'm sorry, no questions or answers match your query.
            <br />
            Please try a different one or click below to Submit your own.
          </Alert>
        );
      } else if (!this.state.filterDisplay && displayQuestions.length === 0) {
        displayQuestions = (
          <Alert variant="secondary" id="noQuestionAlert">
            I'm sorry, we could not find any questions or answers for this product.
            <br />
            Please try again later or click below to Submit your own.
          </Alert>
        );
      }
    }

    let seeMoreQuestions = <span />;
    if (this.state.isMoreQuestions) {
      // Button will not display while displaying filtered questions
      seeMoreQuestions = (
        <Button
          variant="outline-dark"
          className="moreQsButton"
          style={Array.isArray(displayQuestions) ? null : { display: 'none' }}
          onClick={() => this.getQuestions(this.state.questions.length + 2)}
        >
          More Answered Questions
        </Button>
      );
    }

    return (
      <Container className="qaApp">
        <Accordion className="qaAppInner">
          <Card>
            <div className="accHeaderDiv">
              <Accordion.Toggle
                className="accHeader"
                as={Card.Header}
                eventKey="0"
                onClick={() => this.setState({ accOpen: !this.state.accOpen })}
              >
                <h4 id="qaTitle">Questions and Answers</h4>
                <Chevron direction={this.state.accOpen ? 'up' : 'down'} />
              </Accordion.Toggle>
            </div>
            <Accordion.Collapse eventKey="0">
              <Card.Body id="qaCard">
                <Search
                  questions={this.state.questions}
                  setFilterState={(bool) => this.setState({ filterDisplay: bool })}
                  setFilteredQuestions={(fQs) => this.setState({ filteredQuestions: fQs })}
                />

                <div className="qaDisplay">
                  {displayQuestions}
                  <div className="seeMoreQs">
                    {seeMoreQuestions}
                  </div>
                </div>

                <SubmitQuestion
                  handleOpenSubmit={this.handleOpenSubmit}
                  handleCloseSubmit={this.handleCloseSubmit}
                  addQuestion={this.addQuestion}
                  product_name={this.state.product_name}
                  product_id={this.state.product_id}
                  show={this.state.showSubmitQuestion}
                />

              </Card.Body>
            </Accordion.Collapse>
          </Card>
        </Accordion>
      </Container>
    );
  }
}

export default App;
