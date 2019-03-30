import React, { Component } from 'react';
import PropTypes from 'prop-types';
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
  backgroundAudio: ['audioSettings', 'background'],
  effectsAudio: ['audioSettings', 'effects'],
  gameStarted: ['gameStarted'],
})
class AudioWrapper extends Component {
  render() {
    const { backgroundAudio, effectsAudio } = this.props;
    const allAudioMuted = backgroundAudio.muted && effectsAudio.muted;
    return (
      <div className="audio-wrapper">
        <ReactHowler
          ref={(audio) => { this.backgroundAudio = audio; }}
          mute={allAudioMuted || backgroundAudio.muted}
          volume={parseFloat(backgroundAudio.volume)}
          src={CarrotFields}
          playing={this.props.gameStarted}
          loop
        />
        <AudioControls>
          <button type="button" onClick={toggleAudioMuted} title={`${allAudioMuted ? 'Unmute' : 'Mute'} Audio`}>
            <Glyphicon glyph={allAudioMuted ? 'volume-up' : 'volume-off'} />
          </button>
        </AudioControls>
      </div>
    );
  }
}

export default AudioWrapper;

AudioWrapper.propTypes = {
  backgroundAudio: PropTypes.object,
  effectsAudio: PropTypes.object,
  gameStarted: PropTypes.bool,
};

AudioWrapper.defaultProps = {
  backgroundAudio: {},
  effectsAudio: {},
  gameStarted: false,
};
