"use server";

import { revalidatePath } from "next/cache";
import { updateVariantStock, adjustStock, bulkUpdateStock } from "@/lib/stock";

export async function updateStockAction(variantId: string, newStock: number) {
    try {
        const result = await updateVariantStock(variantId, newStock);

        if (result.success) {
            revalidatePath("/admin/inventario");
            revalidatePath("/admin/productos");
            revalidatePath("/");
            return { success: true };
        }

        return { success: false, error: result.error };
    } catch (error) {
        console.error("Error in updateStockAction:", error);
        return { success: false, error: "Failed to update stock" };
    }
}

export async function adjustStockAction(variantId: string, adjustment: number) {
    try {
        const result = await adjustStock(variantId, adjustment);

        if (result.success) {
            revalidatePath("/admin/inventario");
            revalidatePath("/admin/productos");
            revalidatePath("/");
            return { success: true, newStock: result.newStock };
        }

        return { success: false, error: result.error };
    } catch (error) {
        console.error("Error in adjustStockAction:", error);
        return { success: false, error: "Failed to adjust stock" };
    }
}

export async function bulkUpdateStockAction(
    updates: Array<{ variantId: string; stock: number }>
) {
    try {
        const result = await bulkUpdateStock(updates);

        if (result.success || result.updated > 0) {
            revalidatePath("/admin/inventario");
            revalidatePath("/admin/productos");
            revalidatePath("/");
        }

        return result;
    } catch (error) {
        console.error("Error in bulkUpdateStockAction:", error);
        return {
            success: false,
            updated: 0,
            errors: ["Failed to perform bulk update"],
        };
    }
}
