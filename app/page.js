// app/page.js
import ProductList from './components/ProductList';
import Link from 'next/link';
import Image from 'next/image';
import styles from './page.module.css';

export default async function Home() {
  // Récupération des produits côté serveur
  const products = await getProducts();
  
  return (
    <div>
      {/* Hero Section */}
      <section className={styles.heroSection}>
        <div className={styles.heroOverlay}></div>
        <div className={styles.heroBackground} style={{backgroundImage: "url('/hero-bg.jpg')"}}></div>
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>
            Des produits de qualité pour un style qui vous ressemble
          </h1>
          <p className={styles.heroSubtitle}>
            Découvrez notre collection exclusive et profitez d'une livraison gratuite pour toute commande de plus de 50€
          </p>
          <div className={styles.buttonContainer}>
            <Link href="/products" className={styles.primaryButton}>
              Découvrir la collection
            </Link>
            <Link href="#featured" className={styles.secondaryButton}>
              Produits phares
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className={styles.featuresSection}>
        <div className={styles.featuresContainer}>
          <div className={styles.featuresGrid}>
            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className={styles.featureTitle}>Livraison Rapide</h3>
              <p className={styles.featureDescription}>Recevez votre commande en 1-2 jours avec notre option de livraison express.</p>
            </div>
            
            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className={styles.featureTitle}>Qualité Garantie</h3>
              <p className={styles.featureDescription}>Tous nos produits sont soigneusement sélectionnés pour leur qualité et durabilité.</p>
            </div>
            
            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
              </div>
              <h3 className={styles.featureTitle}>Paiement Sécurisé</h3>
              <p className={styles.featureDescription}>Vos transactions sont protégées par les dernières technologies de sécurité.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section id="featured" className={styles.productsSection}>
        <div className="container mx-auto px-4">
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Nos produits phares</h2>
            <p className={styles.sectionDescription}>
              Découvrez notre sélection de produits de qualité. Ajoutez les articles à votre panier et finalisez votre commande en toute simplicité.
            </p>
          </div>
          
          <ProductList products={products.slice(0, 6)} showVariants={true} />
          
          <div className="text-center mt-10">
            <Link href="/products" className={styles.viewAllButton}>
              Voir tous les produits
            </Link>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className={styles.newsletterSection}>
        <div className={styles.newsletterContainer}>
          <h2 className={styles.newsletterTitle}>Restez informé</h2>
          <p className={styles.newsletterDescription}>Inscrivez-vous à notre newsletter pour recevoir nos dernières offres et nouveautés.</p>
          
          <form className={styles.newsletterForm}>
            <input 
              type="email" 
              placeholder="Votre adresse email" 
              className={styles.newsletterInput}
              required
            />
            <button 
              type="submit" 
              className={styles.newsletterButton}
            >
              S'inscrire
            </button>
          </form>
          <p className={styles.newsletterDisclaimer}>
            En vous inscrivant, vous acceptez de recevoir nos emails marketing et confirmez avoir lu notre politique de confidentialité.
          </p>
        </div>
      </section>
    </div>
  );
}

async function getProducts() {
  try {
    // Récupérer les produits depuis Strapi avec les relations
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_STRAPI_API_URL}/api/products?populate=*`,
      { cache: 'no-store' } // ou { next: { revalidate: 60 } } pour ISR
    );
    
    if (!res.ok) {
      throw new Error('Failed to fetch products');
    }
    
    const data = await res.json();
    return data.data || [];
  } catch (error) {
    console.error('Failed to fetch products:', error);
    return [];
  }
}