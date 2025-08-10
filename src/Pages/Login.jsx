import { useNavigate,Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useState } from "react";
import * as z from "zod"
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye,EyeOff } from "lucide-react";
import Input from "../components/Input";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

import { fetchCurrentUserInfo, login } from "../store/currentUserSlice";
import authService from "../appwrite/auth"
import { fetchAllChats,fetchAllFriends } from "../store/extraInfoSlice";
const formSchema = z.object({
    email: z.string().email("Enter a valid email"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
  });
export default function Login() {
    const[isPasswordVisible,setIsPasswordVisible]=useState(false)
    const[error,setError]=useState("")
    const dispatch=useDispatch()
    const navigate=useNavigate()
    const {
      register,
      handleSubmit,
      reset,
      formState: { errors, isSubmitting },
    } = useForm({
      resolver: zodResolver(formSchema),
    });
   async function submit(data){
        try {
            const loginResponse=await authService.login(data)
            if(loginResponse){
                const currentUser=await authService.getCurrentUser()
                toast.success("✅ Welcome back! You're in.");  
                if(currentUser){
                    dispatch(login())
                    dispatch(fetchCurrentUserInfo(currentUser.$id))
                    dispatch(fetchAllChats(currentUser.$id))
                    dispatch(fetchAllFriends(currentUser.$id))
                    reset()
                    navigate("/")
                }
                else{
                    dispatch(logout())
                }
            }
        } catch (error) {
          toast.error("⚠️ Oops! Couldn't log you in.");
            setError(error.message)
        }
    }
  return (
    <div className="h-screen w-screen flex items-center justify-center bg-primary text-text p-5 md:p-10">
      <div className="formcard  w-96 bg-secondary rounded-lg p-4 shadow-md">
        <h1 className="text-center font-semibold text-2xl mt-3">Login Form</h1>
        <form onSubmit={handleSubmit(submit)} className="space-y-5 mt-4">
        <Input
            placeholder="Enter your email"
            label="Email"
            {...register("email")}
            error={errors.email?.message}
          />
           <div className="relative">
       <Input
            placeholder="Enter your password"
            type={isPasswordVisible? "text": "password"}
            label="Password"
            {...register("password")}
            error={errors.password?.message}
          />
          <button  type="button" onClick={()=>setIsPasswordVisible(prev=>!prev)} className="absolute top-9 right-2">
            {isPasswordVisible ?<EyeOff/>:<Eye/> }
          </button>
       </div>
          <button
            type="submit"
            className="w-full bg-accent text-white py-2 rounded hover:bg-soft-accent transition"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Submitting..." : "Login"}
          </button>
        </form>
        {!!error && <p className="text-red-500 text-sm my-1">*{error}</p> }
        <p className="text-center text-sm text-gray-600 mt-2">
        Don't have an account?{" "}
        <Link to="/signup" className="text-accent hover:underline font-medium">
          Sign UP here
        </Link>
      </p>
      </div>
    </div>
  );
}
