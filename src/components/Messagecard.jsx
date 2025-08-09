import { useSelector } from "react-redux";
import { formatDate } from "../utility/formatdate";

export default function MessageCard({ content, sentAt, senderId }) {
  const currentUserId = useSelector(
    (state) => state.currentUser.currentUserData?.$id
  );

  const isCurrentUser = senderId === currentUserId;

  return (
     <div className={`flex flex-col gap-1 my-3 ${isCurrentUser? "items-end":"items-start"}`}>
      <span className="text-sm text-gray-300">
          {formatDate(sentAt)}
        </span>
       <div className={`max-w-[75%] p-2 px-4 text-center rounded-3xl  text-white relative ${isCurrentUser ? "bg-accent rounded-tr-none" : "bg-primary rounded-tl-none"}`}>
        <p className="text-sm whitespace-pre-wrap">{content}</p>
      </div>
     </div>
  );
}
