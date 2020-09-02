import React from 'react';
import axios from 'axios';
import _ from 'lodash';

import Answer from './Answer.jsx';
import SubmitAnswer from './SubmitAnswer.jsx';

import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Alert from 'react-bootstrap/Alert';

class Question extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      question: this.props.question,
      answers: this.props.question.answers,
      // isMoreAnswers: this.props.question.answers.isMoreAnswers,
      helpfulness: this.props.question.question_helpfulness,
      helpfulClicked: false,
      reported: false,
      showSubmitAnswer: false
    }

    this.incrementHelpfulQuestion = this.incrementHelpfulQuestion.bind(this);
    this.reportQuestion = this.reportQuestion.bind(this);
  }

  componentDidUpdate(prevProps) {
    if (!_.isEqual(this.props, prevProps)) {
      this.setState({
        question: this.props.question,
        // isMoreAnswers: this.props.question.answers.isMoreAnswers,
        helpfulness: this.props.question.question_helpfulness,
        helpfulClicked: false,
        reported: false,
        showSubmitAnswer: false
      });
    }
  }

  incrementHelpfulQuestion() {
    axios.put('/qa/question/helpful', { question_id: this.state.question.question_id });

    this.setState({ helpfulness: this.state.helpfulness + 1, helpfulClicked: true });
  }

  reportQuestion() {
    axios.put('/qa/question/report', { question_id: this.state.question.question_id });

    this.setState({ reported: true });
  }

  async getMoreAnswers() {
    let response = await axios.get('/qa/moreAnswers', {
      params: {
        question_id: this.state.question.question_id
      }
    })

    let answers = response.data.answers;
    let isMoreAnswers = response.data.isMoreAnswers;

    let answersObj = answers.reduce((obj, answer) => {
      if (answer.id) {
        obj[answer.id] = answer;
      } else {
        obj[answer.answer_id] = answer;
      }

      return obj;
    }, {})

    answersObj.isMoreAnswers = isMoreAnswers;

    this.props.changeAnswers(this.state.question.question_id, answersObj);
  }

  collapseAnswers() {
    let answersObj = this.state.question.answers;
    let shortAnswers = {};
    for (let id in answersObj) {
      if (id !== 'isMoreAnswers') {
        shortAnswers[id] = answersObj[id];
        if (Object.keys(shortAnswers).length === 2) {
          break;
        }
      }
    }

    shortAnswers.isMoreAnswers = true;

    this.props.changeAnswers(this.state.question.question_id, shortAnswers);
  }

  handleOpenSubmit() {
    this.setState({ showSubmitAnswer: true });
  }

  handleCloseSubmit() {
    this.setState({ showSubmitAnswer: false });
  }

  render() {
    let answersObj = this.state.question.answers;
    let answers = [];
    for (let id in answersObj) {
      if (id !== 'isMoreAnswers') {
        answers.push(answersObj[id]);
      }
    }

    // sort array of answers by helpfulness
    answers.sort((a, b) => (a.helpfulness > b.helpfulness) ? -1 : 1);

    // moves seller answers to top of the list
    for (let i = answers.length - 1; i >= 0; i--) {
      if (answers[i].answerer_name === 'Seller') {
        let sellerAns = answers.splice(i, 1);
        answers.unshift(sellerAns[0]);
      }
    }

    let noAnswers = <span></span>;
    if (answers.length === 0) {
      noAnswers = (
        <Alert variant='secondary' id='noAnswerAlert'>
          I'm sorry, no one has answered this question yet.<br />If you have an answer please Submit it below.
        </Alert>
      );
    }

    let moreAnswers;
    if (this.state.isMoreAnswers) {
      moreAnswers = <Button variant='outline-dark' className='moreAnswers' onClick={this.getMoreAnswers.bind(this)}>See More Answers</Button>;
    } else if (answers.length <= 2) {
      moreAnswers = <span></span>;
    } else {
      moreAnswers = <Button variant='outline-dark' className='collapseAnswers' onClick={this.collapseAnswers.bind(this)}>Collapse Answers</Button>;
    }

    let helpfulButton = <Button variant="outline-dark" size="sm" className="qHelpfulBtn"
      onClick={this.incrementHelpfulQuestion} >Yes ({this.state.helpfulness})</Button>;
    if (this.state.helpfulClicked) {
      helpfulButton = <Button variant="secondary" size="sm" className="qHelpfulBtn btn-secondary">Yes ({this.state.helpfulness})</Button>;
    }

    let reportButton = <Button variant="outline-dark" size="sm" className="qReportBtn" onClick={this.reportQuestion} >Report</Button>;
    if (this.state.reported) {
      reportButton = <Button variant="secondary" size="sm" className="qReportBtn btn-secondary">Reported</Button>;
    }

    return (
      <div className='questionDiv'>
        <Container className='question'>
          <Row>
            <Col xs='auto'><h5>Q: {this.state.question.question_body}</h5></Col>
          </Row>
          <Row>
            <Col className='qButtonRow'>
              <span>Helpful? </span> {helpfulButton}
              {reportButton}
            </Col>
          </Row>
          <Row className='answerRow'>
            <Col className='answerCol'>
              <div className='answerContainer'>
                {noAnswers}
                {answers.map((answer, index) => {
                  return (
                    <Answer answer={answer} key={index} />
                  );
                })}
              </div>
            </Col>
          </Row>
          <Row className='moreAnswersRow'>
            {moreAnswers}
          </Row>
          <Row className='submitAnswerRow'>
            <SubmitAnswer
              product_name={this.props.product_name}
              question_id={this.state.question.question_id}
              question_body={this.state.question.question_body}
              handleOpenSubmit={this.handleOpenSubmit.bind(this)}
              handleCloseSubmit={this.handleCloseSubmit.bind(this)}
              show={this.state.showSubmitAnswer}
            />
          </Row>
        </Container>
      </div>
    );
  }
}

export default Question;