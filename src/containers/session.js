import React, { Component } from 'react';
import { connect } from 'react-redux';

import {Tabs, Tab} from 'material-ui/Tabs';
import {List, ListItem} from 'material-ui/List';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';


import uuid from 'node-uuid';
import R from 'ramda';

import AddQuiz from './add_quiz';
import Quiz from './quiz';

import AddQuestion from './add_question';
import Question from './question';

import {addQuizToSession, addQuestionToSession, updateSession, insertMessage} from '../action_creators';

const Session = React.createClass({
    getNewMessage: function(){
        return {
            _id: 'message_' + uuid.v1(),
            session_id: this.props.session._id,
            name: localStorage.getItem('username'),
            type: 'message',
            anonymous: false,
            text: ''
        }
    },
    getInitialState: function(){
        return {
            selected_quiz: undefined,
            selected_question: undefined,
            new_message: this.getNewMessage()
        }
    },
    renderSelectedQuiz: function(){
        if(this.state.selected_quiz){
            return <Quiz quiz_id={this.state.selected_quiz} />
        }
    },
    renderSelectedQuestion: function(){
        if(this.state.selected_question){
            return <Question question_id={this.state.selected_question} />
        }
    },
    renderLiveQuizButton: function(){
        if(this.state.selected_quiz){
            const {selected_quiz} = this.state;
            const {session} = this.props;
            const quiz = session.quizes.find((q)=>{return q.id === selected_quiz});
            const quiz_index = session.quizes.indexOf(quiz);
            if(quiz.live){
                return <RaisedButton label="Stop" primary={true} onClick={()=>{
                        const quizes = R.update(quiz_index, {...quiz, live:false}, session.quizes)
                        this.props.dispatch(updateSession({...session, quizes}))
                    }}/>
            }
            return <RaisedButton label="Live" primary={true} onClick={()=>{
                    const quizes = R.update(quiz_index, {...quiz, live:true, public:true}, session.quizes)
                    this.props.dispatch(updateSession({...session, quizes}))
                }}/>
        }

    },
    renderLiveQuestionButton: function(){
        if(this.state.selected_question){
            const {selected_question} = this.state;
            const {session} = this.props;
            const question = session.questions.find((q)=>{return q.id === selected_question});
            const question_index = session.questions.indexOf(question);
            if(question.live){
                return <RaisedButton label="Stop" primary={true} onClick={()=>{
                        const questions = R.update(question_index, {...question, live:false}, session.questions)
                        this.props.dispatch(updateSession({...session, questions}))
                    }}/>
            }
            return <RaisedButton label="Live" primary={true} onClick={()=>{
                    const questions = R.update(question_index, {...question, live:true, public:true}, session.questions)
                    this.props.dispatch(updateSession({...session, questions}))
                }}/>
        }

    },
    renderDiscussions: function(){
        return(
            <div style={{width: '100%'}}>
                <TextField floatingLabelText="Say Something"
                    style={{width: '100%'}} multiLine={true}
                    value={this.state.new_message.text}
                    onChange={(e, text)=>{this.setState({new_message: {...this.state.new_message, text}})}}
                />
                <br/>
                <RaisedButton label="Send" primary={true} onClick={()=>{
                        this.props.dispatch(insertMessage(this.state.new_message));
                        this.setState({new_message: this.getNewMessage()});
                    }}/>
                <br/>
                <ul style={{ listStyleType: 'none', margin: '0', padding: '0', overflowWrap: 'break-word' }}>
    				{this.props.messages.map((msg, k) => {
    					return <li key={k} style={{ padding: '5px 10px' }}><span style={{ fontWeight: 'bold' }}>{msg.name}:</span> {msg.text}</li>
    				})}
    			</ul>

            </div>
        )
    },
    renderForAuthor: function(){
        return(
            <div style={{width: '100%'}}>
                <h1>{this.props.session.title}</h1>
                <div style={{width: '100%'}}>
                    <Tabs style={{width: '100%'}}>
                      <Tab label="Discussion" >
                          {this.renderDiscussions()}
                      </Tab>
                      <Tab label="Quizes" >
                        <AddQuiz afterInsert={(quiz_id)=>{
                            this.props.dispatch(addQuizToSession(quiz_id, this.props.session));
                        }}/>
                        <br />
                        <div style={{width : '100%', display: 'flex', flexDirection: 'row'}}>
                            <div style={{width: '30%'}}>
                                <List>
                                  {this.props.quizes.map((quiz)=>{
                                      return <ListItem key={quiz._id} primaryText={quiz.title} onClick={()=>{
                                              this.setState({selected_quiz: quiz._id})
                                          }} />
                                  })}
                                </List>
                            </div>
                            <div style={{width: '70%'}}>
                                <div style={{width: '100%'}}>
                                    {this.renderSelectedQuiz()}
                                    <br />
                                    {this.renderLiveQuizButton()}
                                </div>

                            </div>
                        </div>

                      </Tab>
                      <Tab label="Questions" >
                          <AddQuestion afterInsert={(question_id)=>{
                              this.props.dispatch(addQuestionToSession(question_id, this.props.session));
                          }}/>
                          <br />
                          <div style={{width : '100%', display: 'flex', flexDirection: 'row'}}>
                              <div style={{width: '30%'}}>
                                  <List>
                                    {this.props.questions.map((question)=>{
                                        return <ListItem key={question._id} primaryText={question.title} onClick={()=>{
                                                this.setState({selected_question: question._id})
                                            }} />
                                    })}
                                  </List>
                              </div>
                              <div style={{width: '70%'}}>
                                  <div style={{width: '100%'}}>
                                      {this.renderSelectedQuestion()}
                                      <br />
                                      {this.renderLiveQuestionButton()}
                                  </div>
                              </div>
                          </div>
                      </Tab>
                      <Tab label="Files" >

                      </Tab>
                    </Tabs>

                </div>
            </div>
        )
    },
    renderForStudent: function(){
        const {live_quiz, live_question} = this.props;
        if(live_quiz){
            return <Quiz quiz_id={live_quiz.id} />
        }
        if(live_question){
            return <Question question_id={live_question.id} />
        }
        return(
            <div style={{width: '100%'}}>
                <h1>{this.props.session.title}</h1>
                <div style={{width: '100%'}}>
                    <Tabs style={{width: '100%'}}>
                      <Tab label="Discussions" >
                          {this.renderDiscussions()}
                      </Tab>
                      <Tab label="Quizes" >
                        <div style={{width : '100%', display: 'flex', flexDirection: 'row'}}>
                            <div style={{width: '30%'}}>
                                <List>
                                  {this.props.public_quizes.map((quiz)=>{
                                      return <ListItem key={quiz._id} primaryText={quiz.title} onClick={()=>{
                                              this.setState({selected_quiz: quiz._id})
                                          }} />
                                  })}
                                </List>
                            </div>
                            <div style={{width: '70%'}}>
                                {this.renderSelectedQuiz()}
                            </div>
                        </div>
                      </Tab>
                      <Tab label="Questions" >
                          <div style={{width : '100%', display: 'flex', flexDirection: 'row'}}>
                              <div style={{width: '30%'}}>
                                  <List>
                                    {this.props.public_questions.map((question)=>{
                                        return <ListItem key={question._id} primaryText={question.title} onClick={()=>{
                                                this.setState({selected_question: question._id})
                                            }} />
                                    })}
                                  </List>
                              </div>
                              <div style={{width: '70%'}}>
                                  {this.renderSelectedQuestion()}
                              </div>
                          </div>
                      </Tab>
                      <Tab label="Files" >

                      </Tab>
                    </Tabs>

                </div>
            </div>
        )
    },
    render: function(){
        if(localStorage.getItem('auther') === "true"){
            return this.renderForAuthor();
        }
        return this.renderForStudent();
    }
});

export default connect((state, {session_id})=>{
    const session = state.sessions.find((session)=>{return session._id === session_id});
    const messages = state.messages.filter((message)=>{return message.session_id === session._id});
    const quizes = session.quizes.map((quiz)=>{
        return state.quizes.find((q)=> { return quiz.id === q._id});
    });
    const public_quizes = session.quizes.filter((quiz)=>{
        return quiz.public;
    }).map((quiz)=>{
        return state.quizes.find((q)=> { return quiz.id === q._id});
    });
    const questions = session.questions.map((question)=>{
        return state.questions.find((q)=> { return question.id === q._id});
    });
    const public_questions = session.questions.filter((question)=>{
        return question.public;
    }).map((question)=>{
        return state.questions.find((q)=> { return question.id === q._id});
    });
    const live_quiz = session.quizes.find((quiz)=>{return quiz.live});
    const live_question = session.questions.find((question)=>{return question.live});
    return {
        session,
        messages,
        quizes,
        public_quizes,
        questions,
        public_questions,
        live_quiz,
        live_question
    }
})(Session)
