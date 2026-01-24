import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/client";

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get("q");

    if (!query || query.trim().length < 2) {
        return NextResponse.json({ products: [] });
    }

    const supabase = createClient();

    const { data: products, error } = await supabase
        .from("products")
        .select(`
            *,
            category:categories(*),
            variants:product_variants(*)
        `)
        .eq("is_active", true)
        .ilike("name", `%${query}%`)
        .limit(10);

    if (error) {
        console.error("Search error:", error);
        return NextResponse.json({ products: [] });
    }

    // Map products to the expected format
    const mappedProducts = products.map((item: any) => {
        const defaultVariant = item.variants?.find((v: any) => v.is_default) || item.variants?.[0];

        return {
            id: item.id,
            name: item.name,
            description: item.description,
            price: defaultVariant ? Number(defaultVariant.price) : 0,
            unit: defaultVariant ? defaultVariant.unit : "u",
            category: item.category?.slug || "uncategorized",
            image: item.image_url,
            variants: item.variants?.map((v: any) => ({
                id: v.id,
                unit: v.unit,
                price: Number(v.price),
                stock: v.stock || 0,
            })),
        };
    });

    return NextResponse.json({ products: mappedProducts });
}
