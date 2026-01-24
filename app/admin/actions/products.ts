"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function getProducts() {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from("products")
        .select(`
            *,
            category:categories(*),
            variants:product_variants(*)
        `)
        .order("created_at", { ascending: false });

    if (error) {
        console.error("Error fetching products:", error);
        return [];
    }

    return data.map((item) => ({
        id: item.id,
        name: item.name,
        description: item.description,
        price: item.variants?.[0]?.price || 0, // Fallback
        unit: item.variants?.[0]?.unit || "u",
        category: item.category?.slug || "uncategorized",
        image: item.image_url, // Map to interface requirement
        image_url: item.image_url,
        is_active: item.is_active,
        variants: item.variants,
    }));
}
