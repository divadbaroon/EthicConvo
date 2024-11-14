"use client"

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import ConsentPage from '@/components/discussion/ConsentForm';

export default function JoinSession({ params }: { params: { sessionId: string }}) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  const handleAccountCreated = () => {
    router.push(`/join/${params.sessionId}/group`);
  };

  const handleError = (error: string) => {
    setError(error);
  };

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
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

  return (
    <ConsentPage
      sessionId={params.sessionId}
      onAccountCreated={handleAccountCreated}
      onError={handleError}
    />
  );
}