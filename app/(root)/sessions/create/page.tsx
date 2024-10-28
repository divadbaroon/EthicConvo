"use client"

import React from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { Upload, FileText, Eye, ArrowLeft, ArrowRight } from 'lucide-react'
import { Progress } from "@/components/ui/progress"

import { createSession } from '@/lib/actions/session.actions'
import { CreateSessionParams } from '@/types'
import { useUser } from "@clerk/nextjs"

import { redirect, useRouter } from 'next/navigation';

export default function CreateSessionPage() {
  const { user } = useUser();
  const router = useRouter();
  const [step, setStep] = React.useState(1)
  const [title, setTitle] = React.useState('')
  const [duration, setDuration] = React.useState('')
  const [totalPerspectiveParticipants, setTotalPerspectiveParticipants] = React.useState('')
  const [groupSize, setGroupSize] = React.useState('')
  const [scenario, setScenario] = React.useState('')
  const [discussionPoints, setDiscussionPoints] = React.useState(['', '', ''])
  const [task, setTask] = React.useState('')

  const handleNext = () => setStep(step + 1)
  const handlePrev = () => setStep(step - 1)

  const handleDiscussionPointChange = (index: number, value: string) => {
    const newPoints = [...discussionPoints]
    newPoints[index] = value
    setDiscussionPoints(newPoints)
  }

  const handleCreateSession = async () => {
    if (!user) {
      redirect('/sign-in');
      return;
    }
  
    const sessionData: CreateSessionParams = {
      title,
      task: task || null,
      scenario: scenario || null,
      discussion_points: discussionPoints.filter(point => point.trim() !== ''),
      created_by: user.id,
      time_left: parseInt(duration) * 60,
      status: 'waiting',
      end_date: new Date(Date.now() + parseInt(duration) * 60000),
      total_perspective_participants: parseInt(totalPerspectiveParticipants),
      preferred_group_size: parseInt(groupSize)
    };
  
    try {
      const newSession = await createSession(sessionData);
      console.log('Session created:', newSession);
      toast.success("Session created successfully");
      router.push(`/sessions/${newSession.id}`);
    } catch (error) {
      console.error('Error creating session:', error);
      toast.error("Error creating session");
    }
  };

  const renderStep1 = () => (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle>Basic Information</CardTitle>
        <CardDescription>Set the title and duration for your group discussion.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="title">Discussion Title</Label>
          <Input 
            id="title" 
            value={title} 
            onChange={(e) => setTitle(e.target.value)} 
            placeholder="e.g., Generative AI and Copyright" 
            className="w-full"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="duration">Duration (in minutes)</Label>
          <Input 
            id="duration" 
            type="number" 
            value={duration} 
            onChange={(e) => setDuration(e.target.value)} 
            placeholder="e.g., 10" 
            className="w-full"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="totalParticipants">Total Number of Participants</Label>
          <Input 
            id="totalParticipants" 
            type="number" 
            value={totalPerspectiveParticipants} 
            onChange={(e) => setTotalPerspectiveParticipants(e.target.value)} 
            placeholder="e.g., 30" 
            className="w-full"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="groupSize">Preferred Group Size</Label>
          <Input 
            id="groupSize" 
            type="number" 
            value={groupSize} 
            onChange={(e) => setGroupSize(e.target.value)} 
            placeholder="e.g., 5" 
            className="w-full"
          />
        </div>
      </CardContent>
    </Card>
  )

  const renderStep2 = () => (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle>Discussion Content</CardTitle>
        <CardDescription>Create or upload the content for your group discussion.</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="create" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="create">Create Content</TabsTrigger>
            <TabsTrigger value="upload">Upload Material</TabsTrigger>
          </TabsList>
          <TabsContent value="create" className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="scenario">Scenario</Label>
              <Textarea 
                id="scenario" 
                value={scenario} 
                onChange={(e) => setScenario(e.target.value)} 
                placeholder="Describe the scenario for the discussion..." 
                className="min-h-[100px]"
              />
            </div>
            <div className="space-y-2">
              <Label>Discussion Points</Label>
              {discussionPoints.map((point, index) => (
                <Textarea 
                  key={index}
                  value={point}
                  onChange={(e) => handleDiscussionPointChange(index, e.target.value)}
                  placeholder={`Discussion point ${index + 1}`}
                  className="mt-2"
                />
              ))}
            </div>
            <div className="space-y-2">
              <Label htmlFor="task">Task Description</Label>
              <Textarea 
                id="task" 
                value={task} 
                onChange={(e) => setTask(e.target.value)} 
                placeholder="Describe the task for the groups..." 
                className="min-h-[100px]"
              />
            </div>
          </TabsContent>
          <TabsContent value="upload" className="mt-4">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center">
              <Upload className="mx-auto h-12 w-12 text-gray-400" />
              <p className="mt-4 text-sm text-gray-600">Drag and drop your file here, or click to select a file</p>
              <Button variant="outline" className="mt-4">
                <FileText className="mr-2 h-4 w-4" /> Select File
              </Button>
              <Input type="file" className="hidden" />
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )

  const renderStep3 = () => (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle>Preview</CardTitle>
        <CardDescription>Review your group discussion details before creating.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h2 className="text-xl font-bold">{title}</h2>
          <p className="text-sm text-gray-500">Duration: {duration} minutes</p>
        </div>
        <div>
          <h3 className="font-semibold">Scenario:</h3>
          <p className="text-sm mt-1">{scenario}</p>
        </div>
        <div>
          <h3 className="font-semibold">Discussion Points:</h3>
          <ol className="list-decimal list-inside text-sm mt-1">
            {discussionPoints.map((point, index) => (
              <li key={index}>{point}</li>
            ))}
          </ol>
        </div>
        <div>
          <h3 className="font-semibold">Task:</h3>
          <p className="text-sm mt-1">{task}</p>
        </div>
      </CardContent>
    </Card>
  )

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Create New Group Discussion</h1>
      <Progress value={(step / 3) * 100} className="mb-6" />
      {step === 1 && renderStep1()}
      {step === 2 && renderStep2()}
      {step === 3 && renderStep3()}
      <div className="flex justify-between mt-6">
        {step > 1 && (
          <Button onClick={handlePrev} variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4" /> Previous
          </Button>
        )}
        {step < 3 ? (
          <Button onClick={handleNext} className="ml-auto">
            Next <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        ) : (
          <Button onClick={handleCreateSession} className="ml-auto">
            <Eye className="mr-2 h-4 w-4" /> Create Discussion
          </Button>
        )}
      </div>
    </div>
  )
}