"use client"

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import DiscussionGuide from '@/components/discussion/DiscussionGuide';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";
import { getSessionById } from "@/lib/actions/session.actions";
import { supabaseClient } from '@/lib/database/supabase/client';
import type { Session, WaitingRoomProps } from '@/types';

export default function WaitingRoom({ params }: WaitingRoomProps) {
  const [session, setSession] = useState<Session | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (!params.sessionId) {
      setError("No session ID provided");
      setLoading(false);
      return;
    }

    const fetchSession = async () => {
      try {
        const fetchedSession = await getSessionById(params.sessionId);
        if (!fetchedSession) {
          setError("Session not found");
          return;
        }

        setSession(fetchedSession);

        // If session is already active, redirect to discussion
        if (fetchedSession.status === 'active') {
          router.push(`/join/${params.sessionId}/${params.groupId}/discussion`);
        }
      } catch (error) {
        console.error("Error fetching session:", error);
        setError("Failed to fetch session data");
      } finally {
        setLoading(false);
      }
    };

    // Set up real-time subscription
    const channel = supabaseClient
      .channel(`session-${params.sessionId}`)
      .on('postgres_changes', 
        { 
          event: 'UPDATE', 
          schema: 'public', 
          table: 'sessions',
          filter: `id=eq.${params.sessionId}`
        }, 
        (payload) => {
          const updatedSession = payload.new as Session;
          setSession(updatedSession);
          
          // Check if session became active
          if (updatedSession.status === 'active') {
            toast.success("Discussion is starting!");
            router.push(`/discussion/${params.sessionId}/${params.groupId}`);
          }
        }
      )
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          console.log('Subscribed to session updates');
        }
      });

    fetchSession();

    // Cleanup subscription
    return () => {
      channel.unsubscribe();
    };
  }, [params.sessionId, params.groupId, router]);

  if (loading) {
    return (
      <div className="h-[77vh] w-full flex items-center justify-center">
        <div className="w-16 h-16 border-t-4 border-blue-500 border-solid rounded-full animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-[77vh] w-full flex flex-col items-center justify-center">
        <div className="text-red-500 text-xl mb-4">{error}</div>
        <button 
          onClick={() => router.push('/')}
          className="text-blue-500 hover:underline"
        >
          Return Home
        </button>
      </div>
    ); 
  }

  return (
    <div className="h-[77vh] w-full flex flex-col">
      <div className="p-4">
        <Card className="w-full">
          <CardHeader>
            <CardDescription className="text-center text-lg">
              The instructor will start the discussion soon. Please review the Discussion Guide below.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>

      <div className="flex flex-1">
        <div className="flex-1 p-4 overflow-hidden">
          <Card className="h-full">
            <CardContent className="h-full p-0">
              <ScrollArea className="h-full px-0">
                <DiscussionGuide session={session} mode={"waiting-room"}/>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>

        <div className="flex-1 p-4 overflow-hidden">
          <Card className="h-full flex flex-col items-center justify-center">
            <CardContent className="flex flex-col items-center justify-center h-full -mt-10">
              <div className="w-16 h-16 border-t-4 border-blue-500 border-solid rounded-full animate-spin mb-4" />
              <p className="text-lg text-center mb-2">
                Waiting for the instructor to start the discussion...
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}