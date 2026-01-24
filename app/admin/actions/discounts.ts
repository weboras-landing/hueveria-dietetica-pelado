"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import type { Discount, DiscountType } from "@/lib/types";

/**
 * Get all discounts
 */
export async function getDiscounts() {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from("discounts")
        .select(`
            *,
            product:products(id, name),
            category:categories(id, name)
        `)
        .order("created_at", { ascending: false });

    if (error) {
        console.error("Error fetching discounts:", error);
        return [];
    }

    return data;
}

/**
 * Get active discounts
 */
export async function getActiveDiscounts() {
    const supabase = await createClient();

    const now = new Date().toISOString();

    const { data, error } = await supabase
        .from("discounts")
        .select("*")
        .eq("is_active", true)
        .or(`expires_at.is.null,expires_at.gt.${now}`)
        .or(`starts_at.is.null,starts_at.lt.${now}`);

    if (error) {
        console.error("Error fetching active discounts:", error);
        return [];
    }

    return data as Discount[];
}

/**
 * Get discount by code
 */
export async function getDiscountByCode(code: string) {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from("discounts")
        .select("*")
        .eq("code", code.toUpperCase())
        .single();

    if (error) {
        return null;
    }

    return data as Discount;
}

/**
 * Validate discount code for cart
 */
export async function validateDiscountCode(code: string, subtotal: number) {
    const supabase = await createClient();

    const now = new Date().toISOString();

    const { data: discount, error } = await supabase
        .from("discounts")
        .select("*")
        .eq("code", code.toUpperCase())
        .eq("is_active", true)
        .single();

    if (error || !discount) {
        return { valid: false, error: "Código de descuento no válido" };
    }

    // Check if expired
    if (discount.expires_at && new Date(discount.expires_at) < new Date()) {
        return { valid: false, error: "Este código ha expirado" };
    }

    // Check if not started
    if (discount.starts_at && new Date(discount.starts_at) > new Date()) {
        return { valid: false, error: "Este código aún no está disponible" };
    }

    // Check minimum purchase
    if (discount.min_purchase && subtotal < discount.min_purchase) {
        return {
            valid: false,
            error: `Compra mínima de $${discount.min_purchase} requerida`,
        };
    }

    // Check max uses
    if (discount.max_uses && discount.current_uses >= discount.max_uses) {
        return { valid: false, error: "Este código ha alcanzado su límite de usos" };
    }

    return { valid: true, discount };
}

/**
 * Create a new discount
 */
export async function createDiscount(
    discountData: Omit<Discount, "id" | "current_uses" | "created_at" | "updated_at">
) {
    const supabase = await createClient();

    // Ensure code is uppercase
    const data = {
        ...discountData,
        code: discountData.code.toUpperCase(),
    };

    const { data: discount, error } = await supabase
        .from("discounts")
        .insert(data)
        .select()
        .single();

    if (error) {
        console.error("Error creating discount:", error);
        return { success: false, error: "Error al crear el descuento" };
    }

    revalidatePath("/admin/descuentos");
    return { success: true, discount };
}

/**
 * Update discount
 */
export async function updateDiscount(
    discountId: string,
    updates: Partial<Discount>
) {
    const supabase = await createClient();

    // Ensure code is uppercase if being updated
    if (updates.code) {
        updates.code = updates.code.toUpperCase();
    }

    const { error } = await supabase
        .from("discounts")
        .update(updates)
        .eq("id", discountId);

    if (error) {
        console.error("Error updating discount:", error);
        return { success: false, error: "Error al actualizar el descuento" };
    }

    revalidatePath("/admin/descuentos");
    return { success: true };
}

/**
 * Delete discount
 */
export async function deleteDiscount(discountId: string) {
    const supabase = await createClient();

    const { error } = await supabase
        .from("discounts")
        .delete()
        .eq("id", discountId);

    if (error) {
        console.error("Error deleting discount:", error);
        return { success: false, error: "Error al eliminar el descuento" };
    }

    revalidatePath("/admin/descuentos");
    return { success: true };
}

/**
 * Toggle discount active status
 */
export async function toggleDiscountStatus(discountId: string, isActive: boolean) {
    const supabase = await createClient();

    const { error } = await supabase
        .from("discounts")
        .update({ is_active: isActive })
        .eq("id", discountId);

    if (error) {
        console.error("Error toggling discount status:", error);
        return { success: false, error: "Error al cambiar el estado" };
    }

    revalidatePath("/admin/descuentos");
    return { success: true };
}


