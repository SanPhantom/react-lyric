import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import './App.less';
import { audioPlayer } from './config/music.config';
import MusicPlay from './pages/MusicPlay';
import { updateFps } from './store/user/userAction';
import { getScreenFps } from './utils/time';

function App() {

  const reduxDispatch = useDispatch();

  useEffect(() => {
    getScreenFps().then(fps => {
      console.log('当前屏幕刷新率为', fps)
      reduxDispatch(updateFps(fps));
    })
    document.body.appendChild(audioPlayer);

  }, []);
  return (
    <div className="App">
      <MusicPlay />
    </div>
  );
}

export default App;
