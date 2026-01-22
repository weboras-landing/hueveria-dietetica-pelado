"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/auth";

interface ProductFilters {
    category?: string;
    isActive?: boolean;
    isFeatured?: boolean;
    search?: string;
}

export async function getProducts(filters?: ProductFilters) {
    const supabase = await createClient();
    let query = supabase
        .from("products")
        .select("*, category:categories(name), variants:product_variants(count)")
        .order("name", { ascending: true });

    if (filters?.category) {
        query = query.eq("category_id", filters.category);
    }
    if (filters?.isActive !== undefined) {
        query = query.eq("is_active", filters.isActive);
    }
    if (filters?.isFeatured !== undefined) {
        query = query.eq("is_featured", filters.isFeatured);
    }
    if (filters?.search) {
        query = query.ilike("name", `%${filters.search}%`);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data;
}

export async function getProductById(id: string) {
    const supabase = await createClient();
    const { data: product, error: productError } = await supabase
        .from("products")
        .select("*")
        .eq("id", id)
        .single();

    if (productError) throw productError;

    const { data: variants, error: variantsError } = await supabase
        .from("product_variants")
        .select("*")
        .eq("product_id", id)
        .order("is_default", { ascending: false });

    if (variantsError) throw variantsError;

    return { ...product, variants };
}

export async function createProduct(formData: FormData) {
    await requireAdmin();
    const supabase = await createClient();

    const name = formData.get("name") as string;
    const description = formData.get("description") as string;
    const categoryId = formData.get("category_id") as string;
    const imageUrl = formData.get("image_url") as string;
    const isFeatured = formData.get("is_featured") === "true";
    const isActive = formData.get("is_active") === "true";

    // Create product
    const { data: product, error: productError } = await supabase
        .from("products")
        .insert({
            name,
            description: description || "",
            category_id: categoryId || null,
            image_url: imageUrl || null,
            is_featured: isFeatured,
            is_active: isActive,
        })
        .select()
        .single();

    if (productError) throw productError;

    // Create variants
    const variantsData = formData.get("variants") as string;
    if (variantsData) {
        const variants = JSON.parse(variantsData);
        for (const variant of variants) {
            await supabase.from("product_variants").insert({
                product_id: product.id,
                unit: variant.unit,
                price: variant.price,
                stock: variant.stock || 0,
                is_default: variant.is_default || false,
            });
        }
    }

    revalidatePath("/admin/productos");
    redirect("/admin/productos");
}

export async function updateProduct(id: string, formData: FormData) {
    await requireAdmin();
    const supabase = await createClient();

    const name = formData.get("name") as string;
    const description = formData.get("description") as string;
    const categoryId = formData.get("category_id") as string;
    const imageUrl = formData.get("image_url") as string;
    const isFeatured = formData.get("is_featured") === "true";
    const isActive = formData.get("is_active") === "true";

    // Update product
    const { error: productError } = await supabase
        .from("products")
        .update({
            name,
            description: description || "",
            category_id: categoryId || null,
            image_url: imageUrl || null,
            is_featured: isFeatured,
            is_active: isActive,
        })
        .eq("id", id);

    if (productError) throw productError;

    // Update variants
    const variantsData = formData.get("variants") as string;
    if (variantsData) {
        const variants = JSON.parse(variantsData);

        // Delete existing variants
        await supabase.from("product_variants").delete().eq("product_id", id);

        // Insert new variants
        for (const variant of variants) {
            await supabase.from("product_variants").insert({
                product_id: id,
                unit: variant.unit,
                price: variant.price,
                stock: variant.stock || 0,
                is_default: variant.is_default || false,
            });
        }
    }

    revalidatePath("/admin/productos");
    redirect("/admin/productos");
}

export async function deleteProduct(id: string) {
    await requireAdmin();
    const supabase = await createClient();

    // Delete variants first (foreign key constraint)
    await supabase.from("product_variants").delete().eq("product_id", id);

    // Delete product
    const { error } = await supabase.from("products").delete().eq("id", id);

    if (error) throw error;

    revalidatePath("/admin/productos");
}

export async function toggleProductFeatured(id: string, isFeatured: boolean) {
    await requireAdmin();
    const supabase = await createClient();

    const { error } = await supabase
        .from("products")
        .update({ is_featured: !isFeatured })
        .eq("id", id);

    if (error) throw error;

    revalidatePath("/admin/productos");
}

export async function toggleProductActive(id: string, isActive: boolean) {
    await requireAdmin();
    const supabase = await createClient();

    const { error } = await supabase
        .from("products")
        .update({ is_active: !isActive })
        .eq("id", id);

    if (error) throw error;

    revalidatePath("/admin/productos");
}
