"use server"

import { revalidatePath } from "next/cache"
import { supabaseAdmin } from "@/lib/database/supabase/admin"
import { CreateSessionParams, UpdateSessionParams, Session } from "@/types"

export async function createSession(sessionData: CreateSessionParams) {
  try {
    console.log("Creating session with data:", sessionData);

    // 1. Create session
    const { data: session, error: sessionError } = await supabaseAdmin
      .from('sessions')
      .insert({
        title: sessionData.title,
        task: sessionData.task,
        scenario: sessionData.scenario,
        discussion_points: sessionData.discussion_points,
        created_by: sessionData.created_by,
        time_left: sessionData.time_left,
        status: sessionData.status,
        end_date: sessionData.end_date.toISOString(),
        total_perspective_participants: sessionData.total_perspective_participants,
        preferred_group_size: sessionData.preferred_group_size,
        participant_count: 0
      })
      .select()
      .single();

    if (sessionError) {
      console.error("Session creation error:", sessionError);
      throw sessionError;
    }

    console.log("Session created successfully:", session);

    // 2. Create groups
    const numberOfGroups = Math.ceil(
      sessionData.total_perspective_participants / sessionData.preferred_group_size
    );

    const groups = Array.from({ length: numberOfGroups }, (_, i) => ({
      session_id: session.id,
      number: i + 1, // Ensure number is set
      name: `Group ${i + 1}`,
      max_occupancy: sessionData.preferred_group_size,
      current_occupancy: 0,
      user_list: []
    }));

    console.log("Creating groups:", groups);

    const { error: groupsError } = await supabaseAdmin
      .from('groups')
      .insert(groups);

    if (groupsError) {
      console.error("Groups creation error:", groupsError);
      throw groupsError;
    }

    console.log("Groups created successfully");

    // 3. Fetch complete session with groups
    const { data: completeSession, error: fetchError } = await supabaseAdmin
      .from('sessions')
      .select(`
        *,
        groups (*)
      `)
      .eq('id', session.id)
      .single();

    if (fetchError) {
      console.error("Error fetching complete session:", fetchError);
      throw fetchError;
    }

    console.log("Complete session fetched:", completeSession);
    return completeSession;

  } catch (error) {
    console.error("Error in createSession:", error);
    throw error;
  }
}

export async function getSessionsByUser(userId: string) {
  try {
    const { data, error } = await supabaseAdmin
      .from('sessions')
      .select(`
        *,
        groups (*)
      `)
      .eq('created_by', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;

    return data as Session[];
  } catch (error) {
    console.error("Error fetching sessions:", error);
    return [];
  }
}

export async function getSessionByNumber(sessionNumber: number) {
  try {
    const { data, error } = await supabaseAdmin
      .from('sessions')
      .select(`
        *,
        groups (*)
      `)
      .eq('number', sessionNumber)
      .single();

    if (error) throw error;
    return data as Session;
  } catch (error) {
    console.error("Error fetching session:", error);
    return null;
  }
}

export async function updateSessionByNumber(
  sessionNumber: number, 
  updates: UpdateSessionParams
) {
  try {
    const { data, error } = await supabaseAdmin
      .from('sessions')
      .update(updates)
      .eq('number', sessionNumber)
      .select(`
        *,
        groups (*)
      `)
      .single();

    if (error) throw error;
    return data as Session;
  } catch (error) {
    console.error("Error updating session:", error);
    return null;
  }
}

export async function deleteSession(sessionId: string) {
  try {
    const { data, error } = await supabaseAdmin
      .from('sessions')
      .delete()
      .eq('id', sessionId)
      .select()
      .single();

    if (error) throw error;
    revalidatePath("/sessions");
    return data as Session;
  } catch (error) {
    console.error("Error deleting session:", error);
    return null;
  }
}

export async function getSessionById(sessionId: string) {
  try {
    console.log("Fetching session with ID:", sessionId);

    const { data, error } = await supabaseAdmin
      .from('sessions')
      .select(`
        *,
        groups (*)
      `)
      .eq('id', sessionId)
      .single();

    if (error) {
      console.error("Database error:", error);
      throw error;
    }

    if (!data) {
      console.error("No session found with ID:", sessionId);
      return null;
    }

    console.log("Session data retrieved:", data);
    return data as Session;
  } catch (error) {
    console.error("Error in getSessionById:", error);
    return null;
  }
}

// Update the updateSession function to use ID instead of number
export async function updateSession(
  sessionId: string, 
  updates: Partial<Session>
) {
  try {
    const { data, error } = await supabaseAdmin
      .from('sessions')
      .update(updates)
      .eq('id', sessionId)
      .select(`
        *,
        groups (*)
      `)
      .single();

    if (error) throw error;
    return data as Session;
  } catch (error) {
    console.error("Error updating session:", error);
    return null;
  }
}