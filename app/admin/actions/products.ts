"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

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
        price: item.variants?.[0]?.price || 0,
        unit: item.variants?.[0]?.unit || "u",
        category: item.category?.slug || "uncategorized",
        image: item.image_url,
        image_url: item.image_url,
        is_active: item.is_active,
        is_featured: item.is_featured,
        category_id: item.category_id,
        variants: item.variants,
    }));
}

export async function getProductById(id: string) {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from("products")
        .select(`
            *,
            variants:product_variants(*)
        `)
        .eq("id", id)
        .single();

    if (error) {
        console.error("Error fetching product:", error);
        throw new Error("Product not found");
    }

    return data;
}

export async function createProduct(formData: FormData) {
    const supabase = await createClient();

    const name = formData.get("name") as string;
    const description = formData.get("description") as string;
    const categoryId = formData.get("category_id") as string;
    const imageUrl = formData.get("image_url") as string;
    const isFeatured = formData.get("is_featured") === "true";
    const isActive = formData.get("is_active") === "true";
    const variantsJson = formData.get("variants") as string;

    // Insert product
    const { data: product, error: productError } = await supabase
        .from("products")
        .insert({
            name,
            description: description || null,
            category_id: categoryId || null,
            image_url: imageUrl || null,
            is_featured: isFeatured,
            is_active: isActive,
        })
        .select()
        .single();

    if (productError) {
        console.error("Error creating product:", productError);
        throw new Error("Failed to create product");
    }

    // Insert variants
    if (variantsJson) {
        const variants = JSON.parse(variantsJson);
        const variantsToInsert = variants.map((v: any) => ({
            product_id: product.id,
            unit: v.unit,
            price: parseFloat(v.price),
            stock: parseInt(v.stock),
            is_default: v.is_default,
        }));

        const { error: variantsError } = await supabase
            .from("product_variants")
            .insert(variantsToInsert);

        if (variantsError) {
            console.error("Error creating variants:", variantsError);
        }
    }

    revalidatePath("/admin/productos");
    redirect("/admin/productos");
}

export async function updateProduct(id: string, formData: FormData) {
    const supabase = await createClient();

    const name = formData.get("name") as string;
    const description = formData.get("description") as string;
    const categoryId = formData.get("category_id") as string;
    const imageUrl = formData.get("image_url") as string;
    const isFeatured = formData.get("is_featured") === "true";
    const isActive = formData.get("is_active") === "true";
    const variantsJson = formData.get("variants") as string;

    // Update product
    const { error: productError } = await supabase
        .from("products")
        .update({
            name,
            description: description || null,
            category_id: categoryId || null,
            image_url: imageUrl || null,
            is_featured: isFeatured,
            is_active: isActive,
        })
        .eq("id", id);

    if (productError) {
        console.error("Error updating product:", productError);
        throw new Error("Failed to update product");
    }

    // Update variants - delete old ones and insert new ones
    if (variantsJson) {
        // Delete existing variants
        await supabase
            .from("product_variants")
            .delete()
            .eq("product_id", id);

        // Insert new variants
        const variants = JSON.parse(variantsJson);
        const variantsToInsert = variants.map((v: any) => ({
            product_id: id,
            unit: v.unit,
            price: parseFloat(v.price),
            stock: parseInt(v.stock),
            is_default: v.is_default,
        }));

        const { error: variantsError } = await supabase
            .from("product_variants")
            .insert(variantsToInsert);

        if (variantsError) {
            console.error("Error updating variants:", variantsError);
        }
    }

    revalidatePath("/admin/productos");
    redirect("/admin/productos");
}

export async function deleteProduct(id: string) {
    const supabase = await createClient();

    // Delete variants first (foreign key constraint)
    await supabase
        .from("product_variants")
        .delete()
        .eq("product_id", id);

    // Delete product
    const { error } = await supabase
        .from("products")
        .delete()
        .eq("id", id);

    if (error) {
        console.error("Error deleting product:", error);
        throw new Error("Failed to delete product");
    }

    revalidatePath("/admin/productos");
}

export async function toggleProductActive(productId: string, currentValue: boolean) {
    const supabase = await createClient();

    const { error } = await supabase
        .from("products")
        .update({ is_active: !currentValue })
        .eq("id", productId);

    if (error) {
        console.error("Error toggling product active:", error);
        throw new Error("Failed to toggle product active status");
    }

    revalidatePath("/admin/productos");
}

export async function toggleProductFeatured(productId: string, currentValue: boolean) {
    const supabase = await createClient();

    const { error } = await supabase
        .from("products")
        .update({ is_featured: !currentValue })
        .eq("id", productId);

    if (error) {
        console.error("Error toggling product featured:", error);
        throw new Error("Failed to toggle product featured status");
    }

    revalidatePath("/admin/productos");
}
