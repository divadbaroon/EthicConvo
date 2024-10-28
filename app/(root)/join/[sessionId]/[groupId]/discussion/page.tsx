"use client"

import React, { useState, useEffect } from 'react';
import ChatWindow from '@/components/discussion/ChatWindow'
import DiscussionGuide from '@/components/discussion/DiscussionGuide'
import { getSessionById } from "@/lib/actions/session.actions";

import type { Session, DiscussionProps } from '@/types';

function Discussion({ params }: DiscussionProps) {
    const [session, setSession] = useState<Session | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchSession = async () => {
            try {
                if (!params.sessionId) {
                    setError("No session ID provided");
                    return;
                }

                const fetchedSession = await getSessionById(params.sessionId);
                if (!fetchedSession) {
                    setError("Session not found");
                    return;
                }

                setSession(fetchedSession);
            } catch (error) {
                console.error("Error fetching session:", error);
                setError("Failed to fetch session data");
            } finally {
                setLoading(false);
            }
        };

        fetchSession();
    }, [params.sessionId]);

    if (loading) {
        return (
            <div className="h-screen w-full flex items-center justify-center">
                <div className="w-16 h-16 border-t-4 border-blue-500 border-solid rounded-full animate-spin" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="h-screen w-full flex flex-col items-center justify-center">
                <div className="text-red-500 text-xl mb-4">{error}</div>
            </div>
        );
    }

    return (
        <div className="flex h-screen">
            <div className="flex-1 p-4 overflow-hidden">
                <DiscussionGuide session={session} mode={"discussion"}/>
            </div>
            <div className="flex-1 p-4 overflow-hidden">
                <ChatWindow groupId={params.groupId} sessionId={params.sessionId} />
            </div>
        </div>
    )
}

export default Discussion;