import { useDispatch } from "react-redux"
import authService from "../appwrite/auth"
import {logout} from "../store/currentUserSlice"
import { useNavigate } from "react-router-dom"
export default function Logout(){
    const dispatch=useDispatch()
    const navigate=useNavigate()
   async  function handleLogout(){
      const logoutResponse=await authService.logOut()
      if(logoutResponse){
       dispatch(logout())
       navigate("/login")
      }
    }
    return <button onClick={handleLogout} className="bg-accent hover:scale-105 active:scale-95 transition duration-300 ease-linear font-semibold hover:bg-sky-700 text-text py-2 px-4 whitespace-nowrap rounded">Logout</button>
}