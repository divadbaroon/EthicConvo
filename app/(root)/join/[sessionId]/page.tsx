"use client"

import { useEffect, useState } from 'react';
import { useAuth } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { createTemporaryUser } from '@/lib/actions/user.actions';
import { getSessionById } from '@/lib/actions/session.actions';

export default function JoinSession({ params }: { params: { sessionId: string }}) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { isLoaded, isSignedIn, userId } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const initializeUser = async () => {
      try {
        // Wait for Clerk to load
        if (!isLoaded) return;

        // If user is already signed in, redirect to group selection
        if (isSignedIn && userId) {
          console.log('User already signed in, redirecting...');
          router.push(`/join/${params.sessionId}/group`);
          return;
        }

        // Check if session exists and is valid
        console.log('Checking session:', params.sessionId);
        const session = await getSessionById(params.sessionId);
        if (!session) {
          setError("Session not found or has expired");
          return;
        }

        if (session.status === 'completed') {
          setError("This session has ended");
          return;
        }

        // Create new temporary user
        console.log('Creating temporary user...');
        const { username, password, userData } = await createTemporaryUser(params.sessionId);
        console.log('Temporary user created:', { username });

        // Store temp user ID
        localStorage.setItem('tempUserId', userData.id);

        // Redirect to sign-in page with credentials
        window.location.href = `/sign-in?username=${username}&password=${password}&redirect=/join/${params.sessionId}/group`;
        
      } catch (error) {
        console.error("Error initializing user:", error);
        setError(error instanceof Error ? error.message : "Failed to join session");
      } finally {
        setLoading(false);
      }
    };

    initializeUser();
  }, [isLoaded, isSignedIn, userId, params.sessionId, router]);

  if (loading || !isLoaded) {
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
            onClick={() => window.location.reload()}
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