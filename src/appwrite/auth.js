import { Client, Account,ID } from "appwrite";
import conf from "../conf/conf"

 class AuthService{
    client=new Client()
    account
 constructor(){
    this.client.setEndpoint(conf.appwriteEndPoint) 
    .setProject(conf.appwriteProjectId);
    this.account= new Account(this.client)
 }
async createAccount({email,password,username}){
    try {
         const createUserResponse=await this.account.create(ID.unique(),email,password,username)
         if(createUserResponse){
           await this.login({email,password})
         }
    } catch (error) {
        console.log("appwrite auth error",error.message)
        throw error
    }
}
async login({email,password}){
   try {
    return await this.account.createEmailPasswordSession(email,password)
   } catch (error) {
    console.log("appwrite auth error",error.message)
    throw error
   }
}
async getCurrentUser(){
    try {
        return await this.account.get();
    } catch (error) {
        console.log("appwrite auth error",error.message)
        throw error
    }
}
async getCurrentUserPrefrence(){
    try {
        return await this.account.getPrefs();
    } catch (error) {
        console.log("appwrite auth error",error.message)
        throw error
    }
}
async logOut(){
  try{
    const logOutResponse=  await  this.account.deleteSession("current")
  if(logOutResponse) return true
  }catch(error){
    console.log("appwrite auth error",error.message)
    return false
  }
}
}

const authService=new AuthService()
export default authService;