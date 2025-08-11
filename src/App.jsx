import { useEffect, useState } from "react"
import ChatUi from "./components/ChatUi"
import Dashboard from "./components/Dashboard"
import { useDispatch,useSelector } from "react-redux";
import dataBaseService from "./appwrite/databaseService";

function App() {
  const dispatch=useDispatch()
  const currentUserData=useSelector(state=>state.currentUser.currentUserData)
  const {allChats}=useSelector(state=>state.extraInfo)
 
   useEffect(()=>{
    const unSubscribeChat= dataBaseService.watchChat(dispatch,currentUserData?.$id)
    if (!allChats || allChats.length === 0) return;
    const unSubscribeMessages=dataBaseService.watchMessages(dispatch)
    return ()=>{
      unSubscribeChat()
      unSubscribeMessages()
    }
   },[allChats])
  const [isChatVisible,setIsChatVisible]=useState(false)
  return <div className="h-screen w-screen bg-secondary flex">
     <Dashboard isChatVisible={isChatVisible} setIsChatVisible={setIsChatVisible}/>
   <ChatUi isChatVisible={isChatVisible} setIsChatVisible={setIsChatVisible}/>
  </div>
}

export default App