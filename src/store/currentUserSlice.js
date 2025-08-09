import { createSlice,createAsyncThunk } from "@reduxjs/toolkit";
import dataBaseService from "../appwrite/databaseService";

export const fetchCurrentUserInfo = createAsyncThunk(
  "currentUser/fetchCurrentUserInfo",
  async (userId, thunkAPI) => {
    const response = await dataBaseService.getUser(userId);
    return response;
  }
);

const initialState = {
  status: false,
  currentUserData: null,
  loading: true,
  error: false,
};

const currentUserSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state) => {
      state.status = true;
    },
    logout: (state) => {
      state.status = false;
      state.currentUserData = null;
      state.loading=false,
       state.error=false
    },
    addFriend: (state, action) => {
      if (state.currentUserData) {
        state.currentUserData.friends.push(action.payload);
      }
    },
    changeAvater: (state, action) => {
      if (state.currentUserData) {
        state.currentUserData.avatar = action.payload;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCurrentUserInfo.pending, (state) => {
        state.loading = true;
        state.error = false;
      })
      .addCase(fetchCurrentUserInfo.fulfilled, (state, action) => {
        state.loading = false;
        state.error=false
        state.currentUserData = action.payload;
      })
      .addCase(fetchCurrentUserInfo.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })}
});

export const { login, logout,addFriend,changeAvater } = currentUserSlice.actions;
export default currentUserSlice.reducer;
