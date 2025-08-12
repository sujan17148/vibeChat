import { Client, Databases, ID,Permission,Query,Role } from "appwrite";
import conf from "../conf/conf";
import { fetchAllChats, fetchAllFriends,updateChatsLocally,updateLastSentMessageLocally} from "../store/extraInfoSlice";
import store from "../store/store"

class DataBaseService {
  client = new Client();
  databases;
  constructor() {
    this.client
      .setEndpoint(conf.appwriteEndPoint)
      .setProject(conf.appwriteProjectId);
    this.databases = new Databases(this.client);
  }
  //user related serivces

async createUser({username,userId,email,friends=[],avatar}){
      try {
         return await this.databases.createDocument(conf.appwriteDatabaseId,conf.appwriteUserCollectionId,userId,{username,email,friends,avatar})
      } catch (error) {
         console.log("appwrite error creating user",error.message)
         throw error;
      }
  }
async getUser(userId){
  try {
      return await this.databases.getDocument(conf.appwriteDatabaseId,conf.appwriteUserCollectionId,userId)
  } catch (error) {
    console.log(error.message)
  }
}
async getAllUsers(queries=[]){
  try {
    return await this.databases.listDocuments(conf.appwriteDatabaseId,conf.appwriteUserCollectionId,queries)
} catch (error) {
  console.log(error.message)
}
}
async getAllFriends(userId){
   try {
      return await this.databases.listDocuments(conf.appwriteDatabaseId,conf.appwriteUserCollectionId,[Query.contains("friends",userId)])
   } catch (error) {
    throw error
   }
}
async updateFriend({userId,friends}){
   try {
      return await this.databases.updateDocument(conf.appwriteDatabaseId,conf.appwriteUserCollectionId,userId,{friends})
   } catch (error) {
     console.log(error.message)
   }
}
async updateAvatar({userId,avatar}){
  try {
    return await this.databases.updateDocument(conf.appwriteDatabaseId,conf.appwriteUserCollectionId,userId,{avatar})
  } catch (error) {
    throw error
  }
}



  //chat related services
  async createChat({ users, lastSentAt,lastMessage,lastMessageType="text"}) {
    try {
      return await this.databases.createDocument(
        conf.appwriteDatabaseId,
        conf.appwriteChatCollectionId,
        ID.unique(),
        {
          users,
          lastSentAt,
          lastMessage,
          lastMessageType
        },
        [
            Permission.read(Role.any()),
            Permission.update(Role.any()),
        ]
      );
    } catch (error) {
      console.log("appwrite error creating chat", error.message);
      throw error;
    }
  }
  async getAllChats(userId){
    try {
       return await this.databases.listDocuments(conf.appwriteDatabaseId,conf.appwriteChatCollectionId,[
        Query.contains("users",userId),
        Query.orderDesc("lastSentAt"),
        Query.limit(15)
       ])
    } catch (error) {
      console.log("error appwrite listing chats",error.message)
      throw error
    }
  }

  async updateChat({lastSentAt,chatId,lastMessage,lastMessageType}){
    try {
      return await this.databases.updateDocument(conf.appwriteDatabaseId,conf.appwriteChatCollectionId,chatId,{lastSentAt,lastMessage,lastMessageType})
    } catch (error) {
      console.log(error)
      throw error
    }
  }
  async deleteChat({chatId}){
try{
  const deleteChatResponse=await this.databases.deleteDocument(conf.appwriteDatabaseId,conf.appwriteChatCollectionId,chatId)
  if(deleteChatResponse) return true
}catch(error){
  console.log("appwrite error deleting chat",error.message)
  return false;
}
  }

  //message realated service
   async createMessage({$id,chatId,senderId,content,sentAt,contentType,imageURL="null"}){
     try {
      return  await this.databases.createDocument(conf.appwriteDatabaseId,conf.appwriteMessageCollectionId,$id,{chatId,senderId,content,sentAt,contentType,imageURL})
     } catch (error) {
      console.log("appwrite create message ",error.message)
     }
   }
   async getMessages(chatId){
    try {
     return await this.databases.listDocuments(conf.appwriteDatabaseId,conf.appwriteMessageCollectionId,
        [
         Query.equal("chatId",chatId),
         Query.orderDesc("sentAt"),
         Query.limit(100)
        ])
    } catch (error) {
     console.log("appwrite get message ",error.message)
    }
   }
   async getLastMessage(messageId){
    try {
      return await this.databases.getDocument(conf.appwriteDatabaseId,conf.appwriteMessageCollectionId,messageId)
     } catch (error) {
      console.log("appwrite get message ",error.message)
     }
   }

//watch changes in messages
watchMessages(dispatch,currentUserId){
return  this.client.subscribe( `databases.${conf.appwriteDatabaseId}.collections.${conf.appwriteMessageCollectionId}.documents`,response=>{
  const message = response.payload;
  const {chatId}=message;
     this.databases.getDocument(conf.appwriteDatabaseId,conf.appwriteChatCollectionId,chatId).then(chat=>{
      if(chat.users.includes(currentUserId)){
        dispatch(updateLastSentMessageLocally({
          ...message,
          status: message.senderId === currentUserId ? "sent" : ""
        }));
      }
     })
})
}

//watch changes in chat
watchChat(dispatch,currentUserId) {
 return this.client.subscribe(
    `databases.${conf.appwriteDatabaseId}.collections.${conf.appwriteChatCollectionId}.documents`,
    response => {
      const chatPayLoad={
        chatId:response.payload.$id,
        lastMessage:response.payload.lastMessage,
        lastSentAt:response.payload.lastSentAt,
        lastMessageType:response.payload.lastMessageType,
      }
      const state=store.getState()
        const isChatAvailable=state.extraInfo.allChats.find(chat=>chat.$id==response.payload.$id)
        if(!isChatAvailable){
          dispatch(fetchAllFriends(currentUserId))
          dispatch(fetchAllChats(currentUserId))
        }
      else{
        dispatch(updateChatsLocally(chatPayLoad))
      }
    }
  );
}

}
const dataBaseService = new DataBaseService();
export default dataBaseService;
