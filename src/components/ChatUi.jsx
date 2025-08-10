import { useDispatch, useSelector } from "react-redux";
import { useEffect, useRef, useState } from "react";
import { ArrowLeft, Send } from "lucide-react";
import dataBaseService from "../appwrite/databaseService";
import { updateChatsLocally,fetchAllMessages } from "../store/extraInfoSlice";
import MessageCard from "./Messagecard";
import UserProfile from "./UserProfile";


export default function ChatUi({isChatVisible,setIsChatVisible}) {
  const dispatch=useDispatch()
  const currentUserData = useSelector((state) => state.currentUser.currentUserData);
  const { activeChat, allFriends } = useSelector((state) => state.extraInfo);
  const activeUser = activeChat && allFriends
  ? allFriends.find((user) => activeChat.users.includes(user.$id) && user.$id !== currentUserData.$id)
  : null;

  useEffect(() => {
   const unSubscribe= dataBaseService.watchChat(dispatch,currentUserData?.$id)
   return ()=>unSubscribe()
  }, []);
  return <div className={`${isChatVisible ? "flex" :"hidden"} sm:flex h-full w-full justify-center items-center`}> 
   { !activeChat ? 
   <h1 className="text-center text-white text-3xl font-semibold">✨ Break the silence. Send your first message!</h1>:
   activeUser && (
      <div className="flex  bg-secondary  w-full  h-full flex-col  sm:flex  text-text ">
        <div className="profile-section h-16 border-b border-b-text w-full flex items-center gap-2 p-2">
          <ArrowLeft onClick={()=>setIsChatVisible(false)} className="sm:hidden  h-8 w-8  rounded-full flex items-center justify-center hover:bg-slate-400/30 p-1.5"/>
          <UserProfile username={activeUser.username} avatar={activeUser.avatar}/>
        </div>
        <ChatSection activeChat={activeChat}/>
        <Bottomsection
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
     dispatch(fetchAllMessages(activeChat.$id))
    }
  },[activeChat])
  const allMessages=useSelector(state=>state.extraInfo.allMessages)
  const activeChatMessages=allMessages[activeChat?.$id]
  return  <div ref={chatBoxRef} className="chat-section w-full grow p-3  max-h-[calc(100dch-68px)] overflow-y-scroll hide-scrollbar">
     { activeChatMessages && activeChatMessages.length>0 && [...activeChatMessages].reverse()?.map(message=><MessageCard key={message.$id} content={message.content} sentAt={message.sentAt} senderId={message.senderId}/>)}
</div>
}

function Bottomsection({ activeChat, currentUserData }) {
  const dispatch = useDispatch();
  const [message, setMessage] = useState("");
  async function sendMessage() {
    try {
      if (message.trim() === "")
        throw new Error("please type message before sending");
      const payLoad = {
        chatId: activeChat.$id,
        senderId: currentUserData.$id,
        content: message,
        sentAt: new Date().toISOString(),
      };
      const payloadForUpdateChat = {
        chatId: activeChat.$id,
        lastMessage: message,
        lastSentAt: payLoad.sentAt,
      };
      await dataBaseService.createMessage(payLoad);
      await dataBaseService.updateChat(payloadForUpdateChat);
      setMessage("");
      dispatch(updateChatsLocally(payloadForUpdateChat));
    } catch (error) {
      console.log(error);
    }
  }
  return (
    <div className="bottom-section h-16 border-t border-t-text w-full flex items-center justify-end p-3 gap-3 ">
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
        Send <Send />
      </button>
    </div>
  );
}
