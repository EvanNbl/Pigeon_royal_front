// app/page.js
import ProductList from './components/ProductList';

export default async function Home() {
  // Récupération des produits côté serveur
  const products = await getProducts();
  
  return (
    <div className="container mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold text-center mb-6">Bienvenue sur ma boutique</h1>
      <p className="text-center text-gray-600 mb-10 max-w-2xl mx-auto">
        Découvrez notre sélection de produits de qualité. Ajoutez les articles à votre panier et finalisez votre commande en toute simplicité.
      </p>
      <ProductList products={products} />
    </div>
  );
}

async function getProducts() {
  // Récupérer les produits depuis Strapi
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_STRAPI_API_URL}/api/products`,
    { cache: 'no-store' } // ou { next: { revalidate: 60 } } pour ISR
  );
  
  if (!res.ok) {
    throw new Error('Failed to fetch products');
  }
  
  const data = await res.json();
  return data.data || [];
}