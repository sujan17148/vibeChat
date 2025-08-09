import {EllipsisVertical,Sun} from "lucide-react"
import {useDispatch, useSelector } from "react-redux"
import Logout from "./LogoutButton"
import SearchBar from "./Search"
import { useEffect, useState } from "react"
import {updateActiveChat} from "../store/extraInfoSlice"
import { formatDate } from "../utility/formatdate"
import ChangeProfilePicture from "./ChangeProfilePricture"
import fileService from "../appwrite/fileDatabaseService"
import UserProfile from "./UserProfile"
export default function Dashboard({isChatVisible,setIsChatVisible}){
  const dispatch=useDispatch()
  const currentUserData=useSelector(state=>state.currentUser.currentUserData)
  const {allChats,allFriends}=useSelector(state=>state.extraInfo)
  useEffect(()=>{
     if(allChats && allChats.length>0){
      dispatch(updateActiveChat(allChats[0]))
     }
  },[allChats])
    return currentUserData && <div className={`${isChatVisible ? "hidden": "flex"} sm:flex w-screen bg-secondary sm:max-w-105 md:1/3  hide-scrollbar sm:border-r text-text border-r-text h-screen  flex-col`}>
    <div className="h-16 w-full flex items-center justify-between border-b border-b-text p-5">
      <p className="font-semibold text-2xl">VibeChat</p>
       <Menu/>
    </div>

     <div className="friends-list w-full grow flex flex-col p-3">
               <SearchBar/>
               <div className="grow">
                 {allFriends && allChats?.map(chat=>{
                  const userId=chat.users.find(id=>id!==currentUserData.$id)
                  const friend=allFriends.find(user=>user.$id===userId)
                    return friend && <UserCard setIsChatVisible={setIsChatVisible} key={chat.$id} $id={chat.$id} username={friend.username} avatar={friend.avatar} lastMessage={chat.lastMessage} lastSentAt={chat.lastSentAt}/>
                 })}
               </div>
            </div>

    <div className="user-profile h-16 w-full flex items-center justify-between border-t border-t-text p-5">
     {currentUserData && <UserProfile username={currentUserData.username} avatar={currentUserData.avatar}/>}
      <Logout/>
    </div>
</div>
}
function Menu(){
  const [isMenuHidden,setIsMenuHidden]=useState(true)
  return <div className="relative">
    <EllipsisVertical onClick={()=>setIsMenuHidden(prev=>!prev)} className="h-10 w-10 p-2 rounded-full hover:bg-slate-400/30"/>
    <ChangeProfilePicture setIsMenuHidden={setIsMenuHidden} className={`${isMenuHidden ? "hidden": "flex"} items-center gap-2 absolute right-2`}/>
  </div>
}

function UserCard({username,$id,lastMessage,lastSentAt,avatar,setIsChatVisible}){
  const dispatch=useDispatch()
  const {allChats,activeChat}=useSelector(state=>state.extraInfo)
  function handleActiveChatChange(){
     if(allChats){
      const targetChat= allChats.find(chat=>chat.$id==$id)
      dispatch(updateActiveChat(targetChat))
      setIsChatVisible(true)
     } 
  }
return allChats && <div onClick={handleActiveChatChange} className={` flex justify-between items-center p-3 hover:bg-slate-600/30 rounded ${activeChat?.$id==$id? "bg-slate-600/30":""}`}>
<div className="details flex items-center gap-2">
  {avatar ?  <img
         src={fileService.getAvatarView(avatar)}
         alt="avatar"
        className="avatar  w-10 h-10 text-2xl rounded-full bg-slate-400/30 flex justify-center items-center capitalize"/>:
        <span className="avatar  w-10 h-10 text-2xl rounded-full text-white bg-slate-400/30 flex justify-center items-center capitalize">{username.split("")[0]}</span>
        }
<div className="profile-details">
    <p className="capitalize">{username}</p>
     <p className="line-clamp-1">{lastMessage || "start Messaging..."}</p>
</div>
</div>
<p className="text-sm">{formatDate(lastSentAt)}</p>
</div>
}