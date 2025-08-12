import { useSelector } from "react-redux";
import { formatDate } from "../utility/formatdate";
import fileService from "../appwrite/fileDatabaseService";

export default function MessageCard({ content, sentAt, senderId, imageURL, status }) {
  const currentUserId = useSelector(
    (state) => state.currentUser.currentUserData?.$id
  );

  const isCurrentUser = senderId === currentUserId;

  return (
    <div className={`flex flex-col gap-1 my-3 ${isCurrentUser ? "items-end" : "items-start"}`}>
      <span className="text-sm text-gray-300">{formatDate(sentAt)}</span>
      {!imageURL ? (
        <div
          className={`relative text max-w-[75%] p-2 px-4 text-center rounded-3xl text-white ${
            isCurrentUser ? "bg-accent rounded-tr-none" : "bg-primary rounded-tl-none"
          }`}
        >
          <p className={`text-sm whitespace-pre-wrap ${isCurrentUser? "mr-5" :""}`}>{content}</p>

          {/* Status tick */}
          {isCurrentUser && (
            <div className="absolute text-slate-900 bottom-0 right-2">
              {status=="sending" ? <span>✓</span> : status=="sent" && <span>✓✓</span>}
            </div>
          )}
        </div>
      ) : (
        <div className="relative image max-w-[75%] p-2 px-4 text-center rounded-3xl text-white">
          <img
            src={fileService.getFileView(imageURL)}
            alt="photo"
            className="block h-30 w-30 rounded object-center object-cover"
          />
          {content && (
            <p className="text-sm whitespace-pre-wrap text-right">{content}</p>
          )}

          {/* Status tick */}
          {isCurrentUser && (
            <div className="absolute top-27 text-white right-5">
              {status=="sending" ? <span>✓</span> : status=="sent" && <span>✓✓</span>}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
