import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateProgress } from '../store/music/musicActions';
import './styles/progress.less'

const Progress = () => {

  const { progress } = useSelector(store => store.music);

  const [currentProgress, setCurrentProgress] = useState(0);
  const reduxDispatch = useDispatch();

  const thumbRef = useRef(null);
  const rootRef = useRef(null);
  const startRef = useRef(0);
  const moveRef = useRef(0);
  const isMoveRef = useRef(false);

  const handleProgressMove = (e) => {
    const rootPageX = rootRef.current.offsetLeft;
    const pageX = e.touches[0].pageX;
    moveRef.current = pageX - rootPageX;
    // const { ct, dt } = progress;
    if (moveRef.current <= rootRef.current.clientWidth) {
      setCurrentProgress(moveRef.current / rootRef.current.clientWidth);
    }
    
  }

  useEffect(() => {
    if (!isMoveRef.current) {
      setCurrentProgress(progress.ct / progress.dt)
    }
  }, [progress])

  useEffect(() => {
    if (thumbRef.current) {
      thumbRef.current.addEventListener('mousedown', () => {
        isMoveRef.current = true;
        thumbRef.current.addEventListener('mouseMove', handleProgressMove);
      })
      thumbRef.current.addEventListener('mouseup', () => {
        isMoveRef.current = false;
        thumbRef.current.removeEventListener('mousemove', handleProgressMove);
      })
      thumbRef.current.addEventListener('touchstart', () => {
        isMoveRef.current = true;
        thumbRef.current.addEventListener('touchmove', handleProgressMove);
      })
      thumbRef.current.addEventListener('touchend', () => {
        reduxDispatch(updateProgress({
          ct: currentProgress * progress.dt
        }))
        isMoveRef.current = false;
        thumbRef.current.removeEventListener('touchmove', handleProgressMove);
      })
    }
  }, [])

  return (
    <div className="progress-root" ref={rootRef}>
      <div className="progress-track" style={{
        width: (progress.ct / progress.dt * 100) + '%'
      }}>
        
      </div>
      <div className="progress-thumb" ref={thumbRef} style={{
        left: `calc(${(currentProgress * 100) + '%'} - 7px)`,
      }}></div>
    </div>
  );
}

export default Progress