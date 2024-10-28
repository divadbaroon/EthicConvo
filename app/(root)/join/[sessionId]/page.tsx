"use client"

import { useEffect, useState } from 'react';
import { useAuth, useSignUp } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { createTemporaryUser } from '@/lib/actions/user.actions';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export default function JoinSession({ params }: { params: { sessionId: string }}) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { isLoaded, isSignedIn } = useAuth();
  const { signUp, setActive } = useSignUp();
  const router = useRouter();

  useEffect(() => {
    const setup = async () => {
      try {
        if (!isLoaded) return;

        // If already signed in, redirect to group
        if (isSignedIn) {
          router.push(`/join/${params.sessionId}/group`);
          return;
        }

        if (!signUp) {
          throw new Error("Authentication not available");
        }

        // Create temp user
        const { username, password } = await createTemporaryUser(params.sessionId);
        console.log('Created temp user:', username);

        await delay(1000);

        // Sign up with username/password
        const result = await signUp.create({
          username,
          password
        });

        if (result.status === "complete") {
          await delay(1000);
          await setActive({ session: result.createdSessionId });
          console.log('Auth complete, redirecting...');
          router.push(`/join/${params.sessionId}/group`);
        } else {
          throw new Error("Failed to complete signup");
        }

      } catch (err) {
        console.error('Setup error:', err);
        setError("Failed to setup session. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    setup();
  }, [isLoaded, isSignedIn, signUp, params.sessionId, router]);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-t-4 border-blue-500 border-solid rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-lg">Setting up your session...</p>
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