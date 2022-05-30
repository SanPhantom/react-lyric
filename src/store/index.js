import { configureStore } from '@reduxjs/toolkit';
import logger from 'redux-logger';
import thunk from 'redux-thunk';
import musicReducer from './music/musicSlice';
import userReducer from './user/userSlice'

const store = configureStore({
  reducer: {
    user: userReducer,
    music: musicReducer
    
  },
  // middleware: (getDefaultMiddleware) => 
  //   process.env.NODE_ENV === 'production'
  //   ? getDefaultMiddleware().concat(thunk)
  //   : getDefaultMiddleware().concat(thunk).concat(logger)
})

export default store;