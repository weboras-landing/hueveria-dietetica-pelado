import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const supabase = createClient(supabaseUrl, supabaseKey);

// --- INLINED DATA TO AVOID TS-NODE IMPORT ISSUES ---

interface ProductVariant {
    id: string;
    unit: string;
    price: number;
}

interface Product {
    id: string;
    name: string;
    price: number;
    unit: string;
    category: string;
    image: string;
    variants?: ProductVariant[];
}

interface Category {
    id: string;
    name: string;
    slug: string;
    image: string;
    tag?: string;
}

const categories: Category[] = [
    {
        id: "1",
        name: "Huevos",
        slug: "huevos",
        image: "/images/categoria-huevos.jpg",
        tag: "Mas vendido",
    },
    {
        id: "2",
        name: "Frutos Secos",
        slug: "frutos-secos",
        image: "/images/categoria-frutos-secos.jpg",
        tag: "Stock permanente",
    },
    {
        id: "3",
        name: "Semillas",
        slug: "semillas",
        image: "/images/categoria-semillas.jpg",
    },
    {
        id: "4",
        name: "Legumbres",
        slug: "legumbres",
        image: "/images/categoria-legumbres.jpg",
        tag: "Stock permanente",
    },
];

const products: Product[] = [
    // Huevos
    {
        id: "h1",
        name: "Huevos de Campo x 6",
        price: 1200,
        unit: "media docena",
        category: "huevos",
        image: "/images/huevos-campo-6.jpg",
    },
    {
        id: "h2",
        name: "Huevos de Campo x 12",
        price: 2200,
        unit: "docena",
        category: "huevos",
        image: "/images/huevos-campo-12.jpg",
    },
    {
        id: "h3",
        name: "Huevos de Campo x 30",
        price: 5000,
        unit: "maple",
        category: "huevos",
        image: "/images/huevos-campo-30.jpg",
    },
    {
        id: "h4",
        name: "Huevos Blancos x 12",
        price: 1800,
        unit: "docena",
        category: "huevos",
        image: "/images/huevos-blancos-12.jpg",
    },
    // Frutos Secos
    {
        id: "f1",
        name: "Almendras",
        price: 3500,
        unit: "250g",
        category: "frutos-secos",
        image: "/images/almendras.jpg",
    },
    {
        id: "f2",
        name: "Nueces",
        price: 3200,
        unit: "250g",
        category: "frutos-secos",
        image: "/images/nueces.jpg",
    },
    {
        id: "f3",
        name: "Castanas de Caju",
        price: 4000,
        unit: "250g",
        category: "frutos-secos",
        image: "/images/castanas-caju.jpg",
    },
    {
        id: "f4",
        name: "Mani Tostado",
        price: 1500,
        unit: "500g",
        category: "frutos-secos",
        image: "/images/mani-tostado.jpg",
    },
    {
        id: "f5",
        name: "Avellanas",
        price: 4500,
        unit: "250g",
        category: "frutos-secos",
        image: "/images/avellanas.jpg",
    },
    // Semillas
    {
        id: "s1",
        name: "Semillas de Chia",
        price: 1800,
        unit: "500g",
        category: "semillas",
        image: "/images/semillas-chia.jpg",
    },
    {
        id: "s2",
        name: "Semillas de Lino",
        price: 1200,
        unit: "500g",
        category: "semillas",
        image: "/images/semillas-lino.jpg",
    },
    {
        id: "s3",
        name: "Semillas de Girasol",
        price: 1000,
        unit: "500g",
        category: "semillas",
        image: "/images/semillas-girasol.jpg",
    },
    {
        id: "s4",
        name: "Semillas de Sesamo",
        price: 1400,
        unit: "500g",
        category: "semillas",
        image: "/images/semillas-sesamo.jpg",
    },
    {
        id: "s5",
        name: "Mix de Semillas",
        price: 2000,
        unit: "500g",
        category: "semillas",
        image: "/images/mix-semillas.jpg",
    },
    // Legumbres
    {
        id: "l1",
        name: "Lentejas",
        price: 1200,
        unit: "500g",
        category: "legumbres",
        image: "/images/lentejas.jpg",
    },
    {
        id: "l2",
        name: "Garbanzos",
        price: 1400,
        unit: "500g",
        category: "legumbres",
        image: "/images/garbanzos.jpg",
    },
    {
        id: "l3",
        name: "Porotos Negros",
        price: 1300,
        unit: "500g",
        category: "legumbres",
        image: "/images/porotos-negros.jpg",
    },
    {
        id: "l4",
        name: "Porotos Blancos",
        price: 1300,
        unit: "500g",
        category: "legumbres",
        image: "/images/porotos-blancos.jpg",
    },
    {
        id: "l5",
        name: "Arvejas Secas",
        price: 1100,
        unit: "500g",
        category: "legumbres",
        image: "/images/arvejas-secas.jpg",
    },

    // Productos Destacados (Demo con Variantes)
    {
        id: "d1",
        name: "Almendras Non Pareil",
        price: 3500,
        unit: "250g",
        category: "destacados",
        image: "/images/almendras.jpg",
        variants: [
            { id: "v1-1", unit: "250g", price: 3500 },
            { id: "v1-2", unit: "500g", price: 6800 },
            { id: "v1-3", unit: "1kg", price: 13000 },
        ]
    },
    {
        id: "d2",
        name: "Nueces Mariposa",
        price: 3200,
        unit: "250g",
        category: "destacados",
        image: "/images/nueces.jpg",
        variants: [
            { id: "v2-1", unit: "250g", price: 3200 },
            { id: "v2-2", unit: "500g", price: 6000 },
            { id: "v2-3", unit: "1kg", price: 11500 },
        ]
    },
    {
        id: "d3",
        name: "Huevos de Campo",
        price: 1200,
        unit: "media docena",
        category: "destacados",
        image: "/images/huevos-campo-6.jpg",
        variants: [
            { id: "v3-1", unit: "media docena", price: 1200 },
            { id: "v3-2", unit: "docena", price: 2200 },
            { id: "v3-3", unit: "maple (30)", price: 5000 },
        ]
    },
    {
        id: "d4",
        name: "Mix Energético",
        price: 2500,
        unit: "250g",
        category: "destacados",
        image: "/images/mix-semillas.jpg",
        variants: [
            { id: "v4-1", unit: "250g", price: 2500 },
            { id: "v4-2", unit: "500g", price: 4800 },
            { id: "v4-3", unit: "1kg", price: 9000 },
        ]
    },
];

async function seed() {
    console.log("Seeding data...");

    // 1. Seed Categories
    console.log("Seeding categories...");
    for (const category of categories) {
        const { error } = await supabase.from("categories").upsert(
            {
                slug: category.slug,
                name: category.name,
                image_url: category.image,
                tag: category.tag,
            },
            { onConflict: "slug" }
        );
        if (error) console.error("Error inserting category:", category.name, error);
    }

    // 2. Fetch Category IDs map
    const { data: dbCategories } = await supabase.from("categories").select("id, slug");
    const categoryMap = new Map((dbCategories || []).map((c) => [c.slug, c.id]));

    // 3. Seed Products and Variants
    console.log("Seeding products...");
    for (const product of products) {
        const categoryId = categoryMap.get(product.category);

        // Check if it's a "destacados" logic item that needs special handling or if we just want to add it as featured
        // For now we just insert. If categoryId is undefined, it will be NULL (uncategorized)

        const { data: dbProduct, error: prodError } = await supabase
            .from("products")
            .upsert(
                {
                    name: product.name,
                    description: "", // Static data has no description
                    category_id: categoryId || null,
                    image_url: product.image,
                    is_featured: product.category === "destacados",
                    is_active: true,
                },
                { onConflict: "name" }
            )
            .select("id")
            .single();

        if (prodError) {
            console.error("Error inserting product:", product.name, prodError);
            continue;
        }

        if (!dbProduct) continue;

        // 4. Seed Variants
        // First, clear existing variants for this product to avoid duplication/conflicts during re-seed
        await supabase.from("product_variants").delete().eq("product_id", dbProduct.id);

        if (product.variants && product.variants.length > 0) {
            for (const variant of product.variants) {
                await supabase.from("product_variants").insert({
                    product_id: dbProduct.id,
                    unit: variant.unit,
                    price: variant.price,
                    is_default: false,
                });
            }
        } else {
            // Create a default variant from the main product info
            await supabase.from("product_variants").insert({
                product_id: dbProduct.id,
                unit: product.unit,
                price: product.price,
                is_default: true,
            });
        }
    }

    console.log("Seeding complete!");
}

seed();
