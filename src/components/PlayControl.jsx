import { PauseIcon, PlayIcon } from '@heroicons/react/solid';
import React from 'react';
import { useSelector } from 'react-redux';
import { audioPlayer } from '../config/music.config';
import { timestamp2Time } from '../utils/time';
import Progress from './Progress';
import './styles/play-control.less';

const PlayControl = () => {

  const { progress } = useSelector(store => store.music);

  return (
    <div className="control-root">
      <div className="play-btn" onClick={() => audioPlayer[audioPlayer.readyState ? 'pause' : 'play']()}>
        { audioPlayer.readyState ? <PauseIcon /> : <PlayIcon /> }
      </div>
      <div className="music-progress">
        <span className='text-xs'>{timestamp2Time(progress.ct)}</span>
        <div className='progress-box'>
          <Progress />
        </div>
        <span className='text-xs'>{timestamp2Time(progress.dt)}</span>
      </div>
    </div>
  );
}

export default PlayControl