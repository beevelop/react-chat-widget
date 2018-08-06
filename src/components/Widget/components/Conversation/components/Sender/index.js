import React from 'react';
import PropTypes from 'prop-types';
import { CHAT_ERRORS } from 'constants';

import send from '@assets/send_button.svg';
import micOn from '@assets/microphone.svg';
import micOff from '@assets/microphone-slash.svg';
import './style.scss';

export default class Sender extends React.Component {
  state = {
    recognizing: false,
    icon: micOn,
    interim_transcript: '',
    final_transcript: '',
    ignore_onend: null,
    start_timestamp: null
  };

  componentDidMount() {
    const { onSpeechRecognitionError, speechRecognition } = this.props;
    const firstChar = /\S/;
    function capitalize(s) {
      return s.replace(firstChar, m => m.toUpperCase());
    }

    function upgrade() {
      onSpeechRecognitionError(CHAT_ERRORS.UPGRADE);
    }

    this.recognition = speechRecognition

    this.recognition.onstart = () => {
      this.setState({
        recognizing: true
      });
    };

    this.recognition.onerror = (event) => {
      if (event.error === 'no-speech') {
        onSpeechRecognitionError(CHAT_ERRORS.NO_SPEECH);
        if (this.state.recognizing) {
          this.setState({
            recognizing: false,
            icon: micOn
          });
          this.recognition.stop();
          return;
        }
      } else if (event.error === 'audio-capture') {
        onSpeechRecognitionError(CHAT_ERRORS.AUDIO_CAPTURE);
      } else if (event.error === 'not-allowed') {
        if (event.timeStamp - this.state.start_timestamp < 100) {
          onSpeechRecognitionError(CHAT_ERRORS.NOT_ALLOWED_LESS_100);
        } else {
          onSpeechRecognitionError(CHAT_ERRORS.NOT_ALLOWED);
        }
      } else {
        console.warn(event.error)
      }

      if (event.error) this.setState({ ignore_onend: true });
    };

    this.recognition.onend = () => {
      this.setState({
        recognizing: false,
        icon: micOn
      });
    };

    this.recognition.onresult = (event) => {
      if (!event.results) {
        this.recognition.onend = null;
        this.recognition.stop();
        upgrade();
        return;
      }
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          this.setState({
            final_transcript: event.results[i][0].transcript
          });
        } else {
          this.setState({
            final_transcript: ''
          })
          this.setState({
            interim_transcript: this.state.interim_transcript + event.results[i][0].transcript
          });
        }
      }

      const finalTranscriptOutput = capitalize(this.state.final_transcript);
      this.props.onSpeechRecognitionResult(finalTranscriptOutput);
    };
  }
  startButton = (event) => {    
    if (this.state.recognizing) {
      this.setState({
        recognizing: false,
        icon: micOn
      });
      this.recognition.stop();
      return;
    }

    this.setState({
      final_transcript: '',
      ignore_onend: false,
      start_timestamp: event.timeStamp,
      recognizing: true,
      icon: micOff
    });

    this.recognition.start();
  };

  render() {
    const { sendMessage, placeholder, disabledInput, autofocus } = this.props;
    return (
      <form className="rcw-sender" onSubmit={sendMessage}>
        <input type="text" className="rcw-new-message" name="message" placeholder={placeholder} disabled={disabledInput} autoFocus={autofocus} autoComplete="off" />
        <button type="button" onClick={this.startButton} className="rcw-send" id="audio">
          {<img src={this.state.icon} className="rcw-send-icon" alt="mic" />}
        </button>
        <button type="submit" className="rcw-send">
          <img src={send} className="rcw-send-icon" alt="send" />
        </button>
      </form>
    );
  }
}

Sender.propTypes = {
  sendMessage: PropTypes.func,
  speechRecognition: PropTypes.object,
  onSpeechRecognitionResult: PropTypes.func,
  onSpeechRecognitionError: PropTypes.func,
  placeholder: PropTypes.string,
  disabledInput: PropTypes.bool,
  autofocus: PropTypes.bool
};
