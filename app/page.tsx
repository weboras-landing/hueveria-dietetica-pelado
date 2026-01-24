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
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const categories = await getCategories();
  const featuredProducts = await getProductsByCategory("destacados");

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-gray-50/30 to-white">
      <StoreLayout>
        <HeroSection />

        <main className="container mx-auto px-5 py-12 md:py-16">
          {/* Categories Section - Beige Background */}
          <section id="categorias" className="py-12 bg-[#F0E5D8] -mx-5 px-5 animate-fade-in-up scroll-mt-20">
            <div className="text-center mb-10">
              <span className="inline-block text-xs font-bold text-primary/70 uppercase tracking-widest mb-2">
                Categorías
              </span>
              <h2 className="text-2xl md:text-3xl font-bold text-foreground">
                Nuestros Productos
              </h2>
            </div>

            <div className="px-4 md:px-12 relative">
              <Carousel
                opts={{
                  align: "start",
                  loop: true,
                }}
                className="w-full"
              >
                <CarouselContent className="-ml-2 md:-ml-4">
                  {categories.map((category) => (
                    <CarouselItem key={category.id} className="pl-2 md:pl-4 md:basis-1/2 lg:basis-1/4">
                      <div className="p-1">
                        <CategoryCard category={category} />
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious className="hidden md:flex -left-12" />
                <CarouselNext className="hidden md:flex -right-12" />
              </Carousel>
            </div>
          </section>

          {/* Featured Products Section - White Background */}
          <section className="py-12 md:py-16">
            <div className="text-center mb-10">
              <span className="inline-block text-xs font-bold text-secondary uppercase tracking-widest mb-2">
                Destacados
              </span>
              <h2 className="text-2xl md:text-3xl font-bold text-foreground">
                Productos Destacados
              </h2>
            </div>
            <div className="grid grid-cols-2 gap-5 sm:gap-6 lg:grid-cols-4">
              {featuredProducts.length > 0 ? (
                featuredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))
              ) : (
                <p className="text-center col-span-full text-muted-foreground py-8">
                  Cargando productos destacados...
                </p>
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
