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
    return (
      <Widget
        title="Bienvenido"
        subtitle="Asistente virtual"
        senderPlaceHolder="Escribe aquí ..."
        handleSpeechRecognitionError={this.handleSpeechRecognitionError}
        handleNewUserMessage={this.handleNewUserMessage}
        badge={1}
      />
    );
  }
}
