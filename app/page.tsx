import { StoreLayout } from "@/components/store-layout";
import { HeroSection } from "@/components/hero-section";
import { CategoryCard } from "@/components/category-card";
import { HowToBuySection } from "@/components/how-to-buy-section";
import { AboutSection } from "@/components/about-section";
import { StoreInfoSection } from "@/components/store-info-section";
import { Footer } from "@/components/footer";
import { WhatsAppFloatButton } from "@/components/whatsapp-float-button";
import { getCategories, getProductsByCategory } from "@/lib/products";
import { ProductCard } from "@/components/product-card";

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const categories = await getCategories();
  const featuredProducts = await getProductsByCategory("destacados");

  return (
    <div className="min-h-screen bg-background">
      <StoreLayout>
        <HeroSection />

        <main className="container mx-auto px-4 py-8 md:py-12">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {categories.map((category) => (
              <CategoryCard key={category.id} category={category} />
            ))}
          </div>

          <section className="mt-16">
            <h2 className="mb-8 text-center text-3xl font-bold text-primary sm:text-4xl font-serif italic">
              Productos Destacados
            </h2>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {featuredProducts.length > 0 ? (
                featuredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))
              ) : (
                <p className="text-center col-span-full text-muted-foreground">Cargando productos destacados...</p>
              )}
            </div>
          </section>
        </main>

        <HowToBuySection />
        <AboutSection />
        <StoreInfoSection />
        <Footer />
        <WhatsAppFloatButton />
      </StoreLayout>
    </div>
  );
}
