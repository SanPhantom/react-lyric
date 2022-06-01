import axios from '../config/axios.config';

export const searchMusic = (searchValue, limit = 30, offset = 1, type = 1) => {
  return axios.get("/cloudsearch", {
    params: {
      keywords: searchValue,
      limit,
      offset,
      type,
    }
  })
}

export const searchLyric = (musicId) => {
  return axios.get('/lyric', {
    params: {
      id: musicId,
    }
  })
}

export const searchUrl = (musicId) => {
  return axios.get('/song/url', {
    params: {
      id: musicId,
    }
  })
}