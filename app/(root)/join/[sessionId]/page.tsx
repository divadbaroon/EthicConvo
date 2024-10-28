"use client"

import { useEffect, useState } from 'react';
import { useAuth, useSignIn } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { createTemporaryUser } from '@/lib/actions/user.actions';

// Helper function for delays
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export default function JoinSession({ params }: { params: { sessionId: string }}) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { isLoaded, isSignedIn, userId } = useAuth();
  const { signIn, setActive } = useSignIn();
  const router = useRouter();

  useEffect(() => {
    const setup = async () => {
      try {
        // Wait for Clerk to load
        if (!isLoaded || !signIn) return;

        console.log('Auth state:', { isSignedIn, userId });

        // If already signed in, wait briefly then redirect
        if (isSignedIn && userId) {
          console.log('Already signed in, waiting before redirect...');
          await delay(1000); // 1 second delay
          router.push(`/join/${params.sessionId}/group`);
          return;
        }

        // If not signed in, create and sign in as temporary user
        if (!isSignedIn && signIn) {
          try {
            console.log('Starting user creation process...');
            
            // Create temporary user
            const { username, password } = await createTemporaryUser(params.sessionId);
            console.log('User created, waiting before sign in...', username);
            
            // Wait for user creation to fully propagate
            await delay(2000); // 2 second delay

            // Attempt sign in
            console.log('Attempting sign in...');
            const result = await signIn.create({
              identifier: `${username}@temporary.edu`,
              password,
            });

            console.log('Sign in result:', result);

            if (result.status === "complete") {
              // Wait for sign in to complete
              await delay(1000); // 1 second delay
              
              console.log('Setting active session...');
              await setActive({ session: result.createdSessionId });
              
              // Final wait before redirect
              await delay(1000); // 1 second delay
              
              console.log('Redirecting to group page...');
              router.push(`/join/${params.sessionId}/group`);
            }
          } catch (createError) {
            console.error('Error in setup process:', createError);
            setError("Failed to join session. Please try again.");
          }
        }
      } catch (err) {
        console.error('Error:', err);
        setError(err instanceof Error ? err.message : 'Failed to setup session');
      } finally {
        setLoading(false);
      }
    };

    setup();
  }, [isLoaded, isSignedIn, userId, signIn, params.sessionId, router]);

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
          <p className="text-gray-600">{error}</p>
          <button 
            onClick={async () => {
              setLoading(true);
              await delay(1000);
              window.location.reload();
            }}
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