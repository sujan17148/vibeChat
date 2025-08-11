import { useSelector } from "react-redux";
import { formatDate } from "../utility/formatdate";
import fileService from "../appwrite/fileDatabaseService";

export default function MessageCard({ content, sentAt, senderId,imageURL}) {
  const currentUserId = useSelector(
    (state) => state.currentUser.currentUserData?.$id
  );

  const isCurrentUser = senderId === currentUserId;

  function downloadImage(){

  }

  return (
     <div className={`flex flex-col gap-1 my-3 ${isCurrentUser? "items-end":"items-start"}`}>
      <span className="text-sm text-gray-300">
          {formatDate(sentAt)}
        </span>
{!imageURL ?
 <div className={`text max-w-[75%] p-2 px-4 text-center rounded-3xl  text-white relative ${isCurrentUser ? "bg-accent rounded-tr-none" : "bg-primary rounded-tl-none"}`}>
 <p className="text-sm whitespace-pre-wrap">{content}</p>
</div>:
<div className=" image max-w-[75%] p-2 px-4 text-center rounded-3xl  text-white ">
  <img src={fileService.getFileView(imageURL)} alt="photo" className="relative block h-30 w-30 rounded object-center object-cover" />
{content &&  <p className="text-sm whitespace-pre-wrap text-right">{content}</p>}
</div>
}
      
     </div>
  );
}
