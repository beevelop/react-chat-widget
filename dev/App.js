import React, { Component } from 'react';
import { Widget, addResponseMessage } from '../index';

export default class App extends Component {
  componentDidMount() {
    addResponseMessage('Welcome to this awesome chat!');
  }

  handleNewUserMessage = (newMessage) => {
    addResponseMessage(newMessage);
  }

  handleSpeechRecognitionError = (msg) => {
    console.log(msg)
  }

  render() {
    const speechRecognition = new webkitSpeechRecognition();
    speechRecognition.continuous = true;
    speechRecognition.interimResults = true;
    speechRecognition.lang = 'en-US';

    return (
      <Widget
        title="Bienvenido"
        subtitle="Asistente virtual"
        senderPlaceHolder="Escribe aquí ..."
        speechRecognition={speechRecognition}
        handleSpeechRecognitionError={this.handleSpeechRecognitionError}
        handleNewUserMessage={this.handleNewUserMessage}
        badge={1}
      />
    );
  }
}
