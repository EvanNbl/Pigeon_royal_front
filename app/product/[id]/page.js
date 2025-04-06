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
    // Récupérer le produit avec ses relations (image, couleurs, tailles)
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_STRAPI_API_URL}/api/products/${id}?populate=*`,
      { cache: 'no-store' }
    );
    
    if (!res.ok) {
      return null;
    }
    
    const response = await res.json();
    
    // Si le produit existe
    if (response.data) {
      // Extraire les données du produit
      const productData = {
        ...response.data.attributes,
        id: response.data.id,
        documentId: id // Garder l'ID original pour les liens
      };
      
      // Transformer les relations (colors, sizes) en formats utilisables
      if (response.data.attributes.colors?.data) {
        productData.colors = response.data.attributes.colors.data.map(color => ({
          id: color.id,
          name: color.attributes.name,
          code: color.attributes.code,
          display_order: color.attributes.display_order
        })).sort((a, b) => a.display_order - b.display_order);
      }
      
      if (response.data.attributes.sizes?.data) {
        productData.sizes = response.data.attributes.sizes.data.map(size => ({
          id: size.id,
          name: size.attributes.name,
          display_order: size.attributes.display_order
        })).sort((a, b) => a.display_order - b.display_order);
      }
      
      return productData;
    }
    
    return null;
  } catch (error) {
    console.error('Failed to fetch product:', error);
    return null;
  }
}