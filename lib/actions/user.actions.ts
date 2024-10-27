"use server";

import { revalidatePath } from "next/cache";

import { User } from "../database/models/user.model";
import { connectToDatabase } from "../database/mongoose";
import { handleError } from "../utils";
import { CreateUserParams, UpdateUserParams, IUser } from "../../types";  

// CREATE
export async function createUser(user: CreateUserParams) {
  try {
    await connectToDatabase();

    const newUser = await User.create(user);

    return JSON.parse(JSON.stringify(newUser)) as IUser;
  } catch (error) {
    handleError(error);
  }
}

// READ
export async function getUserById(userId: string) {
  try {
    await connectToDatabase();

    const user = await User.findOne({ clerkId: userId });

    if (!user) throw new Error("User not found");

    return JSON.parse(JSON.stringify(user)) as IUser;
  } catch (error) {
    handleError(error);
  }
}

// UPDATE
export async function updateUser(username: string, user: UpdateUserParams) {
  try {
    await connectToDatabase();

    const updatedUser = await User.findOneAndUpdate({ username }, user, {
      new: true,
    });

    if (!updatedUser) throw new Error("User update failed");
    
    return JSON.parse(JSON.stringify(updatedUser)) as IUser;
  } catch (error) {
    handleError(error);
  }
}

// DELETE
export async function deleteUser(clerkId: string) {
  try {
    await connectToDatabase();

    // Find user to delete
    const userToDelete = await User.findOne({ clerkId });

    if (!userToDelete) {
      throw new Error("User not found");
    }

    // Delete user
    const deletedUser = await User.findByIdAndDelete(userToDelete._id);
    revalidatePath("/");

    return deletedUser ? JSON.parse(JSON.stringify(deletedUser)) as IUser: null;
  } catch (error) {
    handleError(error);
  }
}

// Function to get all users by sessionId
export async function getUsersBySessionId(sessionId: string) {
  try {
    await connectToDatabase();

    // Fetching all users associated with the given sessionId
    const users = await User.find({ sessionId });

    if (!users || users.length === 0) {
      throw new Error(`No users found for sessionId: ${sessionId}`);
    }

    return JSON.parse(JSON.stringify(users)) as IUser[];
  } catch (error) {
    handleError(error);
    return null;
  }
}

