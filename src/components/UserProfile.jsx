
import fileService from "../appwrite/fileDatabaseService"

export default function UserProfile({username,avatar}){
    return <div className="flex items-center gap-2">
      {avatar ?  <img
         src={fileService.getAvatarView(avatar)}
         alt="avatar"
        className="avatar  w-10 h-10 text-2xl rounded-full bg-slate-400/30 flex justify-center items-center capitalize object-center object-cover"/>:
        <span className="avatar  w-10 h-10 text-2xl rounded-full text-white bg-slate-400/30 flex justify-center items-center capitalize">{username.split("")[0]}</span>
        }
        <p className="capitalize">{username}</p>
        </div>
}