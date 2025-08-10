import {EllipsisVertical,Sun} from "lucide-react"
import {useDispatch, useSelector } from "react-redux"
import Logout from "./LogoutButton"
import SearchBar from "./Search"
import { useEffect, useState } from "react"
import {updateActiveChat} from "../store/extraInfoSlice"
import ChangeProfilePicture from "./ChangeProfilePricture"
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
    return currentUserData && <div className={`${isChatVisible ? "hidden": "flex"} sm:flex w-screen bg-secondary sm:max-w-105 md:1/3  hide-scrollbar sm:border-r text-text border-r-text h-[100dvh]  flex-col`}>
    <div className="h-16 w-full flex items-center justify-between border-b border-b-text p-5">
      <p className="font-semibold text-2xl">VibeChat</p>
       <Menu/>
    </div>

     <div className="friends-list w-full grow flex flex-col p-3">
               <SearchBar setIsChatVisible={setIsChatVisible}/>
               <div className="grow">
                <p className="my-2 font-semibold text-lg">Friends</p>
                 {allFriends && allChats?.map(chat=>{
                  const userId=chat.users.find(id=>id!==currentUserData.$id)
                  const friend=allFriends.find(user=>user.$id===userId)
                    return friend && <UserProfile setIsChatVisible={setIsChatVisible} key={chat.$id} $id={friend.$id} username={friend.username} avatar={friend.avatar} lastMessage={chat.lastMessage} lastSentAt={chat.lastSentAt} isClickable={true}/>
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
