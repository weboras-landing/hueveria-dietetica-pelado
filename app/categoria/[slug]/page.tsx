import { categories } from "@/lib/products";
import { CategoryPageClient } from "./category-page-client";

interface CategoryPageProps {
  params: Promise<{ slug: string }>;
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params;
  return <CategoryPageClient slug={slug} />;
}

export function generateStaticParams() {
  return categories.map((category) => ({
    slug: category.slug,
  }));
}
