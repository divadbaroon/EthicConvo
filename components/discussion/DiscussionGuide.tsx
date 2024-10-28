"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"

import { Session } from "@/types"

export interface DiscussionGuideProps {
  session: Session | null;
  mode: 'usage-check' | 'waiting-room' | 'discussion';
}

function DiscussionGuide({ session, mode }: DiscussionGuideProps) {
  const [timeLeft, setTimeLeft] = useState(session?.time_left || 600)
  const [isRunning, setIsRunning] = useState(mode === 'discussion')
  const [answers, setAnswers] = useState({
    problem: "",
    technology: "",
    solutions: ""
  })
  const [isReviewOpen, setIsReviewOpen] = useState(false)

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  useEffect(() => {
    let timer: NodeJS.Timeout
    if (isRunning && timeLeft > 0 && mode === 'discussion') {
      timer = setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1)
      }, 1000)
    } else if (timeLeft === 0) {
      setIsRunning(false)
    }
    return () => clearInterval(timer)
  }, [isRunning, timeLeft, mode])

  const handleInputChange = (field: keyof typeof answers, value: string) => {
    setAnswers(prev => ({ ...prev, [field]: value }))
  }

  const handleReview = () => {
    setIsReviewOpen(true)
  }

  const handleSubmit = () => {
    console.log("Submitted answers:", answers)
    setIsReviewOpen(false)
  }

  if (!session) {
    return null;
  }

  const renderAccordionContent = (point: string, index: number) => {
    if (mode === 'waiting-room') {
      return null; // No content for waiting room mode
    }

    if (mode === 'usage-check') {
      return (
        <AccordionContent>
          <p className="text-sm text-gray-600">
            This section will be available during the discussion.
          </p>
        </AccordionContent>
      );
    }

    return (
      <AccordionContent>
        <Textarea 
          placeholder="Enter your answer here"
          value={answers[`point${index}` as keyof typeof answers] || ''}
          onChange={(e) => handleInputChange(`point${index}` as keyof typeof answers, e.target.value)}
        />
      </AccordionContent>
    );
  }

  const getCardHeight = () => {
    switch (mode) {
      case 'discussion':
        return 'h-[90vh]';
      case 'waiting-room':
        return 'h-[80vh]';
      default:
        return 'h-[80vh]';
    }
  };

  return (
    <Card className={`w-full ${getCardHeight()} flex flex-col`}>
      <CardHeader className="flex-shrink-0 space-y-2">
        <CardTitle className="text-2xl font-bold text-center">
          Discussion Guide
        </CardTitle>
        <h3 className="font-semibold"></h3>
        <Separator />
      </CardHeader>
      <CardContent className="flex-grow overflow-hidden p-0">
        <ScrollArea className="h-full px-4">
          <section className="mb-8">
            <h3 className="text-lg font-semibold mb-2">Task</h3>
            <p className="text-sm text-gray-600">
              {session.task}
            </p>
          </section>

          <section className="mb-8">
            <h3 className="text-lg font-semibold mb-2">Scenario</h3>
            <p className="text-sm text-gray-600">
              {session.scenario}
            </p>
          </section>

          <section>
            <h3 className="text-lg font-semibold mb-2">Discussion Points</h3>
            <Accordion type="single" collapsible className="w-full">
              {session.discussion_points.map((point, index) => (
                <AccordionItem key={index} value={`item-${index + 1}`}>
                  <AccordionTrigger 
                    className={`
                      [&[data-state=open]]:text-primary 
                      text-left 
                      ${mode !== 'discussion' ? '[&>svg]:hidden' : ''}
                    `}
                  >
                    <div className="flex gap-2">
                      <span className="w-6">{index + 1}.</span>
                      <span>{point}</span>
                    </div>
                  </AccordionTrigger>
                  {renderAccordionContent(point, index)}
                </AccordionItem>
              ))}
            </Accordion>
          </section>
        </ScrollArea>
      </CardContent>
      {mode === 'discussion' && (
        <CardFooter className="flex-shrink-0 border-t pt-4">
          <div className="w-full flex justify-between items-center mt-2">
            <p className="text-lg font-semibold">Total Time Left: {formatTime(timeLeft)}</p>
            <Button onClick={handleReview}>Review Answers</Button>
          </div>
        </CardFooter>
      )}

      {mode === 'discussion' && (
        <Dialog open={isReviewOpen} onOpenChange={setIsReviewOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Review Your Answers</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              {session.discussion_points.map((point, index) => (
                <div key={index}>
                  <h4 className="font-semibold">{index + 1}. {point}</h4>
                  <p className="text-sm">
                    {answers[`point${index}` as keyof typeof answers] || "No answer provided"}
                  </p>
                </div>
              ))}
            </div>
            <DialogFooter>
              <Button onClick={() => setIsReviewOpen(false)}>Close</Button>
              <Button onClick={handleSubmit}>Submit Answers</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </Card>
  )
}

export default DiscussionGuide;