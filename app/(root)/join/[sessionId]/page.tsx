"use client"

import { useEffect, useState } from 'react';
import { useSignIn } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { createTemporaryUser } from '@/lib/actions/user.actions';
import { getSessionById } from '@/lib/actions/session.actions';

export default function JoinSession({ params }: { params: { sessionId: string }}) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const signInHelper = useSignIn();
  const router = useRouter();

  useEffect(() => {
    const initializeUser = async () => {
      try {
        console.log('Starting user initialization...');
        
        // Check if sign-in is available
        if (!signInHelper?.signIn || !signInHelper?.setActive) {
          console.error('SignIn helper not available:', signInHelper);
          setError("Authentication service not available");
          setLoading(false);
          return;
        }

        const { signIn, setActive } = signInHelper;

        // First check if session exists and is valid
        console.log('Checking session:', params.sessionId);
        const session = await getSessionById(params.sessionId);
        if (!session) {
          console.error('Session not found');
          setError("Session not found or has expired");
          setLoading(false);
          return;
        }

        if (session.status === 'completed') {
          console.error('Session completed');
          setError("This session has ended");
          setLoading(false);
          return;
        }

        // Create temporary user
        console.log('Creating temporary user...');
        const { username, password, userData } = await createTemporaryUser(params.sessionId);
        console.log('Temporary user created:', { username, userData });

        // Sign in with email/password
        console.log('Attempting sign in...');
        const signInAttempt = await signIn.create({
          identifier: `${username}@temporary.edu`,
          password: password,
        });
        console.log('Sign in attempt result:', signInAttempt);

        if (signInAttempt.status === "complete" && signInAttempt.createdSessionId) {
          console.log('Sign in completed successfully');
          
          // Set this session as active
          console.log('Setting active session...');
          await setActive({ session: signInAttempt.createdSessionId });
          
          // Store any necessary session data
          localStorage.setItem('tempUserId', userData.id);
          
          // Add a small delay to ensure auth state is updated
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          // Attempt redirect
          console.log('Attempting redirect...');
          const redirectUrl = `/join/${params.sessionId}/group`;
          
          try {
            // Try Next.js router first
            router.push(redirectUrl);
            
            // Fallback to window.location after a delay if router.push doesn't work
            setTimeout(() => {
              if (window.location.pathname !== redirectUrl) {
                console.log('Fallback to window.location redirect');
                window.location.href = redirectUrl;
              }
            }, 1500);
          } catch (redirectError) {
            console.error('Redirect error:', redirectError);
            // Force navigation if router fails
            window.location.href = redirectUrl;
          }
          
        } else {
          console.error('Sign in not completed:', signInAttempt);
          throw new Error("Failed to complete sign in process");
        }
      } catch (error) {
        console.error("Error initializing user:", error);
        setError(error instanceof Error ? error.message : "Failed to join session");
      } finally {
        setLoading(false);
      }
    };

    initializeUser();
  }, [params.sessionId, signInHelper, router]);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-t-4 border-blue-500 border-solid rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-lg">Preparing your session...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-500 mb-4">Error</h1>
          <p className="text-gray-600">{error}</p>
          <button 
            onClick={() => router.refresh()}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return null;
}