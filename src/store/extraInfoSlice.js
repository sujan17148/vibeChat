import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import dataBaseService from "../appwrite/databaseService";


export const fetchAllChats=createAsyncThunk("currentUser/fetchAllChats",
  async(userId,thunkAPI)=>{
    const response =await dataBaseService.getAllChats(userId)
    return response.documents
  }
)
export const fetchAllFriends=createAsyncThunk("currentUser/fetchAllFriends",
  // we cant use useselector since its a react hook so we have to use getState() to replicate its behaviour inside asyncthunk 
  async(userId)=>{
    const response=await dataBaseService.getAllFriends(userId)
    return response.documents;
  }
)
export const fetchAllMessages=createAsyncThunk("currentUser/fetchAllMessages",
  async(chatId)=>{
   const response=await dataBaseService.getMessages(chatId)
   return response.documents;
  }
)
const initialState = {
  allChats:null,
  allFriends:null,
  activeChat:null,
  allMessages:new Object()
};

const extraInfoslice = createSlice({
  name: "extraInfo",
  initialState,
  reducers:{
  updateActiveChat:(state,action)=>{
   state.activeChat=action.payload
  },
  updateChatsLocally:(state,action)=>{
    const { chatId, lastMessage, lastSentAt,lastMessageType } = action.payload;
    const targetChatIndex=state.allChats.findIndex(chat=>chat.$id===chatId)
    if(targetChatIndex!==-1){
      state.allChats[targetChatIndex].lastMessage=lastMessage
      state.allChats[targetChatIndex].lastSentAt=lastSentAt
      state.allChats[targetChatIndex].lastMessageType=lastMessageType
    }
    state.allChats.sort((a,b)=>new Date(b.lastSentAt)-new Date(a.lastSentAt))
  },
  addFriendToAllFriends: (state, action) => {
    if (!Array.isArray(state.allFriends)) {
      state.allFriends = [];
    }
    state.allFriends.unshift(action.payload);
  },  
  addChat:(state,action)=>{
    if(!Array.isArray(state.allChats)){
      state.allChats=[]
    }
    state.allChats.unshift(action.payload)
  },
  updateLastSentMessageLocally:(state,action)=>{
    const {chatId}=action.payload
    if (!state.allMessages[chatId]) {
      state.allMessages[chatId] = [];
    }
    state.allMessages[chatId].unshift(action.payload)
  }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllChats.fulfilled,(state,action)=>{
        state.allChats=action.payload
      })
      .addCase(fetchAllFriends.fulfilled,(state,action)=>{
        state.allFriends=action.payload
      })
      .addCase(fetchAllMessages.fulfilled,(state,action)=>{
        const messages=action.payload
          if(messages.length>0){
            const chatId=messages[0].chatId
            state.allMessages[chatId]=messages
          }
      })
  },
});

export const {updateActiveChat,updateChatsLocally,updateLastSentMessageLocally,addChat,addFriendToAllFriends}=extraInfoslice.actions
export default extraInfoslice.reducer;
