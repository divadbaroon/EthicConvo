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
import { ClipboardCopy, Users, Play, Check, BarChart2 } from "lucide-react"

import { Session, SessionPageProps } from "@/types"

import { getSessionById, updateSession } from '@/lib/actions/session.actions';

export default function SessionPage({ params }: SessionPageProps) {
    const router = useRouter();
    const sessionId = params.sessionId;
    console.log(sessionId)
    const [sessionData, setSessionData] = useState<Session | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [inviteLink, setInviteLink] = useState<string | null>(null);
    const [copied, setCopied] = useState(false);
    const [isDialogOpen, setIsDialogOpen] = useState(false);

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
    router.push(`/session-dashboard/${sessionId}`);
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

    if (!sessionData) {
    return <div className="container mx-auto px-4 py-8 flex justify-center items-center h-screen">Loading...</div>;  
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="max-w-5xl mx-auto">
                <h1 className="text-4xl font-bold mb-4">{sessionData.title}</h1>
                <p className="text-lg text-muted-foreground mb-8">Manage and prepare your session</p>
                
                <Tabs defaultValue="details" className="w-full">
                    <TabsList className="grid w-full grid-cols-4 mb-8">
                        <TabsTrigger value="details">1. Review Details</TabsTrigger>
                        <TabsTrigger value="invite">2. Invite Participants</TabsTrigger>
                        <TabsTrigger value="start">3. Launch Session</TabsTrigger>
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
                                <CardTitle>Launch Your Session</CardTitle>
                                <CardDescription>Review status and start when ready</CardDescription>
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
                                            <p className="text-xs text-muted-foreground">2 joined recently</p>
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
                                                {sessionData.groups && sessionData.groups.length > 0 
                                                    ? `${sessionData.groups.length} created recently`
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
                                            Click below to start the timer and begin the discussion.
                                        </p>
                                        <Button className="w-full" onClick={handleLaunchClick}>
                                            Launch Session
                                            <Play className="ml-2 h-4 w-4" />
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
                                {sessionData?.status === 'active' || sessionData?.status === 'completed'?  (
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
                            <AlertDialogTitle>Confirm Session Launch</AlertDialogTitle>
                            <AlertDialogDescription>
                                This will start the session and release participants into their groups. Session details cannot be changed after launch.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel onClick={() => setIsDialogOpen(false)}>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={handleLaunchSession}>Launch</AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </div>
        </div>
    )
}