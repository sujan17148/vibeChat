import fileService from "../appwrite/fileDatabaseService"
import dataBaseService from "../appwrite/databaseService"
import { useDispatch, useSelector } from "react-redux"
import { changeAvater } from "../store/currentUserSlice"
import { toast } from "react-toastify"

export default function ChangeProfilePicture({setIsMenuHidden,className=""}){
    const currentUserData=useSelector(state=>state.currentUser.currentUserData)
    const dispatch=useDispatch()
   async function handleProfileChange(event){
        setIsMenuHidden(true)
   try {
    if(currentUserData.avatar==null){
        const fileUploadResponse=await fileService.createFile(event.target.files[0])
        console.log(fileUploadResponse)
        if(fileUploadResponse){
          dispatch(changeAvater(fileUploadResponse.$id))
          await dataBaseService.updateAvatar({userId:currentUserData.$id,avatar:fileUploadResponse.$id})
        }
    }
    else{
        const fileUploadResponse=await fileService.updateAvatar({id:currentUserData.avatar,file:event.target.files[0]})
        console.log(fileUploadResponse)
        if(fileUploadResponse){
            dispatch(changeAvater(fileUploadResponse.$id))
           await dataBaseService.updateAvatar({userId:currentUserData.$id,avatar:fileUploadResponse.$id})
        }
    }
    toast.success("🖼️ Profile picture updated!");  
   } catch (error) {
    toast.error("⚠️ Couldn't update profile."); 
    console.log(error)
   }
       
    }
    return  <label
    htmlFor="file-upload"
    className={`${className} whitespace-nowrap  p-2.5 text-white font-medium rounded-lg cursor-pointer bg-accent transition`}
  >
    <svg
      className="w-5 h-5"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 16V4m0 0L8 8m4-4l4 4M4 16.5A2.5 2.5 0 016.5 14H7m10 0h.5a2.5 2.5 0 012.5 2.5v.5a2.5 2.5 0 01-2.5 2.5H6.5A2.5 2.5 0 014 17v-.5A2.5 2.5 0 016.5 14H7"
      />
    </svg>
    change Profile
    <input
      id="file-upload"
      type="file"
      multiple
      onChange={handleProfileChange}
      className="hidden"
    />
  </label>  
}


