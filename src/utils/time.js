export const time2Timestamp = (time) => {
  const pattern = /(.+):(.+)\.(.+)/;
  const timer = time.match(pattern) || []

  return ((Number(timer[1]) * 60 + Number(timer[2])) * 1000 + Number(timer[3])).toString();
}

export const timestamp2Time = (num) => {
  const min = Math.floor( (num / 1000) / 60 );
  const sec = Math.floor(num / 1000) % 60
  return `${min < 10 ? `0${min}` : min}:${sec < 10 ? `0${sec}` : sec}`;
}