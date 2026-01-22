"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/auth";

export async function getCategories() {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from("categories")
        .select("*")
        .order("name", { ascending: true });

    if (error) throw error;
    return data;
}

export async function getCategoryById(id: string) {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from("categories")
        .select("*")
        .eq("id", id)
        .single();

    if (error) throw error;
    return data;
}

export async function createCategory(formData: FormData) {
    await requireAdmin();

    const name = formData.get("name") as string;
    const slug = formData.get("slug") as string;
    const tag = formData.get("tag") as string;
    const imageUrl = formData.get("image_url") as string;

    const supabase = await createClient();
    const { error } = await supabase.from("categories").insert({
        name,
        slug,
        tag: tag || null,
        image_url: imageUrl || null,
    });

    if (error) throw error;

    revalidatePath("/admin/categorias");
    redirect("/admin/categorias");
}

export async function updateCategory(id: string, formData: FormData) {
    await requireAdmin();

    const name = formData.get("name") as string;
    const slug = formData.get("slug") as string;
    const tag = formData.get("tag") as string;
    const imageUrl = formData.get("image_url") as string;

    const supabase = await createClient();
    const { error } = await supabase
        .from("categories")
        .update({
            name,
            slug,
            tag: tag || null,
            image_url: imageUrl || null,
        })
        .eq("id", id);

    if (error) throw error;

    revalidatePath("/admin/categorias");
    redirect("/admin/categorias");
}

export async function deleteCategory(id: string) {
    await requireAdmin();

    const supabase = await createClient();

    // Check if category has products
    const { count } = await supabase
        .from("products")
        .select("*", { count: "exact", head: true })
        .eq("category_id", id);

    if (count && count > 0) {
        throw new Error(
            "No se puede eliminar una categoría con productos asociados"
        );
    }

    const { error } = await supabase.from("categories").delete().eq("id", id);

    if (error) throw error;

    revalidatePath("/admin/categorias");
}
