import React, { Component } from 'react';
import { branch } from 'baobab-react/higher-order';
import styled from 'styled-components';
import { Glyphicon } from 'react-bootstrap';
import ReactHowler from 'react-howler';

import { toggleAudioMuted } from 'actions';

import CarrotFields from 'audio/Carrot_Fields.ogg';
// import HiddenForest from 'audio/Hidden_Forest.ogg';
// import SleepyHome from 'audio/Sleepy_Home.ogg';

const AudioControls = styled.div`
  position: absolute;
  bottom: 0;
  right: 0;
  z-index: 10;
  background-color: rgba(0, 0, 0, 0.5);
  color: #FFF;
  padding: 6px 20px;
  font-size: 20px;

  button {
    background: none;
    border: none;

    .glyphicon {
      top: 3px;
    }
  }
`;

@branch({
  audioMuted: ['audioMuted']
})
class AudioWrapper extends Component {
  render() {
    return (
      <div className="audio-wrapper">
        <ReactHowler
          ref={(audio) => { this.backgroundAudio = audio; }}
          mute={this.props.audioMuted}
          src={CarrotFields}
          playing={true}
          loop
        />
        <AudioControls>
          <button onClick={toggleAudioMuted} title={`${this.props.audioMuted ? 'Unmute' : 'Mute'} Audio`}>
            <Glyphicon glyph={this.props.audioMuted ? 'volume-up' : 'volume-off'} />
          </button>
        </AudioControls>
      </div>
    )
  }
}

export default AudioWrapper;