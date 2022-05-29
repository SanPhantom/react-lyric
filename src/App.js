import { useEffect } from 'react';
import './App.less';
import { audioPlayer } from './config/music.config';
import MusicPlay from './pages/MusicPlay';

function App() {
  useEffect(() => {
    console.log("audio load")
    document.body.appendChild(audioPlayer)
  }, []);
  return (
    <div className="App">
      <MusicPlay />
    </div>
  );
}

export default App;
