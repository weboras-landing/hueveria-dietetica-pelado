import { createClient } from "@/lib/supabase/client";

export interface Product {
  id: string;
  name: string;
  description?: string;
  price: number;
  unit: string;
  category: string;
  image: string;
  image_url?: string; // For admin/compatibility
  is_active?: boolean;
  variants?: ProductVariant[];
}

export interface ProductVariant {
  id: string;
  unit: string;
  price: number;
  stock: number;
  is_default?: boolean;
}


export interface Category {
  id: string;
  name: string;
  slug: string;
  image: string;
  tag?: string;
}

export async function getCategories(): Promise<Category[]> {
  const supabase = createClient();
  const { data } = await supabase
    .from("categories")
    .select("*")
    .order("created_at", { ascending: true });

  if (!data) return [];

  return data.map((cat: any) => ({
    id: cat.id,
    name: cat.name,
    slug: cat.slug,
    image: cat.image_url,
    tag: cat.tag,
  }));
}

export async function getProductsByCategory(slug: string): Promise<Product[]> {
  const supabase = createClient();

  // Handling "destacados" (featured) separately as it might not be a real category in DB table if we didn't insert it
  if (slug === "destacados") {
    const { data, error } = await supabase
      .from("products")
      .select(`
        *,
        category:categories(*),
        variants:product_variants(*)
      `)
      .eq("is_featured", true)
      .eq("is_active", true);

    if (error || !data) return [];
    return mapProducts(data);
  }

  // Get category by slug first to get ID
  const { data: category } = await supabase
    .from("categories")
    .select("id")
    .eq("slug", slug)
    .single();

  if (!category) return [];

  const { data, error } = await supabase
    .from("products")
    .select(`
      *,
      category:categories(*),
      variants:product_variants(*)
    `)
    .eq("category_id", category.id)
    .eq("is_active", true);

  if (error || !data) return [];

  return mapProducts(data);
}

export async function getCategoryBySlug(slug: string): Promise<Category | undefined> {
  const supabase = createClient();
  const { data } = await supabase
    .from("categories")
    .select("*")
    .eq("slug", slug)
    .single();

  if (!data) return undefined;

  return {
    id: data.id,
    name: data.name,
    slug: data.slug,
    image: data.image_url,
    tag: data.tag,
  };
}

function mapProducts(data: any[]): Product[] {
  return data.map((item) => {
    // Find default variant or first variant for base price/unit
    const defaultVariant = item.variants?.find((v: any) => v.is_default) || item.variants?.[0];

    return {
      id: item.id,
      name: item.name,
      description: item.description,
      // Use default variant price if available, otherwise 0 or base fields if we had them (DB schema moved price to variants usually)
      // In our seed we put price in variants. 
      price: defaultVariant ? Number(defaultVariant.price) : 0,
      unit: defaultVariant ? defaultVariant.unit : "u",
      category: item.category?.slug || "uncategorized",
      image: item.image_url,
      variants: item.variants?.map((v: any) => ({
        id: v.id,
        unit: v.unit,
        price: Number(v.price),
        stock: v.stock || 0,
      })).sort((a: any, b: any) => a.price - b.price), // Sort variants by price
    };
  });
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
  }).format(price);
}

// Remove static arrays exports as they are meant to be replaced
// export const categories = ...
// export const products = ...
