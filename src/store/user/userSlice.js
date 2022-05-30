import { createSlice } from '@reduxjs/toolkit';

const userSlice = createSlice({
  name: 'user',
  initialState: {
    id: null,
    userInfo: {},
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
    }
  }
})

export const { updateId, updateUserInfo } = userSlice.actions;

export default userSlice.reducer;