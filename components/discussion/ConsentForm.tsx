'use client'

import React, { useState } from 'react'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { useSignUp, useAuth } from '@clerk/nextjs'
import { AlertCircle, CheckCircle2, Info, ChevronDown, ChevronUp, Handshake, Mail } from 'lucide-react'

import { useUser } from '@clerk/nextjs';
import { updateUserConsent } from '@/lib/actions/user.actions'

interface ConsentPageProps {
  sessionId: string
  onAccountCreated: () => void
  onError: (error: string) => void
}

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

export default function ConsentPage({ 
  sessionId, 
  onAccountCreated,
  onError
}: ConsentPageProps) {
  const [isChecked, setIsChecked] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const { isLoaded, signUp, setActive } = useSignUp()
  const { isSignedIn } = useAuth()
  const { user } = useUser();
  
  // State for collapsible section
  const [isExampleOpen, setIsExampleOpen] = useState(false)

  const handleAccept = async () => {
    if (isProcessing) return;
    
    setIsProcessing(true);
    console.log('Starting update with consent:', isChecked);
  
    try {
      if (isSignedIn) {
        if (user) {
          await updateUserConsent({
            clerk_id: user.id,
            has_consented: Boolean(isChecked)
          });
        }
        onAccountCreated();
        return;
      }
  
      if (!signUp) {
        throw new Error('SignUp not available');
      }
  
      const username = `student_${Math.random().toString(36).slice(2, 7)}`;
      const password = `pass_${Math.random().toString(36).slice(2, 10)}`;
  
      const signUpAttempt = await signUp.create({
        username,
        password,
      });
  
      await delay(1000);
  
      if (signUpAttempt.status === "complete") {
        if (signUpAttempt.createdSessionId) {
          await setActive({ session: signUpAttempt.createdSessionId });
          await delay(1000);
  
          const clerkUserId = signUpAttempt.createdUserId;
          if (clerkUserId) {
            await updateUserConsent({
              clerk_id: clerkUserId,
              has_consented: Boolean(isChecked)
            });
          }
  
          onAccountCreated();
        } else {
          throw new Error('No session ID created');
        }
      } else {
        throw new Error(`Signup incomplete: ${signUpAttempt.status}`);
      }
  
    } catch (err) {
      console.error('Sign up error:', err);
      onError('Failed to create account. Please try again.');
    } finally {
      setIsProcessing(false);
    }
};
  
  // URLs for the audio samples
  const originalVoiceUrl = 'https://colpzxhrkmkatbmnobft.supabase.co/storage/v1/object/public/audio-recordings/recordings/e958fa27-7074-4f34-b671-043d3070f455/user_2pAZGyT6WkYjbrDc0iY5uiHlEZq_2024-11-21T17:55:47.924Z.webm'
  const anonymizedVoiceUrl = 'https://colpzxhrkmkatbmnobft.supabase.co/storage/v1/object/public/audio-recordings/recordings/e958fa27-7074-4f34-b671-043d3070f455/user_2pAZGyT6WkYjbrDc0iY5uiHlEZq_2024-11-21T17:55:49.031Z.webm'

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/10 flex items-center justify-center p-4">
      <Card className="w-full max-w-4xl shadow-lg border-t-4 border-t-primary">
        <CardHeader className="text-center space-y-2 pb-2">
          <CardTitle className="text-4xl font-bold text-primary">Welcome to EthicConvo</CardTitle>
          <p className="text-muted-foreground text-lg">Please review the information below and provide your consent to participate.</p>
        </CardHeader>
        
        <CardContent className="space-y-8">
          <section className="prose dark:prose-invert max-w-none">

             {/* Introduction to EthicConvo */}
             <div className="bg-primary/5 p-6 rounded-lg my-6 border border-primary/10 shadow-sm">
              <h3 className="text-2xl font-semibold mb-3 text-primary flex items-center">
                <Info className="mr-2 h-6 w-6" />
                What is EthicConvo?
              </h3>
              <p className="text-lg leading-relaxed">
                EthicConvo facilitates real-time collaboration, discussion, and problem-solving 
                among students, going beyond traditional assignments to reveal critical aspects 
                of students' mental models, teamwork skills, and learning progress.
              </p>
            </div>

           {/* Data Collection & Privacy Section */}
           <div className="bg-primary/5 p-6 rounded-lg my-6 border border-primary/10 shadow-sm">
              <h3 className="text-2xl font-semibold mb-3 text-primary flex items-center">
                <CheckCircle2 className="mr-2 h-6 w-6" />
                Data Collection & Privacy
              </h3>
              <p className="text-lg leading-relaxed mb-4">
                All student names, transcripts, and audio data are anonymized and securely stored. No retrieved data can be traced back to any individual student.
              </p>
              
              {/* Collapsible Section */}
              <div>
                <div className="flex justify-end">
                  <button
                    onClick={() => setIsExampleOpen(!isExampleOpen)}
                    className="flex items-center text-primary hover:underline focus:outline-none"
                  >
                    {isExampleOpen ? <ChevronUp className="h-5 w-5 mr-1" /> : <ChevronDown className="h-5 w-5 mr-1" />}
                    See Example
                  </button>
                </div>

                {isExampleOpen && (
                  <div className="mt-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Original Voice */}
                      <div className="bg-white p-4 rounded-lg shadow-sm">
                        <h4 className="text-lg font-semibold mb-2">Original Voice</h4>
                        <audio controls className="w-full">
                          <source src={originalVoiceUrl} type="audio/mpeg" />
                          Your browser does not support the audio element.
                        </audio>
                      </div>
                      {/* Anonymized Voice */}
                      <div className="bg-white p-4 rounded-lg shadow-sm">
                        <h4 className="text-lg font-semibold mb-2">Anonymized Voice</h4>
                        <audio controls className="w-full">
                          <source src={anonymizedVoiceUrl} type="audio/mpeg" />
                          Your browser does not support the audio element.
                        </audio>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Contact Information */}
            <div className="bg-primary/5 p-6 rounded-lg my-6 border border-primary/10 shadow-sm">
              <h3 className="text-2xl font-semibold mb-3 text-primary flex items-center">
                <Handshake className="mr-2 h-6 w-6" />
                Voluntary Participation
              </h3>
              <p className="text-lg leading-relaxed mt-2">
              Choosing not to participate will have no negative impact on your grades, academic standing, or any other aspect of your education.
              </p>
            </div>            

            <div className="bg-primary/5 p-6 rounded-lg my-6 border border-primary/10 shadow-sm">
              <h3 className="text-2xl font-semibold mb-3 text-primary flex items-center">
                <Mail className="mr-2 h-6 w-6" />
                Contact Information
              </h3>
              <p className="text-lg leading-relaxed">
                For questions or concerns about this platform, please contact your instructor 
                or the EthicConvo support team (<a href="mailto:dbarron410@vt.edu" className="text-primary underline">dbarron410@vt.edu</a>).
              </p>
            </div>
          </section>

          {/* Consent Checkbox */}
          <div className="flex items-center space-x-3 p-6 bg-secondary/20 rounded-lg border border-secondary">
            <Checkbox 
              id="consent" 
              checked={isChecked} 
              onCheckedChange={(checked) => setIsChecked(checked === true)}
              className="h-5 w-5"
            />
            <label 
              htmlFor="consent" 
              className="text-base font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
             I understand and agree to participate in this session. I acknowledge that my interactions will be monitored for educational purposes and that I can withdraw at any time.
            </label>
          </div>
        </CardContent>

        {/* Footer with Buttons */}
        <CardFooter className="flex flex-col sm:flex-row justify-end gap-4 pt-6 pb-8">
          <Button 
            variant="outline" 
            onClick={() => window.location.href = '/'}
            className="w-full sm:w-auto text-base"
          >
            Decline & Return Home
          </Button>
          <Button 
            variant="default" 
            disabled={isProcessing}
            onClick={handleAccept}
            className="w-full sm:w-auto text-base"
          >
            {isProcessing ? (
              <>
                <AlertCircle className="mr-2 h-5 w-5 animate-spin" />
                Setting up your session...
              </>
            ) : (
              "Continue to Session"
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
