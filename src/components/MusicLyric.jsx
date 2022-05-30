import { findLast, indexOf } from 'lodash';
import React, { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { searchLyric } from '../services/music';
import { formatLyric } from '../utils/music';
import sports from '../utils/sports';
import './styles/MusicLyric.less';

const MusicLyric = () => {

  const { id, progress } = useSelector(store => store.music);

  const [lyricData, setLyricData] = useState([]);
  const [current, setCurrent] = useState(0);
  const [currentScroll, setCurrentScroll] = useState(0);

  const scrollHeight = useRef(0);
  const scrollLock = useRef(false);

  const lyricRef = useRef(null);

  let start = 0;
  let duration = 50;


  const handleFetchLyric = () => {
    searchLyric(id).then(res => {
      if (res.code === 200) {
        setLyricData(formatLyric(res.lrc, res.tlyric || {lyric: ''}));
      }
    })
  }

  useEffect(() => {
    if (id) {
      setCurrent(0);
      setCurrentScroll(0)
      handleFetchLyric();
    }
  }, [id])

  const lyricScrollRun = () => {
    scrollLock.current = true;
    start++;
    let scroll = scrollHeight.current;
    const top = sports.linear(start, currentScroll, scroll, duration);
    lyricRef.current.scrollTop = top;
    
    if (start <= duration) {
      requestAnimationFrame(lyricScrollRun)
    } else {
      setCurrentScroll(top);
      scrollLock.current = false;
      scrollHeight.current = 0;
    }
    
  }

  useEffect(() => {
    const { ct, dt } = progress;
    if (ct <= dt && dt !== 0 && lyricData.length > 0) {
      const nodeEle = findLast(lyricData, x => x.time < ct);
      const index = indexOf(lyricData, nodeEle);
      setCurrent(index);
      
      
    }
  }, [progress, lyricData])

  useEffect(() => {
    if (lyricRef.current.children.length > 0) {
      let clientHeight = lyricRef.current.children[current] ? lyricRef.current.children[current].clientHeight : 0;
      scrollHeight.current += clientHeight;
    }
    if (!scrollLock.current) {
      lyricScrollRun();
    }
    
  }, [current])

  return (
    <div className="lyric-root" ref={lyricRef}>
      {
        lyricData.map((item, index) => (
          <div className={`lyric ${current === index && 'active'}`} key={item.time}>
            <p className="lyric-item">{item.lyric}</p>
            <p className="tlyric-item">{item.tlyric}</p>
          </div>
        ))
      }
    </div>
  );
}

export default MusicLyric