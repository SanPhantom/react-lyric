import { createSlice } from '@reduxjs/toolkit';

const userSlice = createSlice({
  name: 'user',
  initialState: {
    id: null,
    userInfo: {},
    fps: 0,
  },
  reducers: {
    updateId: (state, actions) => {
      return {
        ...state,
        id: actions.payload
      }
    },
    updateUserInfo: (state, actions) => {
      return {
        ...state,
        userInfo: {
          ...state.userInfo,
          ...actions.payload
        }
      }
    },
    updateFps: (state, actions) => {
      return {
        ...state,
        fps: actions.payload
      }
    }
  }
})

export const { updateId, updateUserInfo } = userSlice.actions;

export default userSlice.reducer;