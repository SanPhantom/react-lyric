import { findLast, indexOf } from 'lodash';
import React, { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { searchLyric } from '../services/music';
import { formatLyric } from '../utils/music';
import sports from '../utils/sports';
import './styles/MusicLyric.less';



const MusicLyric = () => {

  const { id, progress } = useSelector(store => store.music);
  const { fps } = useSelector(store => store.user);

  const [lyricData, setLyricData] = useState([]);
  const [current, setCurrent] = useState(0);
  const [currentScroll, setCurrentScroll] = useState(0);

  const scrollHeight = useRef(0);
  const scrollLock = useRef(false);
  const animationRef = useRef(null);
  const durationRef = useRef(fps * 70 / 160);
  const lyricRef = useRef(null);

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
    if (id) {
      setCurrent(0);
      setCurrentScroll(0)
      handleFetchLyric();
    }
  }, [id])

  // 歌词滚动函数
  const lyricScrollRun = (timestamp) => {
    scrollLock.current = true;
    start++;
    let scroll = scrollHeight.current;
    const top = sports.linear(start, currentScroll, scroll, durationRef.current);
    lyricRef.current.scrollTop = top;
    if (start <= durationRef.current) {
      animationRef.current = requestAnimationFrame(lyricScrollRun)
    } else {
      setCurrentScroll(top);
      clearScrollAnimation();
    }
  }

  // 手指滑动事件
  const handleTouchMove = () => {
    scrollLock.current = true;
  }

  // 更新需滚动的高度，并开启滚动动画
  const getScrollHeight = (index = current) => {
    if (lyricRef.current.children.length > 0) {
      if (lyricRef.current.children[index]) {
        const sumTop = lyricRef.current.children[index].offsetTop - lyricRef.current.children[0].offsetTop;
        scrollHeight.current = sumTop - currentScroll;
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
  }

  useEffect(() => {
    const { ct, dt } = progress;
    if (ct <= dt && dt !== 0 && lyricData.length > 0) {
      const nodeEle = findLast(lyricData, x => x.time < ct);
      const index = indexOf(lyricData, nodeEle);

      if (index !== current) {
        getScrollHeight(index);
      }
      setCurrent(index);

    }
  }, [progress, lyricData, currentScroll]);

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
        getScrollHeight(current);
      }
    }
    document.addEventListener(visibilityChangeEvent, onVisibilityChange);

    getScrollHeight(current);

    if (lyricRef.current) {
      let a = null;
      lyricRef.current.addEventListener('mousewheel', () => {
        scrollLock.current = true;
        if (a) {
          clearTimeout(a);
          a = null;
        }
        a = window.setTimeout(() => {
          clearScrollAnimation();
          getScrollHeight();
          clearTimeout(a);
          a = null;
        }, 3000)
      })
      // 手动滚动存在问题
      lyricRef.current.addEventListener('touchstart', (e) => {
        lyricRef.current.addEventListener('touchmove', handleTouchMove);
      })
      lyricRef.current.addEventListener('touchend', () => {
        a = setTimeout(() => {
          clearScrollAnimation()
          getScrollHeight();
          clearTimeout(a);
          a = null;
        }, 3000)
        lyricRef.current.removeEventListener('touchmove', handleTouchMove);
      })
    }
    return () => {
      scrollHeight.current = 0;
      scrollLock.current = false;
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
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