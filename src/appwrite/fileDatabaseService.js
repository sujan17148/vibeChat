import { Client, Storage, ID} from "appwrite";
import conf from "../conf/conf";

class FileService{
client =new Client()
bucket
constructor() {
    this.client
      .setEndpoint(conf.appwriteEndPoint)
      .setProject(conf.appwriteProjectId);
    this.bucket = new Storage(this.client);
  }

  async createFile(file){
    try{
     return await this.bucket.createFile(conf.appwriteProfileBucketId,ID.unique(),file)
    }catch(error){
        console.log("appwrite error creating avatar",error.message)
    }
  }
   getFileView(fileId){
      try {
          return  this.bucket.getFileView(conf.appwriteProfileBucketId,fileId)
      } catch (error) {
        console.log("appwrite getavatar error",error.message)
        throw error
      }
  }
  async updateAvatar({file,id}){
      try {
          await this.bucket.deleteFile(conf.appwriteProfileBucketId,id)
          return await this.bucket.createFile(conf.appwriteProfileBucketId,ID.unique(),file)
      } catch (error) {
        console.log("appwrite error updating avatar",error.message)
        throw error
      }
  }
}
const fileService=new FileService()
export default fileService;