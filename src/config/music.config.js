import store from '../store'
import { updateProgress } from '../store/music/musicActions';

const audioEle = new Audio();
// document.body.appendChild(audioEle);

export const audioPlayer = audioEle;


audioPlayer.addEventListener('timeupdate', () => {
  store.dispatch(updateProgress({ct: audioPlayer.currentTime * 1000}))
})
