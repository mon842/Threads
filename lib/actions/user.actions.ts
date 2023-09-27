"use server"

import { revalidatePath } from "next/cache";
import User from "../models/user.model";
import { connectToDB } from "../mongoose"
import Thread from "../models/thread.model";

interface Params {
  userId: string;
  username: string;
  name: string;
  bio: string;
  image: string;
  path: string;
}
  
export async function fetchUser(userId: string){
  try {
    connectToDB();
    const res= await User.findOne({id: userId});
    return res;

  } catch (error:any) {
    throw new Error(`Failed to create/update user: ${error.message}`);
  }
}

export async function updateUser({
    userId,
    bio,
    name,
    path,
    username,
    image,
  }: Params): Promise<void> {
    try {
      connectToDB();
  
      await User.findOneAndUpdate(
        { id: userId },
        {
          username: username.toLowerCase(),
          name,
          bio,
          image,
          onboarded: true,
        },
        { upsert: true }
      );
  
      if (path === "/profile/edit") {
        revalidatePath(path);
      }
    } catch (error: any) {
        
      throw new Error(`Failed to create/update user: ${error.message}`);
  }
}

export async function fetchUserPosts(userId: string) {
  connectToDB();
  try {
      const threads= await User.findOne({id:userId})
      .populate({
        path: 'threads',
        model: Thread,
        populate:{
          path: 'children',
          model: Thread,
          populate:{
            path: 'author',
            model: User,
            select: 'image id name'
          }
        }
      })
      return threads
      
  } catch (err) {
      console.error("Error while adding comment:", err);
      throw new Error("Unable to add comment");
  }
}
// export async function updateUser({
//     userId,
//     bio,
//     name,
//     path,
//     username,
//     image,
//   }: Params): Promise<void> {


    
//     try {
//         connectToDB();


//         await User.findByIdAndUpdate(
//             { id: userId },
//             {
//                 username: username.toLowerCase(),
//                 name,
//                 bio,
//                 image,
//                 onboarded: true,
//             },
//             { upsert: true }
//         );
//         if (path === "/profile/edit") {
//             revalidatePath(path);
//         }
//     } catch (error: any) {
//         console.log(error);
        
//         throw new Error(`Failed to create/update user: ${error.message}`);
//     }
// }