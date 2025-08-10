import Input from "../components/Input";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {  Eye,EyeOff } from "lucide-react";
import { useState } from "react";



import authService from "../appwrite/auth"
import dataBaseService from "../appwrite/databaseService";
import { useDispatch } from "react-redux";
import { useNavigate,Link } from "react-router-dom";
import { fetchCurrentUserInfo, login } from "../store/currentUserSlice";
import { fetchAllChats,fetchAllFriends } from "../store/extraInfoSlice";
import { toast } from "react-toastify";


// 1. Define your Zod schema
const formSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters").max(50),
  email: z.string().email("Enter a valid email"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/,"Password must contain at least one Uppercase")
    .regex(/\d/,"Password must contain at least one digit")
    .regex(/[^A-Za-z0-9]/,"Password must contain at least one special symbol")
});

// 2. Define the component
export default function Signup() {
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


  async function signUp(data) {
      try {
          await authService.createAccount(data)
            const currentUser=await authService.getCurrentUser()
            if(currentUser){
              toast.success("🎉 Account created! Let’s get started.");
              const customUser={
                username:data.username,
                email:data.email,
                userId:currentUser.$id,
                friends:[],
                avatar:null
              }
               await dataBaseService.createUser(customUser) 
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
          
      } catch (error) {
        toast.error("❌ Sign-up failed. Try again.");
        setError(error.message)
      }
  }

  return (
    <div className="h-screen w-screen flex items-center justify-center bg-primary text-text p-5 md:p-10">
      <div className="formcard aspect-[14/16] w-96 bg-secondary rounded p-4 shadow-md">
        <h1 className="text-center font-semibold text-2xl mt-3">
          Sign Up Form
        </h1>
        <form onSubmit={handleSubmit(signUp)} className="space-y-4 mt-4">
          <Input
            placeholder="Enter your name"
            label="Username"
            {...register("username")}
            error={errors.username?.message}
          />
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
            {isSubmitting ? "Submitting..." : "Sign up"}
          </button>
        </form>
        {!!error && <p className="text-red-500 text-sm my-1">*{error}</p> }
        <p className="text-center text-sm text-gray-600 mt-2">
        Already have an account?{" "}
        <Link to="/login" className="text-accent hover:underline font-medium">
          Login here
        </Link>
      </p>
      </div>
    </div>
  );
}
