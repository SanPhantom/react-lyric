import { createSlice } from '@reduxjs/toolkit';

const musicSlice = createSlice({
  name: 'music',
  initialState: {
    loading: false,
    id: null,
    info: null,
    progress: {
      dt: 0,
      ct: 0
    }
  },
  reducers: {
    updateLoading: (state, actions) => {
      const { payload } = actions;
      return {
        ...state,
        loading: payload,
      }
    },
    updateInfo: (state, actions) => {
      const { payload } = actions;
      return {
        ...state,
        id: payload.id,
        info: payload,
      }
    },
    updateProgress: (state, actions) => {
      const { payload } = actions;
      return {
        ...state,
        progress: {
          ...state.progress,
          ...payload,
        }
      }
    }
  },
})

export const { updateLoading, updateInfo } = musicSlice.actions;

export default musicSlice.reducer;