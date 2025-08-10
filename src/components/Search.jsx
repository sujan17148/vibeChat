import { useEffect, useState } from "react";
import useDebounce from "../Hooks/useDebounce";
import dataBaseService from "../appwrite/databaseService";
import { Query } from "appwrite";
import UserProfile from "./UserProfile"
import { useSelector } from "react-redux";
export default function SearchBar({setIsChatVisible}) {
  const [searchValue, setSearchValue] = useState("");
  const {debouncedValue}=useDebounce(searchValue)
  return (
    <div className=" relative min-w-52 w-full my-2 mx-auto  shadow-xl sm:shadow-none  flex flex-col items-center justify-between rounded-lg">
      <input
        type="text"
        placeholder="Search friends..."
        value={searchValue}
        onChange={(e) => setSearchValue(e.target.value)}
        className="w-full outline-none border-accent border-2 p-2 rounded"
      />
      <ShowSuggestion debouncedValue={debouncedValue} setSearchValue={setSearchValue} setIsChatVisible={setIsChatVisible}/>
    </div>
  );
}

function ShowSuggestion({debouncedValue,setSearchValue,setIsChatVisible}){
    const [allUsers,setAllUsers]=useState(null)
    const currentUserData=useSelector(state=>state.currentUser.currentUserData)
useEffect(()=>{
    if(debouncedValue && debouncedValue.trim()!=""){
        const queries=[
          Query.contains("username".toLowerCase(),debouncedValue.toLowerCase()),
          Query.notEqual("$id",currentUserData.$id),
        ]
        dataBaseService.getAllUsers(queries).then(response=>setAllUsers(response.documents))
    }
    else if(debouncedValue.trim()==""){
      setAllUsers(null)
    }
},[debouncedValue])
return allUsers && <div className="h-fit w-full">
     {allUsers?.map((user,index)=><UserProfile key={index} username={user.username} avatar={user.avatar} $id={user.$id} setIsChatVisible={setIsChatVisible} setSearchValue={setSearchValue} isClickable={true} isNotFriend={!currentUserData?.friends.includes(user.$id)}/>)}
</div>
}
