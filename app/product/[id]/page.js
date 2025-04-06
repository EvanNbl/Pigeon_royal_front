// app/product/[id]/page.js
import ProductDetail from '../../components/ProductDetail';
import { notFound } from 'next/navigation';

export async function generateMetadata({ params }) {
  const product = await getProduct(params.id);
  
  if (!product) {
    return {
      title: 'Produit non trouvé',
      description: 'Le produit que vous cherchez n\'existe pas'
    };
  }
  
  return {
    title: `${product.name} - Ma Boutique en Ligne`,
    description: product.description,
    openGraph: {
      title: product.name,
      description: product.description,
      images: product.image?.length > 0 ? 
        [`${process.env.NEXT_PUBLIC_STRAPI_API_URL}${product.image[0].url}`] : [],
    },
  };
}

export default async function ProductPage({ params }) {
  const product = await getProduct(params.id);
  
  if (!product) {
    notFound();
  }
  
  return <ProductDetail product={product} />;
}

async function getProduct(id) {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_STRAPI_API_URL}/api/products/${id}?populate=image`,
      { cache: 'no-store' }
    );
    
    if (!res.ok) {
      return null;
    }
    
    const data = await res.json();
    return data.data || null;
  } catch (error) {
    console.error('Failed to fetch product:', error);
    return null;
  }
}