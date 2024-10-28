"use client"

import { useEffect, useState } from 'react';
import { useAuth, useSignIn } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { createTemporaryUser } from '@/lib/actions/user.actions';

export default function JoinSession({ params }: { params: { sessionId: string }}) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { isLoaded, isSignedIn } = useAuth();
  const { signIn, setActive } = useSignIn();
  const router = useRouter();

  useEffect(() => {
    const setup = async () => {
      try {
        // Wait for Clerk to load
        if (!isLoaded) return;

        console.log('Auth state:', { isSignedIn });

        // If already signed in, go to group selection
        if (isSignedIn) {
          console.log('Already signed in, redirecting...');
          router.push(`/join/${params.sessionId}/group`);
          return;
        }

        // If not signed in, create and sign in as temporary user
        if (!isSignedIn && signIn) {
          // Create temporary user
          console.log('Creating temporary user...');
          const { username, password } = await createTemporaryUser(params.sessionId);
          console.log('User created, signing in...', username);

          // Sign in with the new credentials
          const result = await signIn.create({
            identifier: `${username}@temporary.edu`,
            password,
          });

          console.log('Sign in result:', result);

          if (result.status === "complete") {
            await setActive({ session: result.createdSessionId });
            console.log('Sign in complete, redirecting...');
            router.push(`/join/${params.sessionId}/group`);
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
  }, [isLoaded, isSignedIn, signIn, params.sessionId, router]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return null;
}