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
    
    // Vérifier si les données existent
    if (response.data) {
      // Adapter la structure à ce que votre composant attend
      // Basé sur la réponse JSON que vous avez partagée
      const productData = {
        ...response.data,
        documentId: id // Garder l'ID original pour les liens
      };
      
      // Si les couleurs existent mais ont une structure différente
      if (productData.colors) {
        // S'assurer que les couleurs sont triées par display_order si disponible
        productData.colors.sort((a, b) => (a.display_order || 0) - (b.display_order || 0));
      }
      
      // Si les tailles existent mais ont une structure différente
      if (productData.sizes) {
        // S'assurer que les tailles sont triées par display_order si disponible
        productData.sizes.sort((a, b) => (a.display_order || 0) - (b.display_order || 0));
      }

      // Debug: voir la structure exacte du produit avant de la renvoyer
      console.log('Product structure:', JSON.stringify(productData, null, 2));
      
      return productData;
    }
    
    return null;
  } catch (error) {
    console.error('Failed to fetch product:', error);
    return null;
  }
}