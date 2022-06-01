import { defaultsDeep, values } from "lodash";
import { time2Timestamp } from "./time";

export const formatSinger = (singerArr) => {
  return singerArr.map(d => d.name).join('/');
}

const deleteLast = (arr, num = 1) => {
  const new_arr = arr.concat();
  for (let i = 0; i < num; i++) {
    new_arr.pop();
  }
  return new_arr;
}

const judgeLyric = (str) => {
  if (str.startsWith("[ti:")) {
    return false;
  } if (str.startsWith("[ar:")) {
    return false;
  } if (str.startsWith("[al:")) {
    return false;
  } if (str.startsWith("[by:")) {
    return false;
  }
  return true;
}

const getLyricData = (arr, lKey = 'lyric') => {
  let lData = {};
  for (const i in arr) {
    if (judgeLyric(arr[i])) {
      let pattern = /\[(.+)\](.+)?/;
      let data = arr[i].match(pattern);
      if (data) {
        const time = time2Timestamp(data[1]);
        lData[time] = {
          time: Number(time),
          [lKey]: data[2] ? data[2] : ''
        }
      } else {
        lData[i] = {
          time: 999999 + i,
          [lKey]: arr[i],
        }
      }
      
    }
  }
  return lData;
}

export const formatLyric = (lyricObj, tLyricObj) => {
  const { lyric } = lyricObj;
  const { lyric: tLyric } = tLyricObj;
  
  const lyricData = getLyricData(deleteLast(lyric.split(/\n/)));
  const tLyricData = getLyricData(deleteLast(tLyric.split(/\n/)), 'tlyric');

  return values(defaultsDeep(lyricData, tLyricData));
}