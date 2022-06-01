export const time2Timestamp = (time) => {
  const pattern = time.indexOf('.') !== -1 ? /(.+):(.+)\.(.+)/ : /(.+):(.+)/;
  const timer = time.match(pattern) || []
  return ((Number(timer[1] || 0) * 60 + Number(timer[2] || 0)) * 1000 + Number(timer[3] || 0)).toString();
}

export const timestamp2Time = (num) => {
  const min = Math.floor( (num / 1000) / 60 );
  const sec = Math.floor(num / 1000) % 60
  return `${min < 10 ? `0${min}` : min}:${sec < 10 ? `0${sec}` : sec}`;
}

/**
 * @param {number} targetCount 不小于1的整数，表示经过targetCount帧之后返回结果
 * @return {Promise<number>}
 */
 export const getScreenFps = (() => {
  // 先做一下兼容性处理
  const nextFrame = ([
    window.requestAnimationFrame,
    window.webkitRequestAnimationFrame,
    window.mozRequestAnimationFrame
  ]).find(fn => fn)
  if (!nextFrame) {
    console.error('requestAnimationFrame is not supported!')
    return
  }
  return (targetCount = 100) => {
    // 判断参数是否合规
    if (targetCount < 1) throw new Error('targetCount cannot be less than 1.')
    const beginDate = Date.now()
    let count = 0
    return new Promise(resolve => {
      (function log() {
        nextFrame(() => {
          if (++count >= targetCount) {
            const diffDate = Date.now() - beginDate
            const fps = (count / diffDate) * 1000
            return resolve(fps)
          }
          log()
        })
      })()
    })
  }
})()
