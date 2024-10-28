"use client"

import { useEffect, useState } from 'react';
import { useSignUp, useAuth } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export default function JoinSession({ params }: { params: { sessionId: string }}) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { isLoaded, signUp, setActive } = useSignUp();
  const { isSignedIn } = useAuth();
  const router = useRouter();

  useEffect(() => {
    async function createAndSignUp() {
      if (!isLoaded) return;

      try {
        // If already signed in, redirect
        if (isSignedIn) {
          console.log('Already signed in, redirecting...');
          router.push(`/join/${params.sessionId}/group`);
          return;
        }

        if (!signUp) {
          console.error('SignUp not available');
          return;
        }

        // Generate random username and password
        const username = `student_${Math.random().toString(36).slice(2, 7)}`;
        const password = `pass_${Math.random().toString(36).slice(2, 10)}`;

        console.log('Attempting signup with:', { username });

        // Create the user
        const signUpAttempt = await signUp.create({
          username,
          password,
        });

        console.log('Sign up result:', signUpAttempt.status);

        // Wait a moment before continuing
        await delay(1000);

        if (signUpAttempt.status === "complete") {
          if (signUpAttempt.createdSessionId) {
            console.log('Setting active session...');
            await setActive({ session: signUpAttempt.createdSessionId });
            
            // Wait for session to be active
            await delay(1000);
            
            console.log('Redirecting to group page...');
            window.location.href = `/join/${params.sessionId}/group`;
          } else {
            throw new Error('No session ID created');
          }
        } else {
          throw new Error(`Signup incomplete: ${signUpAttempt.status}`);
        }

      } catch (err) {
        console.error('Sign up error:', err);
        setError('Failed to create account. Please try again.');
      } finally {
        setLoading(false);
      }
    }

    createAndSignUp();
  }, [isLoaded, signUp, setActive, params.sessionId, router, isSignedIn]);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-t-4 border-blue-500 border-solid rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-lg">Setting up your session...</p>
          <p className="text-sm text-gray-500 mt-2">This may take a few moments</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-500 mb-4">Error</h1>
          <p className="text-gray-600 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return null;
}