"use client"

import React, { useState, useEffect } from 'react'
import { usePathname, useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Search, Users } from "lucide-react"
import { toast } from "sonner"
import { getSessionById } from "@/lib/actions/session.actions"
import { joinGroup } from "@/lib/actions/group.actions"
import { useUser } from "@clerk/nextjs"
import { Session, Group } from "@/types"
import { supabaseClient } from '@/lib/database/supabase/client';

export default function GroupSelection({ 
  params 
}: { 
  params: { sessionId: string, groupId: string } 
}) {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const [sessionData, setSessionData] = useState<Session | null>(null);
  const [selectedGroup, setSelectedGroup] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isJoining, setIsJoining] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!params.sessionId) return;

    const fetchSessionData = async () => {
      try {
        const response = await getSessionById(params.sessionId);
        if (!response) {
          setError("Session not found");
          return;
        }
        setSessionData(response);
      } catch (error) {
        console.error("Error fetching session:", error);
        setError("Failed to load session");
      } finally {
        setLoading(false);
      }
    };

    // Set up real-time subscription for group updates
    const channel = supabaseClient
      .channel(`session-${params.sessionId}-groups`)
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'groups',
          filter: `session_id=eq.${params.sessionId}`
        }, 
        () => {
          fetchSessionData(); // Refresh data when groups change
        }
      )
      .subscribe();

    fetchSessionData();

    return () => {
      channel.unsubscribe();
    };
  }, [params.sessionId]);

  const handleGroupSelect = (groupId: string) => {
    setSelectedGroup(groupId);
  };

  const handleJoinGroup = async () => {
    if (!isLoaded || !user) {
      toast.error("You must be logged in to join a group");
      return;
    }

    if (!selectedGroup || !sessionData) {
      toast.error("Please select a group");
      return;
    }

    setIsJoining(true);
    try {
      const updatedGroup = await joinGroup(selectedGroup, user.id);
      if (updatedGroup) {
        toast.success("Successfully joined the group");
        router.push(`/join/${params.sessionId}/${params.groupId}/waiting-room`);
      } else {
        throw new Error("Failed to join group");
      }
    } catch (error) {
      console.error("Error joining group:", error);
      toast.error("Failed to join group. Please try again.");
    } finally {
      setIsJoining(false);
    }
  };

  const filteredGroups = sessionData?.groups?.filter(group =>
    group.number.toString().includes(searchTerm.trim()) &&
    group.current_occupancy < group.max_occupancy
  ) || [];

  if (loading) {
    return (
      <div className="container mx-auto p-4 max-w-4xl">
        <div className="animate-pulse">
          {/* Add skeleton UI here */}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-4 max-w-4xl text-center">
        <h1 className="text-2xl font-bold text-red-500 mb-4">Error</h1>
        <p className="mb-4">{error}</p>
        <Button onClick={() => router.push('/')}>Return Home</Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6 text-center mt-7">Select Your Group</h1>
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <Input
            type="text"
            placeholder="Search for a group..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 w-full"
          />
        </div>
      </div>
      {filteredGroups.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mb-6">
          {filteredGroups.map((group) => (
            <Card 
              key={group.id} 
              className={`cursor-pointer transition-all duration-200 transform hover:scale-105 ${
                group.current_occupancy >= group.max_occupancy 
                  ? 'opacity-50 cursor-not-allowed' 
                  : selectedGroup === group.id 
                    ? 'border-blue-500 border-2 shadow-lg' 
                    : 'hover:shadow-md'
              }`}
              onClick={() => group.current_occupancy < group.max_occupancy && handleGroupSelect(group.id)}
            >
              <CardContent className="p-4 text-center">
                <p className="font-bold text-lg mb-2">Group {group.number}</p>
                <div className="flex items-center justify-center space-x-2">
                  <Users size={18} />
                  <p className="text-sm">
                    {group.current_occupancy}/{group.max_occupancy}
                  </p>
                </div>
                {group.current_occupancy >= group.max_occupancy && (
                  <p className="text-xs text-red-500 mt-2">Full</p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <p className="text-gray-500">No available groups found</p>
        </div>
      )}
      <Button 
        onClick={handleJoinGroup} 
        disabled={selectedGroup === null || isJoining}
        className="w-full py-2 text-lg font-semibold transition-colors duration-200"
      >
        {isJoining ? 'Joining...' : selectedGroup ? 'Join Selected Group' : 'Select a Group'}
      </Button>
    </div>
  );
}