import React from 'react';
import { useSelector } from 'react-redux';
import './styles/progress.less'

const Progress = () => {

  const { progress } = useSelector(store => store.music);

  return (
    <div className="progress-root">
      <div className="progress-track" style={{
        width: (progress.ct / progress.dt * 100) + '%'
      }}>
        
      </div>
      <div className="progress-thumb" style={{
        left: `calc(${(progress.ct / progress.dt * 100) + '%'} - 7px)`,
      }}></div>
    </div>
  );
}

export default Progress