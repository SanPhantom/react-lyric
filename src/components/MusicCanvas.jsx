import React, { useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { audioPlayer } from '../config/music.config';



const MusicCanvas = () => {

  const { url } = useSelector(store => store.music)
  const canvasRef = useRef(null);
  const ctxRef = useRef(null);
  const analyserRef = useRef(null);

  const AudioRef = useRef(null);

  const animationRef = useRef(null);

  function frameLooper() {
    // console.log('1234')
    animationRef.current = window.requestAnimationFrame(frameLooper);
    if (analyserRef.current) {
      const fbc_array = new Uint8Array(analyserRef.current.frequencyBinCount);
      analyserRef.current.getByteFrequencyData(fbc_array);
      ctxRef.current.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      let gradient = ctxRef.current.createLinearGradient(0, 0, 0, 150);
      gradient.addColorStop(1, '#a770ef');
      gradient.addColorStop(0.5, '#cf8bf3');
      gradient.addColorStop(0, '#fdb99b');
      ctxRef.current.fillStyle = gradient;
      const bars = canvasRef.current.width / 1;
      for (var i = 0; i < bars; i++) {
        let bar_x = i * 1;
        let bar_width = 1;
        let bar_height = -(fbc_array[i] / 2);
        ctxRef.current.fillRect(bar_x, canvasRef.current.height, bar_width, bar_height);
      }
    }

  }

  const initPlayer = () => {

    console.log(AudioRef.current, analyserRef.current)

    const AudioContext = window.AudioContext || window.webkitAudioContext || window.mozAudioContext || window.msAudioContext;
    AudioRef.current = new AudioContext;

    const source = AudioRef.current.createMediaElementSource(audioPlayer);
    analyserRef.current = AudioRef.current.createAnalyser();
    source.connect(analyserRef.current);
    analyserRef.current.connect(AudioRef.current.destination);

    // if (canvasRef.current) {
    ctxRef.current = canvasRef.current.getContext('2d');
    frameLooper();
    // }
  }


  useEffect(() => {

    if (url && !analyserRef.current && !AudioRef.current) {

      initPlayer();
    }
    // window.addEventListener('load', initPlayer, false)
    return () => {
      // window.removeEventListener('load', initPlayer, false)
      // cancelAnimationFrame(animationRef.current);
      // animationRef.current = null;
    }
  }, [url])

  return (
    <div className="canvas-root">
      <canvas ref={canvasRef} id="music-canvas" />
    </div>
  );
}

export default MusicCanvas