import { createClient } from "@/lib/supabase/client";

export interface StockItem {
    variantId: string;
    productId: string;
    productName: string;
    variantUnit: string;
    currentStock: number;
    price: number;
    categoryName: string;
    imageUrl: string;
    isDefault: boolean;
}

export interface StockOverview {
    totalProducts: number;
    totalVariants: number;
    lowStockCount: number;
    outOfStockCount: number;
    items: StockItem[];
}

export interface StockStatus {
    status: "in_stock" | "low_stock" | "out_of_stock";
    label: string;
    color: "green" | "yellow" | "red";
}

const LOW_STOCK_THRESHOLD = 10;

/**
 * Get comprehensive stock overview for all products
 */
export async function getStockOverview(): Promise<StockOverview> {
    const supabase = createClient();

    const { data, error } = await supabase
        .from("product_variants")
        .select(`
      id,
      unit,
      price,
      stock,
      is_default,
      product:products (
        id,
        name,
        image_url,
        category:categories (
          name
        )
      )
    `)
        .order("stock", { ascending: true });

    if (error || !data) {
        console.error("Error fetching stock overview:", error);
        return {
            totalProducts: 0,
            totalVariants: 0,
            lowStockCount: 0,
            outOfStockCount: 0,
            items: [],
        };
    }

    const items: StockItem[] = data.map((variant: any) => ({
        variantId: variant.id,
        productId: variant.product.id,
        productName: variant.product.name,
        variantUnit: variant.unit,
        currentStock: variant.stock || 0,
        price: Number(variant.price),
        categoryName: variant.product.category?.name || "Sin categoría",
        imageUrl: variant.product.image_url,
        isDefault: variant.is_default || false,
    }));

    // Get unique product count
    const uniqueProducts = new Set(items.map((item) => item.productId));

    return {
        totalProducts: uniqueProducts.size,
        totalVariants: items.length,
        lowStockCount: items.filter(
            (item) => item.currentStock > 0 && item.currentStock <= LOW_STOCK_THRESHOLD
        ).length,
        outOfStockCount: items.filter((item) => item.currentStock === 0).length,
        items,
    };
}

/**
 * Get products with low stock
 */
export async function getLowStockProducts(
    threshold: number = LOW_STOCK_THRESHOLD
): Promise<StockItem[]> {
    const overview = await getStockOverview();
    return overview.items.filter(
        (item) => item.currentStock > 0 && item.currentStock <= threshold
    );
}

/**
 * Get out of stock products
 */
export async function getOutOfStockProducts(): Promise<StockItem[]> {
    const overview = await getStockOverview();
    return overview.items.filter((item) => item.currentStock === 0);
}

/**
 * Update stock for a specific variant
 */
export async function updateVariantStock(
    variantId: string,
    newStock: number
): Promise<{ success: boolean; error?: string }> {
    if (newStock < 0) {
        return { success: false, error: "Stock cannot be negative" };
    }

    const supabase = createClient();

    const { error } = await supabase
        .from("product_variants")
        .update({ stock: newStock })
        .eq("id", variantId);

    if (error) {
        console.error("Error updating stock:", error);
        return { success: false, error: error.message };
    }

    return { success: true };
}

/**
 * Check if requested quantity is available in stock
 */
export async function checkStockAvailability(
    variantId: string,
    requestedQuantity: number
): Promise<{ available: boolean; currentStock: number }> {
    const supabase = createClient();

    const { data, error } = await supabase
        .from("product_variants")
        .select("stock")
        .eq("id", variantId)
        .single();

    if (error || !data) {
        return { available: false, currentStock: 0 };
    }

    const currentStock = data.stock || 0;
    return {
        available: currentStock >= requestedQuantity,
        currentStock,
    };
}

/**
 * Get stock status for a given stock level
 */
export function getStockStatus(stock: number): StockStatus {
    if (stock === 0) {
        return {
            status: "out_of_stock",
            label: "Agotado",
            color: "red",
        };
    }

    if (stock <= LOW_STOCK_THRESHOLD) {
        return {
            status: "low_stock",
            label: "Pocas unidades",
            color: "yellow",
        };
    }

    return {
        status: "in_stock",
        label: "Disponible",
        color: "green",
    };
}

/**
 * Adjust stock by a relative amount (add or subtract)
 */
export async function adjustStock(
    variantId: string,
    adjustment: number
): Promise<{ success: boolean; newStock?: number; error?: string }> {
    const supabase = createClient();

    // Get current stock
    const { data: currentData, error: fetchError } = await supabase
        .from("product_variants")
        .select("stock")
        .eq("id", variantId)
        .single();

    if (fetchError || !currentData) {
        return { success: false, error: "Failed to fetch current stock" };
    }

    const currentStock = currentData.stock || 0;
    const newStock = currentStock + adjustment;

    if (newStock < 0) {
        return { success: false, error: "Adjustment would result in negative stock" };
    }

    const result = await updateVariantStock(variantId, newStock);

    if (result.success) {
        return { success: true, newStock };
    }

    return result;
}

/**
 * Bulk update stock for multiple variants
 */
export async function bulkUpdateStock(
    updates: Array<{ variantId: string; stock: number }>
): Promise<{ success: boolean; updated: number; errors: string[] }> {
    const errors: string[] = [];
    let updated = 0;

    for (const update of updates) {
        const result = await updateVariantStock(update.variantId, update.stock);
        if (result.success) {
            updated++;
        } else {
            errors.push(`${update.variantId}: ${result.error}`);
        }
    }

    return {
        success: errors.length === 0,
        updated,
        errors,
    };
}
