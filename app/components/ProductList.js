// components/ProductList.js
'use client';

import { useState } from 'react';
import Image from 'next/image';
import { loadStripe } from '@stripe/stripe-js';

// Initialiser Stripe avec votre clé publique
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

export default function ProductList({ products }) {
  const [loadingId, setLoadingId] = useState(null);

  async function handleBuyNow(product) {
    setLoadingId(product.id);
    
    // Créer une session de checkout avec Stripe
    const stripe = await stripePromise;
    
    // Déterminer l'URL de l'image (si disponible)
    const imageUrl = product.image && product.image.length > 0 
      ? `${process.env.NEXT_PUBLIC_STRAPI_API_URL}${product.image[0].url}`
      : '';
    
    const response = await fetch('/api/create-checkout-session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        items: [
          {
            name: product.name,
            description: product.description,
            price: product.price,
            image: imageUrl,
            quantity: 1,
          }
        ]
      }),
    });

    const session = await response.json();
    
    // Rediriger vers Checkout
    const result = await stripe.redirectToCheckout({
      sessionId: session.id,
    });
    
    if (result.error) {
      console.error(result.error.message);
    }
    
    setLoadingId(null);
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {products.map((product) => (
        <div key={product.id} className="border rounded-lg p-4 flex flex-col">
          {product.image && product.image.length > 0 && (
            <div className="relative w-full h-48 mb-4">
              <Image
                src={`${process.env.NEXT_PUBLIC_STRAPI_API_URL}${product.image[0].url}`}
                alt={product.name}
                fill
                className="object-cover rounded-md"
              />
            </div>
          )}
          <h2 className="text-xl font-semibold">{product.name}</h2>
          <p className="text-lg font-bold my-2">{product.price} €</p>
          <button
            onClick={() => handleBuyNow(product)}
            disabled={loadingId === product.id}
            className="mt-auto bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded disabled:bg-gray-400"
          >
            {loadingId === product.id ? 'Chargement...' : 'Acheter'}
          </button>
        </div>
      ))}
    </div>
  );
}