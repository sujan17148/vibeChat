import fileService from "../appwrite/fileDatabaseService"
import { useSelector,useDispatch } from "react-redux"
import AddFriendButton from "./AddFriendButton"
import { formatDate } from "../utility/formatdate"
import { updateActiveChat } from "../store/extraInfoSlice"

export default function UserProfile({username,avatar,...props}){
  const dispatch=useDispatch()
  const currentUserData=useSelector(state=>state.currentUser.currentUserData)
  const {allChats}=useSelector(state=>state.extraInfo)
  function handleActiveChatChange(){
    if(props.isNotFriend) return;
    if(currentUserData && allChats){
      const targetChat=allChats.find(chat=>chat.users.includes(currentUserData.$id) && chat.users.includes(props.$id))
      dispatch(updateActiveChat(targetChat))
      props.setIsChatVisible(true)
    }
  }
    return <div onClick={()=>props.isClickable && handleActiveChatChange()} className={`${props?.isClickable ? "p-3 hover:bg-slate-600/30": ""}   flex items-center justify-between  rounded`}> 
  <div  className="flex items-center gap-3">
     {avatar ?  <img
         src={fileService.getFileView(avatar)}
         alt="avatar"
        className="avatar  w-10 h-10 text-2xl rounded-full bg-slate-400/30 flex justify-center items-center capitalize object-center object-cover"/>:
        <span className="avatar  w-10 h-10 text-2xl rounded-full text-white bg-slate-400/30 flex justify-center items-center capitalize">{username.split("")[0]}</span>
        }
        <div><p className="capitalize">{username}</p>
        {props.lastMessageType=="image" ? <p className="flex items-center gap-1">image</p> :<p className="line-clamp-1">{props.lastMessage}</p>}</div>
     </div>
     {props.lastSentAt && <p className="text-sm">{formatDate(props.lastSentAt)}</p>}
     {!currentUserData?.friends.includes(props.$id) && props.isNotFriend &&  <AddFriendButton $id={props.$id} setSearchValue={props.setSearchValue}/>}
    </div>
}