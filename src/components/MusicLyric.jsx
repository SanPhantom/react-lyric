import { findLast, indexOf } from 'lodash';
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { audioPlayer } from '../config/music.config';
import { searchLyric } from '../services/music';
import { formatLyric } from '../utils/music';
import sports from '../utils/sports';
import './styles/MusicLyric.less';



const MusicLyric = () => {

  const { id, progress } = useSelector(store => store.music);
  const { fps } = useSelector(store => store.user);

  const [lyricData, setLyricData] = useState([]);
  const [current, setCurrent] = useState(0);
  // const [currentScroll, setCurrentScroll] = useState(0);

  const scrollHeight = useRef(0);
  const scrollLock = useRef(false);
  const animationRef = useRef(null);
  const durationRef = useRef(fps * 70 / 160);
  const lyricRef = useRef(null);
  const lyricDataRef = useRef(lyricData);
  const scrollRef = useRef(0);

  const delayRef = useRef(null);

  let start = 0;

  const handleFetchLyric = () => {
    setLyricData([]);
    searchLyric(id).then(res => {
      if (res.code === 200) {
        setLyricData(formatLyric(res.lrc, res.tlyric || { lyric: '' }));
      }
    })
  }

  useEffect(() => {
    lyricDataRef.current = lyricData;
  }, [lyricData])

  useEffect(() => {
    if (id) {
      setCurrent(0);
      // setCurrentScroll(0)
      scrollRef.current = 0;
      handleFetchLyric();
    }
  }, [id])

  // 获取当前歌词行数
  const getLyricCurrentLine = useCallback(() => {
    const { currentTime: ct, duration: dt } = audioPlayer;
    return new Promise((resolve, reject) => {
      if (ct <= dt && dt !== 0 &&  lyricDataRef.current.length > 0) {
        const nodeEle = findLast( lyricDataRef.current, x => x.time < ct * 1000);
        const index = indexOf( lyricDataRef.current, nodeEle);
        resolve(index);
      }
      resolve(0);
    })
  }, [lyricData])

  // 歌词滚动函数
  const lyricScrollRun = (timestamp) => {
    scrollLock.current = true;
    start++;
    const top = sports.linear(start, scrollRef.current, scrollHeight.current, durationRef.current);
    lyricRef.current.scrollTop = top;
    if (start <= durationRef.current) {
      animationRef.current = requestAnimationFrame(lyricScrollRun)
    } else {
      scrollRef.current = top;
      clearScrollAnimation();
    }
  }

  // 手指滑动事件
  const handleTouchMove = () => {
    scrollLock.current = true;
  }

  // 更新需滚动的高度，并开启滚动动画
  const getScrollHeight = (index) => {
    if (lyricRef.current.children.length > 0) {
      if (lyricRef.current.children[index]) {
        const sumTop = lyricRef.current.children[index].offsetTop - lyricRef.current.children[0].offsetTop;
        scrollHeight.current = sumTop - scrollRef.current;
      }
    }
    if (!scrollLock.current && animationRef.current === null) {
      animationRef.current = requestAnimationFrame(lyricScrollRun)
    }
  }

  // 关闭滚动动画
  const clearScrollAnimation = () => {
    cancelAnimationFrame(animationRef.current);
    animationRef.current = null;
    scrollLock.current = false;
    scrollHeight.current = 0;
    start = 0;
  }

  const delayBackCurrent = useCallback(() => {
    const clearTimerRef = () => {
      if (delayRef.current) {
        clearTimeout(delayRef.current);
        delayRef.current = null;
      }
    }
    clearTimerRef();
    delayRef.current = window.setTimeout(() => {
      scrollRef.current = lyricRef.current.scrollTop;
      getLyricCurrentLine().then((index) => {
        clearScrollAnimation()
        getScrollHeight(index);
        clearTimerRef();
      })
    }, 3000)
  }, [lyricData])

  useEffect(() => {
    getLyricCurrentLine().then((index) => {
      setCurrent(index);
      if (index !== current) {
        getScrollHeight(index);
      }
    })
  }, [progress, lyricData]);

  useEffect(() => {
    durationRef.current = Math.ceil(fps * 70 / 120);
  }, [fps])

  useEffect(() => {
    var hiddenProperty = 'hidden' in document ? 'hidden' :
      'webkitHidden' in document ? 'webkitHidden' :
        'mozHidden' in document ? 'mozHidden' :
          null;
    var visibilityChangeEvent = hiddenProperty.replace(/hidden/i, 'visibilitychange');
    var onVisibilityChange = function () {
      if (!document[hiddenProperty]) {
        getLyricCurrentLine().then((index) => {
          getScrollHeight(index);
        })
      }
    }
    document.addEventListener(visibilityChangeEvent, onVisibilityChange);

    getLyricCurrentLine().then((index) => {
      getScrollHeight(index);
    })

    if (lyricRef.current) {
      let a = null;
      lyricRef.current.addEventListener('mousewheel', () => {
        scrollLock.current = true;
        delayBackCurrent();
      })
      // 手动滚动存在问题
      lyricRef.current.addEventListener('touchstart', (e) => {
        scrollLock.current = true;
        lyricRef.current.addEventListener('touchmove', handleTouchMove);
      })
      lyricRef.current.addEventListener('touchend', () => {
        delayBackCurrent();
        lyricRef.current.removeEventListener('touchmove', handleTouchMove);
      })
    }
    return () => {
      scrollHeight.current = 0;
      scrollLock.current = false;
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
      scrollRef.current = 0;
    }
  }, [])

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