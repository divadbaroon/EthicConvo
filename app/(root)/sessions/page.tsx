"use client"

import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link, Copy, Trash2, ChevronDown, Users } from "lucide-react";
import { useRouter } from 'next/navigation';
import { useUser } from "@clerk/nextjs";
import type { Session } from '@/types';
import { getSessionsByUser } from '@/lib/actions/session.actions';
import { supabaseClient } from '@/lib/database/supabase/client';

export default function GroupDiscussions() {
  const { user } = useUser();
  const router = useRouter();
  const [discussions, setDiscussions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.id) return;

    const fetchDiscussions = async () => {
      try {
        // Use server action for initial fetch
        const response = await getSessionsByUser(user.id);
        setDiscussions(response || []);
      } catch (error) {
        console.error("Error fetching discussions:", error);
      } finally {
        setLoading(false);
      }
    };

    // Set up real-time subscription for updates
    const channel = supabaseClient
      .channel(`user-${user.id}-sessions`)
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'sessions',
          filter: `created_by=eq.${user.id}`
        }, 
        () => {
          // Refetch using server action when data changes
          fetchDiscussions();
        }
      )
      .subscribe();

    fetchDiscussions();

    return () => {
      channel.unsubscribe();
    };
  }, [user?.id]);

  const handleNewDiscussionClick = () => {
    router.push('/sessions/create');
  };

  const handleTitleClick = (id: string) => {
    router.push(`/sessions/${id}`);
  };

  const abbreviateDescription = (description?: string | null, maxLength: number = 194) => {
    if (!description) return '';
    if (description.length > maxLength) {
      return description.substring(0, maxLength) + '...';
    }
    return description;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-48">
        <p>Loading discussion data...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-4">Group Discussions</h1>
        <p className="text-lg mb-8">
          Create, manage, and analyze dynamic group discussions to enhance instructor and student engagement and comprehension.
        </p>
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center space-x-2">
            <Button variant="outline">
              FILTER <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
            <Button variant="outline">
              SORT BY <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </div>
          <Button 
            className="bg-blue-500 hover:bg-blue-600 text-white"
            onClick={handleNewDiscussionClick}  
          >
            NEW GROUP DISCUSSION
          </Button>
        </div>

        <div className="space-y-6">
          {discussions.length > 0 ? (
            discussions.map((discussion) => (
              <Card key={discussion.id} className="overflow-hidden">
                <CardContent className="p-0">
                  <div className="flex">
                    <div className="w-1/5 p-4 bg-gray-100 flex flex-col justify-center items-center">
                      <Users className="h-8 w-8 text-blue-500 mb-2" />
                      <div className="text-lg font-bold">
                        {discussion.groups?.length || 0} groups
                      </div>
                      <div className="text-sm">
                        {discussion.participant_count || 0} participants
                      </div>
                    </div>
                    <div className="w-4/5 p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 
                            className="text-lg font-semibold text-blue-500 cursor-pointer"
                            onClick={() => handleTitleClick(discussion.id)} 
                          >
                            {discussion.title}
                            {discussion.status === 'active' && (
                              <span className="ml-2 inline-flex items-center space-x-1">
                                <span className="bg-green-100 text-green-700 text-xs font-semibold px-2 py-1 rounded-full">
                                  Live
                                </span>
                              </span>
                            )}
                          </h3>
                          <p className="text-sm text-gray-600 mt-1">
                            {abbreviateDescription(discussion.task)}
                          </p>
                        </div>
                        <div className="flex space-x-2">
                          <Button variant="ghost" size="icon">
                            <Link className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon">
                            <Copy className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      <div className="text-right text-xs text-gray-400 mt-2">
                        Created on {new Date(discussion.created_at).toLocaleString()}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center p-8 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
              <Users className="h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-1">No discussions yet</h3>
              <p className="text-gray-500 mb-4">Get started by creating your first group discussion</p>
              <Button 
                onClick={handleNewDiscussionClick}
                className="bg-blue-500 hover:bg-blue-600 text-white"
              >
                Create Discussion
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}