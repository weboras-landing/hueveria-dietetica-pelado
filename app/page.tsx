"use client";

import { useState } from "react";
import { Header } from "@/components/header";
import { HeroSection } from "@/components/hero-section";
import { CategoryCard } from "@/components/category-card";
import { CartDrawer } from "@/components/cart-drawer";
import { HowToBuySection } from "@/components/how-to-buy-section";
import { AboutSection } from "@/components/about-section";
import { StoreInfoSection } from "@/components/store-info-section";
import { Footer } from "@/components/footer";
import { WhatsAppFloatButton } from "@/components/whatsapp-float-button";
import { categories } from "@/lib/products";

export default function HomePage() {
  const [cartOpen, setCartOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <Header onCartClick={() => setCartOpen(true)} />
      <HeroSection />

      <main className="container mx-auto px-4 py-8 md:py-12">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {categories.map((category) => (
            <CategoryCard key={category.id} category={category} />
          ))}
        </div>
      </main>

      <HowToBuySection />
      <AboutSection />
      <StoreInfoSection />
      <Footer />
      
      <WhatsAppFloatButton />
      <CartDrawer open={cartOpen} onOpenChange={setCartOpen} />
    </div>
  );
}
