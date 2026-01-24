import type { Discount } from "@/lib/types";

/**
 * Calculate discount amount for cart
 * This is a pure utility function (not a server action)
 */
export function calculateDiscountAmount(
    discount: Discount,
    subtotal: number,
    items?: any[]
): number {
    if (discount.type === "percentage") {
        return (subtotal * discount.value) / 100;
    } else if (discount.type === "fixed") {
        return Math.min(discount.value, subtotal);
    } else if (discount.type === "product" && discount.applies_to_product_id && items) {
        // Apply discount only to specific product
        const productItems = items.filter(
            (item) => item.product.id === discount.applies_to_product_id
        );
        const productSubtotal = productItems.reduce(
            (sum, item) => sum + item.product.price * item.quantity,
            0
        );
        return (productSubtotal * discount.value) / 100;
    } else if (discount.type === "category" && discount.applies_to_category_id && items) {
        // Apply discount only to products in specific category
        const categoryItems = items.filter(
            (item) => item.product.category === discount.applies_to_category_id
        );
        const categorySubtotal = categoryItems.reduce(
            (sum, item) => sum + item.product.price * item.quantity,
            0
        );
        return (categorySubtotal * discount.value) / 100;
    }

    return 0;
}
