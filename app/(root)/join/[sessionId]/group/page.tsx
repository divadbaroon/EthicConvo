"use client"

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "sonner"
import { getSessionById } from "@/lib/actions/session.actions"
import { joinGroup } from "@/lib/actions/group.actions"
import { useUser } from "@clerk/nextjs"
import { Session } from "@/types"
import { supabaseClient } from '@/lib/database/supabase/client'
import { Loader2, Users } from 'lucide-react'

export default function GroupSelection({ params }: { params: { sessionId: string } }) {
  const { user, isLoaded } = useUser()
  const router = useRouter()
  const [sessionData, setSessionData] = useState<Session | null>(null)
  const [groupNumberInput, setGroupNumberInput] = useState('')
  const [isJoining, setIsJoining] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!params.sessionId) return

    const fetchSessionData = async () => {
      try {
        console.log('Fetching session data for:', params.sessionId)
        const response = await getSessionById(params.sessionId)
        if (!response) {
          setError("Session not found")
          return
        }
        console.log('Session data received:', response)
        setSessionData({ ...response, groups: response.groups || [] })
      } catch (error) {
        console.error("Error fetching session:", error)
        setError("Failed to load session")
      } finally {
        setLoading(false)
      }
    }

    const channel = supabaseClient
      .channel(`session-${params.sessionId}-groups`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'groups',
          filter: `session_id=eq.${params.sessionId}`,
        },
        (payload) => {
          console.log('Group update received:', payload)
          fetchSessionData()
        }
      )
      .subscribe()

    if (isLoaded) {
      if (!user) {
        console.log('No authenticated user found')
        toast.error("Please sign in to join a group")
      } else {
        console.log('Authenticated user:', user.id)
        fetchSessionData()
      }
    }

    return () => {
      channel.unsubscribe()
    }
  }, [params.sessionId, isLoaded, user])

  const handleJoinGroup = async () => {
    if (!isLoaded || !user) {
      toast.error("You must be logged in to join a group")
      return
    }

    if (!groupNumberInput || !sessionData || !sessionData.groups) {
      toast.error("Session data is not available")
      return
    }

    const groupToJoin = sessionData.groups.find(
      (group) => group.number === parseInt(groupNumberInput)
    )

    if (!groupToJoin) {
      toast.error("Group not found")
      return
    }

    if (groupToJoin.current_occupancy >= groupToJoin.max_occupancy) {
      toast.error("This group is full. Please choose another group")
      return
    }

    setIsJoining(true)
    try {
      const updatedGroup = await joinGroup(groupToJoin.id, user.id)

      if (updatedGroup) {
        toast.success("Successfully joined the group")
        router.push(`/join/${params.sessionId}/${groupToJoin.id}/discussion`)
      }
    } catch (error) {
      if (error instanceof Error && error.message === "Group is full") {
        toast.error("This group is full. Please choose another group")
        return
      }
      toast.error("Failed to join group. Please try again.")
    } finally {
      setIsJoining(false)
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto p-4 max-w-md h-screen flex items-center justify-center">
        <Card className="w-full">
          <CardContent className="p-6">
            <div className="flex flex-col items-center space-y-4">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="text-lg font-medium">Loading session data...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto p-4 max-w-md h-screen flex items-center justify-center">
        <Card className="w-full">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-red-500">Error</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <p className="mb-4 text-center">{error}</p>
            <Button onClick={() => router.push('/')} className="w-full">Return Home</Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
  <div className="container mx-auto p-4 max-w-2xl mt-5">      
    <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-center">Join Group</CardTitle>
          <CardDescription className="text-center">
            Enter your group number according to the breakout room number you are currently in
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          {isLoaded && !user && (
            <div className="mb-6 p-4 bg-yellow-100 text-yellow-800 rounded-lg text-center">
              Please sign in to join a group
            </div>
          )}
          <div className="space-y-6">
            <div className="relative">
              <Input
                type="number"
                placeholder="Enter your group number"
                value={groupNumberInput}
                onChange={(e) => setGroupNumberInput(e.target.value)}
                className="pl-10 py-6 text-center text-xl"
              />
              <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>
            <Button
              onClick={handleJoinGroup}
              disabled={!user || !groupNumberInput || isJoining}
              className="w-full py-6 text-lg font-semibold transition-colors duration-200"
            >
              {!user
                ? 'Please Sign In to Join'
                : isJoining
                ? 'Joining...'
                : 'Join Group'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

