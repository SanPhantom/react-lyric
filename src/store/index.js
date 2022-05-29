import { configureStore } from '@reduxjs/toolkit';
import logger from 'redux-logger';
import thunk from 'redux-thunk';
import musicReducer from './music/musicSlice';

const store = configureStore({
  reducer: {
    music: musicReducer,
  },
  // middleware: (getDefaultMiddleware) => 
  //   process.env.NODE_ENV === 'production'
  //   ? getDefaultMiddleware().concat(thunk)
  //   : getDefaultMiddleware().concat(thunk).concat(logger)
})

export default store;