"use server"

import { supabaseAdmin } from "@/lib/database/supabase/admin"
import type { Group, CreateGroupParams } from "@/types"

export async function createGroup(groupData: CreateGroupParams) {
    try {
      const { data, error } = await supabaseAdmin
        .from('groups')
        .insert({
          number: groupData.number,
          session_id: groupData.session_id,
          max_occupancy: groupData.max_occupancy,
          name: groupData.name || `Group ${groupData.number}`,
          current_occupancy: 0,
          user_list: []
        })
        .select()
        .single();
  
      if (error) throw error;
      return data as Group;
    } catch (error) {
      console.error("Error creating group:", error);
      throw error;
    }
  }

  export async function joinGroup(groupId: string, userId: string) {
    try {
      // First get current group data
      const { data: group, error: fetchError } = await supabaseAdmin
        .from('groups')
        .select('*')
        .eq('id', groupId)
        .single();
  
      if (fetchError) throw fetchError;
      
      const typedGroup = group as Group;
  
      // Simple capacity check
      if (typedGroup.current_occupancy >= typedGroup.max_occupancy) {
        throw new Error("Group is full");
      }
  
      // If group has capacity, proceed with join
      const { data: updatedGroup, error: updateError } = await supabaseAdmin
        .from('groups')
        .update({
          current_occupancy: typedGroup.current_occupancy + 1,
          user_list: [...(typedGroup.user_list || []), userId]
        })
        .eq('id', groupId)
        .select()
        .single();
  
      if (updateError) throw updateError;
      return updatedGroup as Group;
  
    } catch (error) {
      console.error("Error joining group:", error);
      // Specifically check for the full group error
      if (error instanceof Error && error.message === "Group is full") {
        throw error; // Propagate this specific error to trigger page refresh
      }
      throw new Error("Failed to join group");
    }
  }

export async function addUserToGroup(groupId: string, userId: string) {
    try {
      // First get the current group data
      const { data: group, error: fetchError } = await supabaseAdmin
        .from('groups')
        .select('*')
        .eq('id', groupId)
        .single();
  
      if (fetchError) throw fetchError;
  
      const typedGroup = group as Group;
  
      // Check if group is full
      if (typedGroup.current_occupancy >= typedGroup.max_occupancy) {
        throw new Error("Group is full");
      }
  
      // Check if user is already in group
      if (typedGroup.user_list.includes(userId)) {
        throw new Error("User is already in this group");
      }
  
      // Add user to group
      const { data, error } = await supabaseAdmin
        .from('groups')
        .update({
          user_list: [...typedGroup.user_list, userId],
          current_occupancy: typedGroup.current_occupancy + 1,
          name: typedGroup.name 
        })
        .eq('id', groupId)
        .select()
        .single();
  
      if (error) throw error;
      return data as Group;
    } catch (error) {
      console.error("Error adding user to group:", error);
      throw error;
    }
  }
  
  export async function removeUserFromGroup(groupId: string, userId: string) {
    try {
      const { data: group, error: fetchError } = await supabaseAdmin
        .from('groups')
        .select('*')
        .eq('id', groupId)
        .single();
  
      if (fetchError) throw fetchError;
  
      const typedGroup = group as Group;
  
      // Check if user is in group
      if (!typedGroup.user_list.includes(userId)) {
        throw new Error("User is not in this group");
      }
  
      // Remove user from group
      const { data, error } = await supabaseAdmin
        .from('groups')
        .update({
          user_list: typedGroup.user_list.filter(id => id !== userId),
          current_occupancy: Math.max(0, typedGroup.current_occupancy - 1),
          name: typedGroup.name 
        })
        .eq('id', groupId)
        .select()
        .single();
  
      if (error) throw error;
      return data as Group;
    } catch (error) {
      console.error("Error removing user from group:", error);
      throw error;
    }
  }
  
// Add a function to get group details
export async function getGroupDetails(groupId: string) {
  try {
    const { data, error } = await supabaseAdmin
      .from('groups')
      .select(`
        *,
        sessions (
          title,
          status
        )
      `)
      .eq('id', groupId)
      .single();

    if (error) throw error;
    return data as Group & { sessions: { title: string; status: string } };
  } catch (error) {
    console.error("Error fetching group details:", error);
    throw error;
  }
}

