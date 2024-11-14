'use client'

import React, { useState } from 'react'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { useSignUp, useAuth } from '@clerk/nextjs'
import { AlertCircle, CheckCircle2, Info } from 'lucide-react'

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
  
  const handleAccept = async () => {
    if (!isChecked || !isLoaded || isProcessing) return
    
    setIsProcessing(true)

    try {
      if (isSignedIn) {
        onAccountCreated()
        return
      }

      if (!signUp) {
        throw new Error('SignUp not available')
      }

      const username = `student_${Math.random().toString(36).slice(2, 7)}`
      const password = `pass_${Math.random().toString(36).slice(2, 10)}`

      const signUpAttempt = await signUp.create({
        username,
        password,
      })

      await delay(1000)

      if (signUpAttempt.status === "complete") {
        if (signUpAttempt.createdSessionId) {
          await setActive({ session: signUpAttempt.createdSessionId })
          await delay(1000)
          onAccountCreated()
        } else {
          throw new Error('No session ID created')
        }
      } else {
        throw new Error(`Signup incomplete: ${signUpAttempt.status}`)
      }

    } catch (err) {
      console.error('Sign up error:', err)
      onError('Failed to create account. Please try again.')
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/10 flex items-center justify-center p-4">
      <Card className="w-full max-w-4xl shadow-lg border-t-4 border-t-primary">
        <CardHeader className="text-center space-y-2 pb-2">
          <CardTitle className="text-4xl font-bold text-primary">Welcome to EthicConvo</CardTitle>
          <p className="text-muted-foreground text-lg">Please review the information below and provide your consent to participate.</p>
        </CardHeader>
        
        <CardContent className="space-y-8">
          <section className="prose dark:prose-invert max-w-none">
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

            <div className="bg-primary/5 p-6 rounded-lg my-6 border border-primary/10 shadow-sm">
                <h3 className="text-2xl font-semibold mb-3 text-primary flex items-center">
                    <CheckCircle2 className="mr-2 h-6 w-6" />
                    Data Collection & Privacy
                </h3>
                <p className="text-lg leading-relaxed mb-4">
                    <span>All student names, transcripts, and audio data are anonymized and securely stored. No retrieved data can be traced back to any individual student.</span>
                </p>
                </div>            

            <div className="bg-primary/5 p-6 rounded-lg my-6 border border-primary/10 shadow-sm">
              <h3 className="text-2xl font-semibold mb-3 text-primary flex items-center">
                <Info className="mr-2 h-6 w-6" />
                Contact Information
              </h3>
              <p className="text-lg leading-relaxed">
                For questions or concerns about this platform, please contact your instructor 
                or the EthicConvo support team (dbarron410@vt.edu).
              </p>
            </div>
          </section>

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
            disabled={!isChecked || isProcessing}
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