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
        // Check if sign-in is available
        if (!signInHelper?.signIn || !signInHelper?.setActive) {
          setError("Authentication service not available");
          setLoading(false);
          return;
        }

        const { signIn, setActive } = signInHelper;

        // First check if session exists and is valid
        const session = await getSessionById(params.sessionId);
        if (!session) {
          setError("Session not found or has expired");
          setLoading(false);
          return;
        }

        if (session.status === 'completed') {
          setError("This session has ended");
          setLoading(false);
          return;
        }

        // Create temporary user
        const { username, password, userData } = await createTemporaryUser(params.sessionId);

        // Sign in with email/password
        const signInAttempt = await signIn.create({
          identifier: `${username}@temporary.edu`,
          password: password,
        });

        if (signInAttempt.status === "complete" && signInAttempt.createdSessionId) {
          // Set this session as active
          await setActive({ session: signInAttempt.createdSessionId });
          
          // Store any necessary session data
          localStorage.setItem('tempUserId', userData.id);
          
          // Redirect to group selection
          router.push(`/join/${params.sessionId}/group-selection`);
        } else {
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
        </div>
      </div>
    );
  }

  return null;
}