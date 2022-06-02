import store from '../store'
import { updateProgress } from '../store/music/musicActions';

const audioEle = new Audio();
audioEle.crossOrigin = "anonymous";
// document.body.appendChild(audioEle);

export const audioPlayer = audioEle;


audioPlayer.addEventListener('timeupdate', () => {
  store.dispatch(updateProgress({ct: audioPlayer.currentTime * 1000}))
})

audioPlayer.addEventListener('ended', () => {
  console.log('music play ended');
})