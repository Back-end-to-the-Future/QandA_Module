import React from 'react';
import axios from 'axios';

import Answer from './Answer.jsx';

import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

class Question extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      question: this.props.question,
      answers: this.props.question.answers,
      isMoreAnswers: this.props.question.answers.isMoreAnswers,
      helpfulness: this.props.question.question_helpfulness,
      helpfulClicked: false,
      reported: false
    }

    this.incrementHelpfulQuestion = this.incrementHelpfulQuestion.bind(this);
    this.reportQuestion = this.reportQuestion.bind(this);
  }

  incrementHelpfulQuestion() {
    axios.put('/question/helpful', { question_id: this.state.question.question_id });
    this.setState({ helpfulness: this.state.helpfulness + 1, helpfulClicked: true });
  }

  reportQuestion() {
    axios.put('/question/report', { question_id: this.state.question.question_id })
      .catch((err) => {
        // commented for tests
        // un-comment to check errors
        // console.log(err);
      })

    this.setState({ reported: true });
  }

  getMoreAnswers() {
    axios.get('/moreAnswers', {
      params: {
        question_id: this.state.question.question_id
      }
    })
      .then((response) => {
        let answers = response.data.answers;
        let isMoreAnswers = response.data.isMoreAnswers;
        this.setState({ answers, isMoreAnswers });
      })
  }

  collapseAnswers() {
    this.setState({ answers: this.state.answers.slice(0, 2), isMoreAnswers: true });
  }

  render() {

    let answers;
    if (Array.isArray(this.state.answers)) {
      answers = this.state.answers;
    } else {
      let answersObj = this.state.answers;
      answers = [];
      for (let id in answersObj) {
        if (id !== 'isMoreAnswers') {
          answers.push(answersObj[id]);
        }
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

    let moreAnswers;
    if (this.state.isMoreAnswers) {
      moreAnswers = <Button className='moreAnswers' onClick={this.getMoreAnswers.bind(this)}>See More Answers</Button>;
    } else if (answers.length <= 2) {
      moreAnswers = <span></span>;
    } else {
      moreAnswers = <Button className='collapseAnswers' onClick={this.collapseAnswers.bind(this)}>Collapse Answers</Button>;
    }

    let helpfulButton = <Button variant="primary" className="qHelpfulBtn"
      onClick={this.incrementHelpfulQuestion} >Yes ({this.state.helpfulness})</Button>;
    if (this.state.helpfulClicked) {
      helpfulButton = <Button variant="success" className="qHelpfulBtn btn-success">Yes ({this.state.helpfulness})</Button>;
    }

    let reportButton = <Button variant="danger" className="qReportBtn" onClick={this.reportQuestion} >Report</Button>;
    if (this.state.reported) {
      reportButton = <Button variant="secondary" className="qReportBtn btn-secondary">Reported</Button>;
    }

    return (
      <div>
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
            <Col>
              {answers.map((answer, index) => {
                return (
                  <Answer answer={answer} key={index} />
                );
              })}
            </Col>
          </Row>
          <Row className='moreAnswersRow'>
            {moreAnswers}
          </Row>
        </Container>
      </div>
    );
  }
}

export default Question;