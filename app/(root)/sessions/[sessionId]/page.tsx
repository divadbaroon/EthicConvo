"use client"

import React, { useState, useEffect } from 'react'
import { usePathname, useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { ClipboardCopy, Users, Play, Check, BarChart2, Square } from "lucide-react"

import { Session, SessionPageProps } from "@/types"

import { getSessionById, updateSession } from '@/lib/actions/session.actions';

import { supabaseClient } from '@/lib/database/supabase/client'

export default function SessionPage({ params }: SessionPageProps) {
    const router = useRouter();
    const sessionId = params.sessionId;
    const [sessionData, setSessionData] = useState<Session | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [inviteLink, setInviteLink] = useState<string | null>(null);
    const [copied, setCopied] = useState(false);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [recentActivity, setRecentActivity] = useState({
        recentJoins: 0,
        recentGroups: 0,
        changeType: null as 'added' | 'removed' | null
    });

    // Initial data fetch
    useEffect(() => {
        if (!sessionId) {
            setError("No session ID provided");
            setLoading(false);
            return;
        }

        const fetchSessionData = async () => {
            try {
                console.log("Fetching session data for ID:", sessionId);
                const session = await getSessionById(sessionId);
                
                if (!session) {
                    setError("Session not found");
                    setSessionData(null);
                } else {
                    console.log("Session data received:", session);
                    setSessionData(session);
                    setError(null);
                }
            } catch (error) {
                console.error("Error fetching session:", error);
                setError("Failed to load session data");
                setSessionData(null);
            } finally {
                setLoading(false);
            }
        };

        fetchSessionData();
    }, [sessionId]);

    // Set up real-time subscriptions
    useEffect(() => {
        if (!sessionId) return;

        // Subscribe to session changes
        const sessionSubscription = supabaseClient
            .channel('session_changes')
            .on(
                'postgres_changes',
                {
                    event: '*',
                    schema: 'public',
                    table: 'sessions',
                    filter: `id=eq.${sessionId}`
                },
                async (payload) => {
                    const newData = payload.new as Session
                    setSessionData(prevData => {
                        if (!prevData) return newData;
                        
                        // Track recent changes
                        const newRecentJoins = newData.participant_count - prevData.participant_count;
                        
                        if (newRecentJoins > 0) {
                            setRecentActivity(prev => ({
                                ...prev,
                                recentJoins: newRecentJoins
                            }));

                            // Reset recent joins after 5 seconds
                            setTimeout(() => {
                                setRecentActivity(prev => ({
                                    ...prev,
                                    recentJoins: 0
                                }));
                            }, 5000);
                        }

                        return newData;
                    });
                }
            )
            .subscribe();

        // Subscribe to groups changes
        const groupsSubscription = supabaseClient
            .channel('group_changes')
            .on(
                'postgres_changes',
                {
                    event: '*',
                    schema: 'public',
                    table: 'groups',
                    filter: `session_id=eq.${sessionId}`
                },
                async () => {
                    // Fetch updated session data with groups
                    const { data } = await supabaseClient
                        .from('sessions')
                        .select(`
                            *,
                            groups (*)
                        `)
                        .eq('id', sessionId)
                        .single();

                        if (data) {
                            setSessionData(prevData => {
                                if (!prevData) return data as Session; 
                        
                                const typedData = data as Session;  
                                const newRecentGroups = 
                                    (typedData.groups?.length || 0) - (prevData.groups?.length || 0);
                        
                                if (newRecentGroups !== 0) {
                                    setRecentActivity(prev => ({
                                        ...prev,
                                        recentGroups: Math.abs(newRecentGroups),
                                        changeType: newRecentGroups > 0 ? 'added' : 'removed'
                                    }));
                        
                                    setTimeout(() => {
                                        setRecentActivity(prev => ({
                                            ...prev,
                                            recentGroups: 0,
                                            changeType: null
                                        }));
                                    }, 5000);
                                }
                        
                                return typedData;  
                            });
                        }
                }
            )
            .subscribe();

        // Cleanup subscriptions
        return () => {
            sessionSubscription.unsubscribe();
            groupsSubscription.unsubscribe();
        };
    }, [sessionId]);

    // Loading state
    if (loading) {
    return (
        <div className="container mx-auto px-4 py-8">
        <div className="max-w-5xl mx-auto">
            <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3 mb-8"></div>
            {/* Add more skeleton UI elements */}
            </div>
        </div>
        </div>
    );
    }

    // Error state
    if (error) {
    return (
        <div className="container mx-auto px-4 py-8">
        <div className="max-w-5xl mx-auto text-center">
            <h1 className="text-2xl font-bold text-red-500 mb-4">Error</h1>
            <p className="text-gray-600 mb-4">{error}</p>
            <Button onClick={() => router.push('/sessions')}>
            Back to Sessions
            </Button>
        </div>
        </div>
    );
    }

    // No data state
    if (!sessionData) {
    return (
        <div className="container mx-auto px-4 py-8">
        <div className="max-w-5xl mx-auto text-center">
            <h1 className="text-2xl font-bold mb-4">Session Not Found</h1>
            <p className="text-gray-600 mb-4">The requested session could not be found.</p>
            <Button onClick={() => router.push('/sessions')}>
            Back to Sessions
            </Button>
        </div>
        </div>
    );
    }

    const handleLaunchSession = async () => {
    if (sessionData) {
        try {
        const updatedSession = await updateSession(sessionData.id, {
            status: 'active'
        });
        if (updatedSession) {
            setSessionData(updatedSession);
            console.log("Session launched successfully");
        } else {
            console.error("Failed to update session status");
        }
        } catch (error) {
        console.error("Error launching session:", error);
        }
    }
    setIsDialogOpen(false);
    };

    const handleEndSession = async () => {
        if (sessionData) {
            try {
                const updatedSession = await updateSession(sessionData.id, {
                    status: 'completed'
                });
                if (updatedSession) {
                    setSessionData(updatedSession);
                    console.log("Session ended successfully");
                } else {
                    console.error("Failed to update session status");
                }
            } catch (error) {
                console.error("Error ending session:", error);
            }
        }
        setIsDialogOpen(false);
    };

    const generateInviteLink = () => {
    if (sessionData) {
        // Use session ID instead of number
        const link = `${window.location.origin}/join/${sessionData.id}`;
        setInviteLink(link);
    }
    };

    const copyToClipboard = async () => {
    if (inviteLink) {
        try {
            await navigator.clipboard.writeText(inviteLink);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000); 
        } catch (err) {
            console.error('Failed to copy: ', err);
        }
    }
    };

    const handleViewFullDashboard = () => {
    router.push(`${window.location.origin}/monitor/${sessionData.id}`);
    };

    const formatTimeLeft = (timeLeftInSeconds: number | null): string => {
    if (timeLeftInSeconds === null || timeLeftInSeconds === undefined) {
        return 'Duration not set';
    }
    const minutes = Math.ceil(timeLeftInSeconds / 60);
    return `${minutes} minute${minutes !== 1 ? 's' : ''}`;
    };

    const handleLaunchClick = () => {
    setIsDialogOpen(true); 
    };

    const handleActionClick = () => {
        setIsDialogOpen(true);
    };


    if (!sessionData) {
    return <div className="container mx-auto px-4 py-8 flex justify-center items-center h-screen">Loading...</div>;  
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="max-w-5xl mx-auto">
                <h1 className="text-4xl font-bold mb-4">{sessionData.title}</h1>
                <p className="text-lg text-muted-foreground mb-8">Manage and prepare your session</p>
                
                <Tabs defaultValue="details" className="w-full">
                    <TabsList className="grid w-full grid-cols-3 mb-8">
                        <TabsTrigger value="details">1. Review Details</TabsTrigger>
                        <TabsTrigger value="invite">2. Invite Participants</TabsTrigger>
                        <TabsTrigger value="monitor" disabled={sessionData?.status !== 'active' && sessionData?.status !== 'completed'}>4. Monitor</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="details">
                        <Card>
                            <CardHeader>
                                <CardTitle>Session Details</CardTitle>
                                <CardDescription>Review and prepare for your session</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-6">
                                    <div>
                                        <h2 className="text-xl font-semibold mb-2">Task</h2>
                                        <p className="text-muted-foreground">{sessionData.task}</p>
                                    </div>
                                    <div>
                                        <h2 className="text-xl font-semibold mb-2">Scenario</h2>
                                        <p className="text-muted-foreground">{sessionData.scenario}</p>
                                    </div>
                                    <div>
                                        <h2 className="text-xl font-semibold mb-2">Discussion Points</h2>
                                        <ul className="list-disc pl-5 space-y-1">
                                            {sessionData.discussion_points.map((point, index) => (
                                                <li key={index} className="text-muted-foreground">{point}</li>
                                            ))}
                                        </ul>
                                    </div>
                                    <div>
                                        <h2 className="text-xl font-semibold mb-2">Session Duration</h2>
                                        <p className="text-muted-foreground">{formatTimeLeft(sessionData.time_left ?? null)}</p>
                                    </div>
                                </div>
                                <div className="flex justify-end mt-6">
                                    <Button>Edit</Button>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>
                    
                    <TabsContent value="invite">
                        <Card>
                            <CardHeader>
                                <CardTitle>Invite Participants</CardTitle>
                                <CardDescription>Generate and share the session link</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <ol className="list-decimal list-inside mb-6 space-y-2">
                                    <li>Click the &quot;Generate Invite Link&quot; button below</li>
                                    <li>Copy the generated link to your clipboard</li>
                                    <li>Share the link with your participants</li>
                                </ol>
                                <div className="flex flex-col space-y-4">
                                    <Button onClick={generateInviteLink} className="w-full sm:w-auto">
                                        Generate Invite Link
                                        <ClipboardCopy className="ml-2 h-4 w-4" />
                                    </Button>
                                    {inviteLink && (
                                        <div className="flex items-center space-x-2">
                                            <input
                                                type="text"
                                                value={inviteLink}
                                                readOnly
                                                className="flex-grow p-2 border rounded"
                                            />
                                            <Button onClick={copyToClipboard}>
                                                {copied ? <Check className="h-4 w-4" /> : <ClipboardCopy className="h-4 w-4" />}
                                            </Button>
                                        </div>
                                    )}
                                </div>
                                <p className="text-sm text-muted-foreground mt-4">
                                    Note: The generated link will be valid for 24 hours.
                                </p>
                            </CardContent>
                        </Card>
                    </TabsContent>
                    
                    <TabsContent value="start">
                        <Card>
                            <CardHeader>
                                <CardTitle>
                                    {sessionData?.status === 'active' ? 'End Your Session' : 'Launch Your Session'}
                                </CardTitle>
                                <CardDescription>
                                    {sessionData?.status === 'active' 
                                        ? 'Review progress and end when ready' 
                                        : 'Review status and start when ready'}
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="grid gap-4 md:grid-cols-3 mb-6">
                                    <Card>
                                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                            <CardTitle className="text-sm font-medium">Participants Ready</CardTitle>
                                            <Users className="h-4 w-4 text-muted-foreground" />
                                        </CardHeader>
                                        <CardContent>
                                            <div className="text-2xl font-bold">{sessionData.participant_count}</div>
                                            <p className="text-xs text-muted-foreground">
                                                {recentActivity.recentJoins > 0 
                                                    ? `${recentActivity.recentJoins} joined recently`
                                                    : 'No recent joins'}
                                            </p>
                                        </CardContent>
                                    </Card>
                                    <Card>
                                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                            <CardTitle className="text-sm font-medium">Groups Formed</CardTitle>
                                            <Users className="h-4 w-4 text-muted-foreground" />
                                        </CardHeader>
                                        <CardContent>
                                            <div className="text-2xl font-bold">
                                                {sessionData.groups?.length || 0}
                                            </div>
                                            <p className="text-xs text-muted-foreground">
                                                {recentActivity.recentGroups > 0 
                                                    ? `${recentActivity.recentGroups} ${recentActivity.changeType === 'added' ? 'created' : 'removed'} recently`
                                                    : sessionData.groups && sessionData.groups.length > 0 
                                                    ? `${sessionData.groups.length} total groups`
                                                    : 'No groups created yet'}
                                            </p>
                                        </CardContent>
                                    </Card>
                                    <Card>
                                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                            <CardTitle className="text-sm font-medium">Session Duration</CardTitle>
                                            <Users className="h-4 w-4 text-muted-foreground" />
                                        </CardHeader>
                                        <CardContent>
                                            <div className="text-2xl font-bold">{formatTimeLeft(sessionData.time_left ?? null)}</div>
                                            <p className="text-xs text-muted-foreground">Editable in Details tab</p>
                                        </CardContent>
                                    </Card>
                                </div>
                                {sessionData.status === 'completed' ? (
                                    <p className="text-center text-muted-foreground">Session is concluded</p>
                                ) : (
                                    <>
                                        <p className="mb-4 text-muted-foreground">
                                            {sessionData.status === 'active' 
                                                ? 'Click below to end the session and conclude the discussion.'
                                                : 'Click below to start the timer and begin the discussion.'}
                                        </p>
                                        <Button 
                                            className={`w-full ${sessionData.status === 'active' ? 'bg-red-600 hover:bg-red-700' : ''}`} 
                                            onClick={handleActionClick}
                                        >
                                            {sessionData.status === 'active' ? (
                                                <>
                                                    End Session
                                                    <Square className="ml-2 h-4 w-4" />
                                                </>
                                            ) : (
                                                <>
                                                    Launch Session
                                                    <Play className="ml-2 h-4 w-4" />
                                                </>
                                            )}
                                        </Button>
                                    </>
                                )}
                            </CardContent>
                        </Card>
                    </TabsContent>
    
                    <TabsContent value="monitor">
                        <Card>
                            <CardHeader>
                                <CardTitle>Session Overview</CardTitle>
                                <CardDescription>Quick insights into your session</CardDescription>
                            </CardHeader>
                            <CardContent>
                                {sessionData?.status === 'active' || sessionData?.status === 'completed' ? (
                                    <>
                                        <div className="grid grid-cols-3 gap-4 mb-6">
                                            <Card>
                                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                                    <CardTitle className="text-sm font-medium">Active Participants</CardTitle>
                                                    <Users className="h-4 w-4 text-muted-foreground" />
                                                </CardHeader>
                                                <CardContent>
                                                    <div className="text-2xl font-bold">{sessionData.participant_count}</div>
                                                </CardContent>
                                            </Card>
                                            <Card>
                                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                                    <CardTitle className="text-sm font-medium">Avg. Participation Rate</CardTitle>
                                                    <BarChart2 className="h-4 w-4 text-muted-foreground" />
                                                </CardHeader>
                                                <CardContent>
                                                    <div className="text-2xl font-bold">85%</div>
                                                </CardContent>
                                            </Card>
                                            <Card>
                                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                                    <CardTitle className="text-sm font-medium">Avg. Topic Coverage</CardTitle>
                                                    <BarChart2 className="h-4 w-4 text-muted-foreground" />
                                                </CardHeader>
                                                <CardContent>
                                                    <div className="text-2xl font-bold">60%</div>
                                                </CardContent>
                                            </Card>
                                        </div>
                                        <Button className="w-full" onClick={handleViewFullDashboard}>
                                            View Full Dashboard
                                        </Button>
                                    </>
                                ) : (
                                    <p>Launch the session to access monitoring features.</p>
                                )}
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
    
                <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>
                                {sessionData?.status === 'active' ? 'Confirm End Session' : 'Confirm Session Launch'}
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                                {sessionData?.status === 'active' 
                                    ? 'This will end the session and conclude all group discussions. This action cannot be undone.'
                                    : 'This will start the session and release participants into their groups. Session details cannot be changed after launch.'}
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel onClick={() => setIsDialogOpen(false)}>Cancel</AlertDialogCancel>
                            <AlertDialogAction 
                                onClick={sessionData?.status === 'active' ? handleEndSession : handleLaunchSession}
                                className={sessionData?.status === 'active' ? 'bg-red-600 hover:bg-red-700' : ''}
                            >
                                {sessionData?.status === 'active' ? 'End' : 'Launch'}
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </div>
        </div>
    );
}