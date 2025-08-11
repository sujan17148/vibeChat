import { useDispatch, useSelector } from "react-redux";
import { useEffect, useRef, useState } from "react";
import { ArrowLeft, Send,Plus } from "lucide-react";
import dataBaseService from "../appwrite/databaseService";
import { updateChatsLocally,fetchAllMessages } from "../store/extraInfoSlice";
import MessageCard from "./Messagecard";
import UserProfile from "./UserProfile";
import fileService from "../appwrite/fileDatabaseService";


export default function ChatUi({isChatVisible,setIsChatVisible}) {
  const currentUserData = useSelector((state) => state.currentUser.currentUserData);
  const { activeChat, allFriends } = useSelector((state) => state.extraInfo);
  const activeUser = activeChat && allFriends
  ? allFriends.find((user) => activeChat.users.includes(user.$id) && user.$id !== currentUserData.$id)
  : null;
  return <div className={`${isChatVisible ? "flex" :"hidden"} sm:flex h-[100dvh] w-full justify-center items-center`}> 
   { !activeChat ? 
   <h1 className="text-center text-white text-3xl font-semibold">✨ Break the silence. Send your first message!</h1>:
   activeUser && (
      <div className="flex  bg-secondary  w-full  h-full flex-col  sm:flex  text-text ">
        <div className="profile-section h-16 border-b border-b-text w-full flex items-center gap-2 p-2">
          <ArrowLeft onClick={()=>setIsChatVisible(false)} className="sm:hidden  h-8 w-8  rounded-full flex items-center justify-center hover:bg-slate-400/30 p-1.5"/>
          <UserProfile username={activeUser.username} avatar={activeUser.avatar}/>
        </div>
        <ChatSection activeChat={activeChat}/>
        <SendMessage
          activeChat={activeChat}
          currentUserData={currentUserData}
          />
      </div>
    )}
          </div>
}

function ChatSection({activeChat}){
  const dispatch=useDispatch()
  let chatBoxRef=useRef()
  useEffect(()=>{
    if(activeChat){
      chatBoxRef.current.scrollTop=chatBoxRef.current.scrollHeight
      if (!allMessages[activeChat.$id] || allMessages[activeChat.$id].length === 0) {
      dispatch(fetchAllMessages(activeChat.$id));
    }
    }
  },[activeChat])
  const allMessages=useSelector(state=>state.extraInfo.allMessages)
  const activeChatMessages=allMessages[activeChat?.$id]
  return  <div ref={chatBoxRef} className="chat-section w-full grow p-3  max-h-[calc(100dch-68px)] overflow-y-scroll hide-scrollbar">
     { activeChatMessages && activeChatMessages.length>0 && [...activeChatMessages].reverse()?.map(message=><MessageCard key={message.$id} {...message}/>)}
</div>
}

function SendMessage({ activeChat, currentUserData }) {
  const [selectedImage,setSelectedImage]=useState(null)
  const dispatch = useDispatch();
  const [message, setMessage] = useState("");
  async function sendMessage() {
    try {
      let payLoad={
        chatId:activeChat.$id,
        senderId:currentUserData.$id,
        sentAt:new Date().toISOString(),
      }
      let payloadForUpdateChat = {
        chatId: activeChat.$id,
        lastSentAt: payLoad.sentAt,
      };
      if(selectedImage){
        const imageResponse= await fileService.createFile(selectedImage)
       payLoad={
        ...payLoad,content:message || "",
        imageURL:imageResponse.$id,
        contentType:"image"
       }
       payloadForUpdateChat={...payloadForUpdateChat,lastMessageType:"image",lastMessage:message || ""}
      }
      else{
        if (message.trim() === "")
          throw new Error("please type message before sending");
        payLoad={...payLoad,content:message,contentType:"text",imageURL:null}
        payloadForUpdateChat={...payloadForUpdateChat,lastMessageType:"text",lastMessage:message}
        
      }
      await dataBaseService.createMessage(payLoad);
      await dataBaseService.updateChat(payloadForUpdateChat);
      dispatch(updateChatsLocally(payloadForUpdateChat));
      setMessage("");
      setSelectedImage(null)
    } catch (error) {
      console.log(error);
    }
  }
  return (
    <div className="bottom-section h-16 border-t border-t-text w-full flex items-center justify-end p-2 gap-1.5 sm:gap-3 ">
<label
    htmlFor="send-photo"
    className="whitespace-nowrap relative p-[6px] sm:p-2.5 text-white font-medium rounded-full cursor-pointer bg-accent hover:bg-soft-accent "
  >
   <Plus/>
    <input
      id="send-photo"
      type="file"
      multiple
      onChange={(e)=>setSelectedImage(e.target.files[0])}
      className="hidden"
    />

{selectedImage && (
   <span className="absolute bottom-11 left-1/2 md:-translate-x-[30%]  p-1  rounded backdrop-blur-2xl font-normal text-sm bg-slate-400/30 text-center">Image Selected</span>
  )}
  </label>
 
  
      <input
      onKeyDown={(e)=>{
        if(e.key=="Enter"){
          sendMessage()
        }
      }}
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Start Messaging..."
        className="border border-accent outline-none rounded p-2 grow "
      />
      <button
        onClick={sendMessage}
        className="bg-accent rounded whitespace-nowrap p-2 px-3 flex gap-2 items-center font-semibold text-base hover:scale-105 active:scale-95 transition duration-300 ease-linear hover:bg-sky-700"
      >
        <span className="hidden sm:inline-block">Send</span> <Send/>
      </button>
    </div>
  );
}
