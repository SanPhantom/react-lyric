import React, { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { audioPlayer } from '../config/music.config';
import './styles/progress.less'

const Progress = () => {

  const { progress } = useSelector(store => store.music);

  const [currentProgress, setCurrentProgress] = useState(0);

  const thumbRef = useRef(null);
  const rootRef = useRef(null);
  const moveRef = useRef(0);
  const isMoveRef = useRef(false);
  const currentPercentRef = useRef(0);

  const handleProgressMove = (e) => {
    if (isMoveRef.current) {
      const rootPageX = rootRef.current.offsetLeft;
      const pageX = e.pageX ? e.pageX : e.touches[0].pageX;
      moveRef.current = pageX - rootPageX;
      if (moveRef.current <= rootRef.current.clientWidth) {
        setCurrentProgress(moveRef.current / rootRef.current.clientWidth);
        currentPercentRef.current = moveRef.current / rootRef.current.clientWidth;
      }
    }
  }

  const handleProgressEnd = () => {
    audioPlayer.currentTime = currentPercentRef.current * audioPlayer.duration;
    audioPlayer.play();
    isMoveRef.current = false;
    thumbRef.current.removeEventListener('mousemove', handleProgressMove)
    thumbRef.current.removeEventListener('touchmove', handleProgressMove)
    thumbRef.current.removeEventListener('mouseleave', handleProgressEnd)
  }

  const handleProgressStart = () => {
    isMoveRef.current = true;
    thumbRef.current.addEventListener('mouseleave', handleProgressEnd)
    thumbRef.current.addEventListener('mousemove', handleProgressMove)
    thumbRef.current.addEventListener('touchmove', handleProgressMove)
  }

  const handleProgressClick = (e) => {
    const rootLeft = rootRef.current.offsetLeft;
    const clickNum = e.pageX - rootLeft;
    audioPlayer.currentTime = clickNum / rootRef.current.clientWidth * audioPlayer.duration;
    audioPlayer.play();
    
  }

  useEffect(() => {
    if (!isMoveRef.current) {
      setCurrentProgress(progress.ct / progress.dt);
    }
  }, [progress])

  useEffect(() => {
    thumbRef.current.addEventListener('mousedown', handleProgressStart)
    thumbRef.current.addEventListener('touchstart', handleProgressStart)

    

    thumbRef.current.addEventListener('mouseup', handleProgressEnd)
    thumbRef.current.addEventListener('touchend', handleProgressEnd)

    rootRef.current.addEventListener('click', handleProgressClick)

    return () => {
      thumbRef.current.removeEventListener('mousedown', handleProgressStart)
      thumbRef.current.removeEventListener('touchstart', handleProgressStart)
      thumbRef.current.removeEventListener('mouseup', handleProgressEnd)
      thumbRef.current.removeEventListener('touchend', handleProgressEnd)
      rootRef.current.removeEventListener('click', handleProgressClick)
    }
  }, [])

  return (
    <div className="progress-root" ref={rootRef}>
      <div className="progress-track" style={{
        width: (currentProgress * 100) + '%'
      }}>

      </div>
      <div className="progress-thumb" ref={thumbRef} style={{
        left: `calc(${(currentProgress * 100) + '%'} - 7px)`,
      }}></div>
    </div>
  );
}

export default Progress