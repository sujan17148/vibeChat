import { Plus } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import databaseServie from "../appwrite/databaseService"
import { addFriend } from "../store/currentUserSlice";
import { addChat, addFriendToAllFriends, updateActiveChat } from "../store/extraInfoSlice";
import getDefaultMessage from "../utility/getDefaultMessage"
import { useState } from "react";
import { toast } from "react-toastify";
export default function AddFriendButton({$id,setSearchValue}){
    const [loading, setLoading] = useState(false);
    const dispatch=useDispatch()
    const currentUserData=useSelector(state=>state.currentUser.currentUserData)
    async function handleAddFriend(){
     try {
        setLoading(true)
        const friendUser=await databaseServie.getUser($id)
        setSearchValue("")
        if(friendUser){
         const chatPayload={
            users:[currentUserData.$id,friendUser.$id],
            lastSentAt:new Date("2000-01-01T00:00:00.000Z"),
            lastMessage:getDefaultMessage(),
            lastMessageType:"text"
            }
            if(friendUser.friends.includes(currentUserData.$id)){
               toast.error(`🤝 You’re already friends with ${friendUser.username}!`);
               return;
            } 
            await databaseServie.updateFriend({userId:currentUserData.$id,friends:[...currentUserData.friends,$id]})
            await databaseServie.updateFriend({userId:$id,friends:[...friendUser.friends,currentUserData.$id]})
            toast.success(`🤝 You’re now friends with ${friendUser.username}!`); 
            dispatch(addFriend($id))
            const activeChat= await databaseServie.createChat(chatPayload)
            dispatch(addChat(activeChat))
            dispatch(addFriendToAllFriends(friendUser))
            dispatch(updateActiveChat(activeChat))
        }
     } catch (error) {
      toast.error("⚠️ Couldn't add friend."); 
        console.log(error.message)
     }
     finally{
        setLoading(false)
     }
    }

return <button disabled={loading}><Plus onClick={handleAddFriend} className="w-10 h-10 p-2 hover:bg-accent rounded-full"/></button>
}