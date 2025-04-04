// app/success/page.js
'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function Success() {
  const searchParams = useSearchParams();
  const session_id = searchParams.get('session_id');
  const [status, setStatus] = useState('loading');

  useEffect(() => {
    if (session_id) {
      // Vous pourriez vérifier la session ici si nécessaire
      setStatus('success');
    }
  }, [session_id]);

  return (
    <div className="flex justify-center items-center min-h-screen p-8">
      <div className="bg-white rounded-lg shadow-md p-8 max-w-md w-full text-center">
        <h1 className="text-2xl font-bold mb-4">Merci pour votre achat !</h1>
        
        {status === 'loading' && <p>Chargement...</p>}
        
        {status === 'success' && (
          <>
            <p className="mb-2">Votre commande a été traitée avec succès.</p>
            <p>Vous recevrez un email de confirmation très bientôt.</p>
          </>
        )}
        
        <Link href="/" className="inline-block bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded mt-6">
          Retour à la boutique
        </Link>
      </div>
    </div>
  );
}