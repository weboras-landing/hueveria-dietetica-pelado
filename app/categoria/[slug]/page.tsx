import { getCategories, getCategoryBySlug, getProductsByCategory } from "@/lib/products";
import { CategoryPageClient } from "./category-page-client";
import { notFound } from "next/navigation";

interface CategoryPageProps {
  params: Promise<{ slug: string }>;
}

// Enable dynamic params to allow new categories without rebuild
export const dynamicParams = true;

// Revalidate every 60 seconds to ensure fresh data
export const revalidate = 60;

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params;

  // Parallel fetch for better performance
  const [category, products] = await Promise.all([
    getCategoryBySlug(slug),
    getProductsByCategory(slug)
  ]);

  if (!category) {
    notFound();
  }

  return <CategoryPageClient category={category} products={products} />;
}

export async function generateStaticParams() {
  const categories = await getCategories();
  return categories.map((category) => ({
    slug: category.slug,
  }));
}
