import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Loading from '../components/Loading';
import MusicList from '../components/MusicList';
import MusicLyric from '../components/MusicLyric';
import SearchInput from '../components/SearchInput';
import UserInfo from '../components/UserInfo';
import { audioPlayer } from '../config/music.config';
import { searchMusic, searchUrl } from '../services/music';
import { updateInfo, updateLoading, updateProgress } from '../store/music/musicActions';
import { formatSinger } from '../utils/music';
import { timestamp2Time } from '../utils/time'
import './styles/MusicPlay.less';

const MusicPlay = () => {

  const [searchValue, setSearchValue] = useState('');
  const [musicList, setMusicList] = useState([]);

  const { loading, id, info, progress } = useSelector(store => store.music);
  const reduxDispatch = useDispatch();

  const handleSearchMusic = () => {
    // search music by params
    reduxDispatch(updateLoading(true));
    searchMusic(searchValue).then(res => {
      console.log(res);
      if (res.code === 200) {
        setMusicList(res.result.songs);
      } else {
        setMusicList([]);
      }
    }).finally(() => {
      reduxDispatch(updateLoading(false));
    });
  }

  const handleSelectMusic = (item) => {
    reduxDispatch(updateInfo(item));
  }

  useEffect(() => {
    if (id) {
      searchUrl(id).then(res => {
        console.log(res.data[0].url)
        if (res.code === 200) {
          reduxDispatch(updateProgress({dt: info.dt}))
          audioPlayer.src = res.data[0].url;
          audioPlayer.play();
        }
      })
    }
  }, [id])

  return (
    <div className="music-root">
      <div className="music-search-root">
        <div className="header">
          <UserInfo />
          <SearchInput value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            onSearch={() => { handleSearchMusic() }} />
        </div>
        <div className="content">
          {!loading ? (<MusicList list={musicList}
            itemRender={(item, index) => (
              <div className={`music-item ${item.id === id && 'active'}`} key={item.id} onClick={() => { handleSelectMusic(item) }}>
                <span className="music-no">{index + 1}</span>
                <div className="music-info">
                  <p className="music-title">{item.name}</p>
                  <p className="music-singer">{formatSinger(item.ar)}</p>
                </div>
              </div>
            )} />) : <Loading noTip />}
        </div>
      </div>
      <div className="music-info-root">
        <div className="header">
          <p className="music-title">{info && info.name}</p>
          <p className="music-singer">{formatSinger(info ? info.ar : [])}</p>
        </div>
        <div className="content">
          <MusicLyric />
        </div>
        <div className="footer">
        <span className='text-xs'>{timestamp2Time(progress.ct)}</span>

        <span className='text-xs'>{timestamp2Time(progress.dt)}</span>
        </div>
      </div>

    </div>
  );
}

export default MusicPlay