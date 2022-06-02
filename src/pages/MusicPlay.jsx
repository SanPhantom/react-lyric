import React, { useEffect, useRef, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Loading from '../components/Loading';
import MusicList from '../components/MusicList';
import MusicLyric from '../components/MusicLyric';
import SearchInput from '../components/SearchInput';
import UserInfo from '../components/UserInfo';
import Avatar from '../components/Avatar';
import { audioPlayer } from '../config/music.config';
import { searchMusic, searchUrl } from '../services/music';
import { updateInfo, updateLoading, updateProgress, updateUrl } from '../store/music/musicActions';
import { formatSinger } from '../utils/music';
import { timestamp2Time } from '../utils/time';
import { ChevronLeftIcon, ChevronRightIcon, MenuAlt1Icon } from '@heroicons/react/solid'
import './styles/MusicPlay.less';
import Progress from '../components/Progress';
import useMedia from '../hooks/useMedia';
import MusicCanvas from '../components/MusicCanvas';

const MusicPlay = () => {

  const [searchValue, setSearchValue] = useState('');
  const [musicList, setMusicList] = useState([]);
  const [listTotal, setListTotal] = useState(0);
  const [page, setPage] = useState({
    offset: 1,
    limit: 30
  })
  const keywordRef = useRef(searchValue);

  const [leftBar, setLeftBar] = useState(false);
  const isMedia = useMedia((size) => size < 798);

  const { loading, id, info, progress } = useSelector(store => store.music);
  const reduxDispatch = useDispatch();

  const handleSearch = () => {
    keywordRef.current = searchValue;
    setPage({
      ...page,
      offset: 1,
    })
  }

  const handleSearchMusic = () => {
    // search music by params
    setMusicList([]);
    reduxDispatch(updateLoading(true));
    searchMusic(keywordRef.current, page.limit, (page.offset - 1) * page.limit)
      .then(res => {
        if (res.code === 200) {
          if (res.result.songs) {
            setMusicList(res.result.songs);
            setListTotal(res.result.songCount);
          }
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

  const handlePageUpdate = (mode) => {
    if (mode) {
      // next page
      if (page.offset < Math.ceil(listTotal / 30)) {
        setPage({
          ...page,
          offset: ++page.offset,
        })
      }
    } else {
      // prev page
      if (page.offset > 1) {
        setPage({
          ...page,
          offset: --page.offset,
        })
      }
    }
  }

  useEffect(() => {
    if (keywordRef.current !== '') {
      handleSearchMusic();
    }
  }, [page])

  useEffect(() => {
    if (!isMedia) {
      setLeftBar(true);
    }
  }, [isMedia])

  useEffect(() => {
    if (id) {
      searchUrl(id).then(res => {
        if (res.code === 200) {
          reduxDispatch(updateProgress({ dt: info.dt }))
          reduxDispatch(updateUrl(res.data[0].url))
          audioPlayer.src = res.data[0].url;
          audioPlayer.play();
        }
      })
    }
  }, [id])

  return (
    <div className="music-root">
      <div className="music-control" hidden={!isMedia} onClick={() => { setLeftBar(!leftBar) }}>
        <MenuAlt1Icon />
      </div>
      <div className="music-search-root" style={{ width: leftBar ? '75vw' : '0px' }}>
        <div className="music-search-wrapper">
          <div className="header">
            <UserInfo />
            <SearchInput value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              onSearch={() => { handleSearch() }} />
          </div>
          <div className="content">
            {!loading ? (<MusicList list={musicList}
              itemRender={(item, index) => (
                <div className={`music-item ${item.id === id && 'active'}`} key={item.id} onClick={() => { handleSelectMusic(item) }}>
                  <span className="music-no">{index + 1}</span>
                  <div className="music-info">
                    <p className="music-title">{item.name}</p>
                    <p className="music-singer">{formatSinger(item.ar)} {item.al.name && `- ${item.al.name}`}</p>
                  </div>
                </div>
              )} />) : <Loading noTip />}
          </div>
          {musicList.length > 0 && <div className="music-list-control">
            <div className={`icon-btn ${page.offset === 1 && "disabled"}`} onClick={() => handlePageUpdate(false)}>
              <div className="icon"><ChevronLeftIcon /></div>
            </div>
            <div className="page-show">{page.offset} / {Math.ceil(listTotal / 30)}</div>
            <div className={`icon-btn ${page.offset >= Math.ceil(listTotal / page.offset) && "disabled"}`} onClick={() => handlePageUpdate(true)}>
              <div className="icon"><ChevronRightIcon /></div>
            </div>
          </div>}
        </div>

      </div>
      <div className="music-info-root">
        <div className="header">
          <p className="music-title">{info && info.name}</p>
          <p className="music-singer">{formatSinger(info ? info.ar : [])}</p>
        </div>
        <div className="content">
          <div className="music-pic">
            {id && <Avatar src={info && info.al.picUrl} />}
          </div>
          <div className="music-lyric-box">
            <MusicLyric />
          </div>
          {/* <div className="music-canvas">
            <MusicCanvas />
          </div> */}
        </div>
        <div className="footer">
          <div className="music-progress">
            <span className='text-xs'>{timestamp2Time(progress.ct)}</span>
            <div className='progress-box'>
              <Progress />
            </div>
            <span className='text-xs'>{timestamp2Time(progress.dt)}</span>
          </div>
          <div className="music-canvas">
            <MusicCanvas />
          </div>

        </div>
      </div>

    </div>
  );
}

export default MusicPlay