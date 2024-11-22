"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"
import { toast } from "sonner"

import { Session } from "@/types"
import { supabaseClient } from "@/lib/database/supabase/client"

export interface DiscussionGuideProps {
  session: Session | null;
  mode: 'usage-check' | 'waiting-room' | 'discussion';
}

interface Answers {
  [key: string]: string;
  problem: string;
  technology: string;
  solutions: string;
}

function DiscussionGuide({ session, mode }: DiscussionGuideProps) {
  const [timeLeft, setTimeLeft] = useState(() => {
    // Try to get saved time from localStorage first
    const savedTime = localStorage.getItem('timeLeft');
    const savedTimestamp = localStorage.getItem('timerTimestamp');
    
    if (savedTime && savedTimestamp) {
      const elapsedTime = Math.floor((Date.now() - parseInt(savedTimestamp)) / 1000);
      const remainingTime = Math.max(0, parseInt(savedTime) - elapsedTime);
      return remainingTime;
    }
    return session?.time_left || 600;
  });
  
  const [isRunning, setIsRunning] = useState(session?.status === 'active')
  const [loading, setLoading] = useState(true)
  const [answers, setAnswers] = useState(() => {
    // Try to get saved answers from localStorage
    const savedAnswers = localStorage.getItem('discussionAnswers');
    return savedAnswers ? JSON.parse(savedAnswers) : {
      problem: "",
      technology: "",
      solutions: ""
    };
  });
  const [isReviewOpen, setIsReviewOpen] = useState(false)
  const [isTimeUp, setIsTimeUp] = useState(() => {
    // Check if timer was already up
    const timeUpState = localStorage.getItem('isTimeUp') === 'true';
    if (timeUpState) {
      // If time was up, make sure dialog is shown
      setTimeout(() => setIsReviewOpen(true), 0);
    }
    return timeUpState;
  });
  const [isSubmitted, setIsSubmitted] = useState(false)

  // Subscribe to session changes and update timer
  useEffect(() => {
    if (!session?.id) return;

    const fetchCurrentSession = async () => {
      try {
        const { data, error } = await supabaseClient
          .from('sessions')
          .select('*')
          .eq('id', session.id)
          .single();

        if (error) throw error;
        if (data) {
          // Only set time if not already stored
          if (!localStorage.getItem('timeLeft')) {
            setTimeLeft(data.time_left || 600);
          }
          setIsRunning(data.status === 'active');
        }
      } catch (error) {
        console.error('Error fetching session:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCurrentSession();

    const channel = supabaseClient
      .channel(`session-${session.id}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'sessions',
          filter: `id=eq.${session.id}`
        },
        (payload) => {
          const updatedSession = payload.new as Session;
          if (!localStorage.getItem('timeLeft')) {
            setTimeLeft(updatedSession.time_left || 600);
          }
          setIsRunning(updatedSession.status === 'active');
        }
      )
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  }, [session?.id]);

  // Timer effect with persistence
  useEffect(() => {
    let timer: NodeJS.Timeout;
    
    if (isRunning && timeLeft > 0 && mode === 'discussion') {
      // Save current time and timestamp
      localStorage.setItem('timeLeft', timeLeft.toString());
      localStorage.setItem('timerTimestamp', Date.now().toString());
      
      timer = setInterval(() => {
        setTimeLeft(prevTime => {
          const newTime = Math.max(0, prevTime - 1);
          
          // Update localStorage
          localStorage.setItem('timeLeft', newTime.toString());
          localStorage.setItem('timerTimestamp', Date.now().toString());
          
          if (newTime === 0) {
            setIsTimeUp(true);
            localStorage.setItem('isTimeUp', 'true');
            setIsReviewOpen(true);
          }
          return newTime;
        });
      }, 1000);
    }

    // If time is already up on mount and not submitted, show the review dialog
    if (timeLeft === 0 && !isSubmitted) {
      setIsTimeUp(true);
      setIsReviewOpen(true);
    }

    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isRunning, mode, timeLeft, isSubmitted]);

  // Save answers to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('discussionAnswers', JSON.stringify(answers));
  }, [answers]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const handleInputChange = (field: keyof typeof answers, value: string) => {
    setAnswers((prev: Answers) => ({ ...prev, [field]: value }));
  };

  const handleReview = () => {
    setIsReviewOpen(true)
  }

  const handleSubmit = async () => {
    try {
      // Save answers to Supabase
      const { data, error } = await supabaseClient
        .from('answers')  
        .insert([
          {
            session_id: session?.id,
            user_id: session?.created_by,
            answers: answers,
            submitted_at: new Date().toISOString()
          }
        ])
        .select();
  
      if (error) throw error;
  
      // Clear localStorage after successful submission
      localStorage.removeItem('timeLeft');
      localStorage.removeItem('timerTimestamp');
      localStorage.removeItem('isTimeUp');
      localStorage.removeItem('discussionAnswers');
      
      setIsSubmitted(true);
      setIsReviewOpen(false);
      
      // Show success dialog before redirecting
      await toast.promise(
        new Promise((resolve) => setTimeout(resolve, 2000)),
        {
          loading: 'Submitting your answers...',
          success: () => {
            setTimeout(() => {
              window.location.href = '/';
            }, 1000);
            return 'Answers submitted successfully! Redirecting...';
          },
          error: 'Failed to submit answers',
        }
      );
    } catch (error) {
      console.error('Error submitting answers:', error);
      toast.error("Failed to submit answers");
    }
  };

  if (!session) {
    return null;
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

  if (loading) {
    return (
      <Card className={`w-full ${getCardHeight()} flex flex-col items-center justify-center`}>
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-900"></div>
      </Card>
    );
  }

  const renderAccordionContent = (point: string, index: number) => {
    if (mode === 'waiting-room') {
      return null;
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
        <Dialog 
          open={isReviewOpen} 
          onOpenChange={(open) => {
            // Only allow closing if time isn't up
            if (!isTimeUp) {
              setIsReviewOpen(open);
            }
          }}
        >
          <DialogContent className="max-w-3xl max-h-[80vh]">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold mb-4">
                {isTimeUp ? "Time's Up! Please Submit Your Answers" : "Review Your Answers"}
              </DialogTitle>
            </DialogHeader>

            <ScrollArea className="pr-4 max-h-[60vh]">
              <div className="space-y-8">
                {session.discussion_points.map((point, index) => (
                  <div key={index} className="space-y-4">
                    <div className="flex items-start gap-3">
                      <span className="font-semibold text-lg min-w-[24px]">{index + 1}.</span>
                      <div className="space-y-4 flex-1">
                        <h4 className="font-semibold text-lg">{point}</h4>
                        <div className="space-y-2">
                          <Textarea
                            id={`answer-${index}`}
                            value={answers[`point${index}` as keyof typeof answers] || ""}
                            onChange={(e) => handleInputChange(`point${index}` as keyof typeof answers, e.target.value)}
                            className="min-h-[100px] w-full p-3 bg-gray-50"
                            placeholder="Enter your answer here..."
                          />
                        </div>
                      </div>
                    </div>
                    {index < session.discussion_points.length - 1 && (
                      <Separator className="my-4" />
                    )}
                  </div>
                ))}
              </div>
            </ScrollArea>
            <DialogFooter className="gap-2 mt-6">
              {!isTimeUp && (
                <Button variant="outline" onClick={() => setIsReviewOpen(false)}>
                  Cancel
                </Button>
              )}
              <Button onClick={handleSubmit} className="px-8">
                Submit
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </Card>
  );
}

export default DiscussionGuide;