import { useCallback, useEffect, useRef, useState } from 'react';

/**
 * 获取屏幕尺寸
 * @param {*} type  
 * @param {*} size 
 */
const useMedia = (fn = (v) => {}) => {

  const [result, setResult] = useState(fn(document.body.clientWidth));

  const onResize = useCallback(() => {
    // resultRef.current = fn(document.body.clientWidth);
    setResult(fn(document.body.clientWidth))
  }, [])

  useEffect(() => {
    // resultRef.current = fn(document.body.clientWidth)
    window.addEventListener('resize', onResize)
    return () => {
      window.removeEventListener('resize', onResize)
    }
  }, []);

  // useEffect(() => {
  //   console.log('result: ', result);
  //   return () => {
  //     return result;
  //   }
  // }, [result])

  return result
}

export default useMedia;