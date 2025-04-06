// app/cancel/page.js
'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useCart } from '../context/CartContext';
import styles from './cancel.module.css';

export default function cancel() {
  const searchParams = useSearchParams();
  const session_id = searchParams.get('session_id');
  const [status, setStatus] = useState('loading');
  const { clearCart } = useCart();

  useEffect(() => {
    if (session_id) {
      // Vider le panier après un achat réussi
      clearCart();
      setStatus('cancel');
    }
  }, [session_id, clearCart]);

  return (
    <div className={styles.container}>
        <div className={styles.content}>
            {status === 'loading' ? (
            <p>Chargement...</p>
            ) : (
            <>
                <h1 className={styles.title}>Paiement annulé</h1>
                <p className={styles.message}>
                    Votre paiement a été annulé. Si vous avez des questions, n'hésitez pas à nous contacter.
                </p>
                <Link href="/" className={styles.link}>
                    Retour à la boutique
                </Link>
            </>
            )}
        </div>
    </div>
    );
}