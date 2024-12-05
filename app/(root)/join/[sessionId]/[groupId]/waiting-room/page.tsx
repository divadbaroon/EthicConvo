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
  const [isTransitioning, setIsTransitioning] = useState(false);
  const router = useRouter();

  const checkSessionStatus = async () => {
    if (!params.sessionId || isTransitioning) return;

    try {
      const fetchedSession = await getSessionById(params.sessionId);
      if (!fetchedSession) {
        setError("Session not found");
        return;
      }

      setSession(fetchedSession);

      if (fetchedSession.status === 'active') {
        setIsTransitioning(true);
        toast.success("Discussion is starting!");
        router.replace(`/join/${params.sessionId}/${params.groupId}/discussion`);
      }
    } catch (error) {
      console.error("Error checking session status:", error);
    }
  };

  useEffect(() => {
    if (!params.sessionId) {
      setError("No session ID provided");
      setLoading(false);
      return;
    }

    // Initial check
    checkSessionStatus();
    setLoading(false);

    // Set up polling every 5 seconds
    const intervalId = setInterval(checkSessionStatus, 5000);

    // Cleanup interval on unmount
    return () => clearInterval(intervalId);
  }, [params.sessionId, params.groupId]);

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
                <DiscussionGuide session={session} mode="waiting-room" groupId={params.groupId}/>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>

        <div className="flex-1 p-4 overflow-hidden">
          <Card className="h-full flex flex-col items-center justify-center">
            <CardContent className="flex flex-col items-center justify-center h-full -mt-10">
              <div className="w-16 h-16 border-t-4 border-blue-500 border-solid rounded-full animate-spin mb-4" />
              <p className="text-lg text-center mb-2">
                {isTransitioning 
                  ? "Joining discussion..."
                  : "Waiting for the instructor to start the discussion..."}
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}