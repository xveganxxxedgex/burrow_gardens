import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Checkbox } from 'react-bootstrap';
import styled from 'styled-components';

import { setAudioVolume, toggleAudioTypeMute, toggleAudioMuted, toggleAllowSaving } from 'actions';

const SettingsHeader = styled('h4')`
  display: flex;
  align-items: center;

  span {
    margin-right: 10px;
  }
`;

const StyledCheckbox = styled(Checkbox)`
  display: inline-block;
`;

const VolumeSlider = styled('input')`
  &[type="range"] {
    width: 200px;
  }
`;

const AudioSection = styled('div')`
  flex-direction: column;
  flex: 0 0 50%;
  padding-right: 10px;
`;

const SettingsWrapper = styled('div')`
`;

const AudioWrapper = styled('div')`
  display: flex;
  flex-wrap: wrap;
`;

const MuteAllSection = styled('div')`
  flex: 0 0 100%;
`;

class Settings extends Component {
  changeAudioSetting = audioType => (e) => {
    setAudioVolume(audioType, e.target.value);
  }

  toggleAudio = audioType => () => {
    toggleAudioTypeMute(audioType);
  }

  render() {
    const { audioSettings: { background, effects }, allowSaving } = this.props;
    return (
      <SettingsWrapper>
        <div>
          <h1>General</h1>
            <SettingsHeader>
              <StyledCheckbox
                checked={allowSaving}
                name="allowSaving"
                onChange={toggleAllowSaving}
              />
              <span>Save game on close</span>
            </SettingsHeader>
        </div>
        <AudioWrapper>
          <h1>Audio</h1>
          <MuteAllSection>
            <SettingsHeader>
              <span>Mute All</span>
              <StyledCheckbox
                checked={effects.muted && background.muted}
                name="allAudio"
                onChange={toggleAudioMuted}
              />
            </SettingsHeader>
          </MuteAllSection>
          <AudioSection>
            <SettingsHeader>
              <span>Sound Effects</span>
              <StyledCheckbox
                checked={!effects.muted}
                name="effects"
                onChange={this.toggleAudio('effects')}
              />
            </SettingsHeader>
            <strong>Volume:</strong>
            <VolumeSlider
              type="range"
              value={effects.volume}
              min={0.0}
              max={1.0}
              step={0.1}
              disabled={effects.muted}
              onChange={this.changeAudioSetting('effects')}
            />
          </AudioSection>
          <AudioSection>
            <SettingsHeader>
              <span>Background Music</span>
              <StyledCheckbox
                checked={!background.muted}
                name="background"
                onChange={this.toggleAudio('background')}
              />
            </SettingsHeader>
            <strong>Volume:</strong>
            <VolumeSlider
              type="range"
              value={background.volume}
              min={0.0}
              max={1.0}
              step={0.1}
              disabled={background.muted}
              onChange={this.changeAudioSetting('background')}
            />
          </AudioSection>
        </AudioWrapper>
      </SettingsWrapper>
    );
  }
}

export default Settings;

Settings.propTypes = {
  audioSettings: PropTypes.object.isRequired,
};
