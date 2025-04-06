import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(request) {
  try {
    const { items } = await request.json();
    
    // Calculer le total de la commande
    const orderTotal = items.reduce((total, item) => total + (item.price * item.quantity), 0);
    
    // Configuration de base pour venir chercher en usine
    const baseShippingOptions = [
      {
        shipping_rate_data: {
          type: 'fixed_amount',
          fixed_amount: {
            amount: 0,
            currency: 'eur',
          },
          display_name: 'Retrait en usine',
          // Option de retrait en usine
          delivery_estimate: {
            minimum: {
              unit: 'business_day',
              value: 1,
            },
            maximum: {
              unit: 'business_day',
              value: 1,
            },
          },
        },
      }
    ];
    
    // Option de livraison standard - gratuite ou payante selon le montant de la commande
    const standardShippingOption = {
      shipping_rate_data: {
        type: 'fixed_amount',
        fixed_amount: {
          amount: orderTotal >= 50 ? 0 : 500, // Gratuit si ≥ 50€, sinon 5€
          currency: 'eur',
        },
        display_name: orderTotal >= 50 ? 
          'Livraison standard (gratuite pour commande de 50€ ou plus)' : 
          'Livraison standard (5€)',
        delivery_estimate: {
          minimum: {
            unit: 'business_day',
            value: 3,
          },
          maximum: {
            unit: 'business_day',
            value: 5,
          },
        },
      },
    };
    
    // Option de livraison express
    const expressShippingOption = {
      shipping_rate_data: {
        type: 'fixed_amount',
        fixed_amount: {
          amount: 1000, // 10 euros en centimes
          currency: 'eur',
        },
        display_name: 'Livraison express',
        delivery_estimate: {
          minimum: {
            unit: 'business_day',
            value: 1,
          },
          maximum: {
            unit: 'business_day',
            value: 2,
          },
        },
      },
    };
    
    // Combiner toutes les options de livraison
    const shippingOptions = [
      ...baseShippingOptions,
      standardShippingOption,
      expressShippingOption
    ];

    // Créer une session Checkout
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: items.map(item => ({
        price_data: {
          currency: 'eur',
          product_data: {
            name: item.name,
            description: item.description.length > 100 ?
              item.description.substring(0, 100) + '...' :
              item.description,
          },
          unit_amount: Math.round(item.price * 100), // Stripe utilise les centimes
        },
        quantity: item.quantity,
      })),
      // Collecte de l'adresse de livraison
      shipping_address_collection: {
        allowed_countries: ['FR', 'BE', 'CH', 'LU'], // Pays où vous livrez
      },
      // Options de livraison dynamiques selon le montant de la commande
      shipping_options: shippingOptions,
      
      // Activer les codes promo de Stripe
      allow_promotion_codes: true,
      
      mode: 'payment',
      success_url: `${request.headers.get('origin')}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${request.headers.get('origin')}/cancel?session_id={CHECKOUT_SESSION_ID}`,
    });

    return NextResponse.json({ id: session.id });
  } catch (error) {
    console.error('Error creating checkout session:', error);
    return NextResponse.json(
      { error: 'Error creating checkout session' },
      { status: 500 }
    );
  }
}