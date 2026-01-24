"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import type { CreateOrderData, Order, OrderStatus } from "@/lib/types";
import { calculateDiscountAmount } from "@/lib/discount-utils";

/**
 * Get all orders with customer and items data
 */
export async function getOrders() {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from("orders")
        .select(`
            *,
            customer:customers(*),
            items:order_items(*)
        `)
        .order("created_at", { ascending: false });

    if (error) {
        console.error("Error fetching orders:", error);
        return [];
    }

    return data as Order[];
}

/**
 * Get a single order by ID
 */
export async function getOrderById(id: string) {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from("orders")
        .select(`
            *,
            customer:customers(*),
            items:order_items(*)
        `)
        .eq("id", id)
        .single();

    if (error) {
        console.error("Error fetching order:", error);
        return null;
    }

    return data as Order;
}

/**
 * Get orders by status
 */
export async function getOrdersByStatus(status: OrderStatus) {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from("orders")
        .select(`
            *,
            customer:customers(*),
            items:order_items(*)
        `)
        .eq("status", status)
        .order("created_at", { ascending: false });

    if (error) {
        console.error("Error fetching orders by status:", error);
        return [];
    }

    return data as Order[];
}

/**
 * Create a new order
 */
export async function createOrder(orderData: CreateOrderData) {
    const supabase = await createClient();

    try {
        // Calculate totals
        const subtotal = orderData.items.reduce(
            (sum, item) => sum + item.unit_price * item.quantity,
            0
        );

        // Apply discount if provided
        let discountAmount = 0;
        if (orderData.discount_code) {
            const discount = await validateDiscount(orderData.discount_code, subtotal);
            if (discount) {
                discountAmount = calculateDiscountAmount(discount, subtotal, orderData.items);
            }
        }

        // Calculate delivery fee
        const deliveryFee = orderData.delivery_option === "delivery" ? 500 : 0; // TODO: Get from settings

        const total = subtotal - discountAmount + deliveryFee;

        // Check if customer exists by phone
        let customerId: string | undefined;
        if (orderData.customer_phone) {
            const { data: existingCustomer } = await supabase
                .from("customers")
                .select("id")
                .eq("phone", orderData.customer_phone)
                .single();

            if (existingCustomer) {
                customerId = existingCustomer.id;
            } else {
                // Create new customer
                const { data: newCustomer } = await supabase
                    .from("customers")
                    .insert({
                        name: orderData.customer_name,
                        phone: orderData.customer_phone,
                        address: orderData.customer_address,
                    })
                    .select()
                    .single();

                if (newCustomer) {
                    customerId = newCustomer.id;
                }
            }
        }

        // Create order
        const { data: order, error: orderError } = await supabase
            .from("orders")
            .insert({
                customer_id: customerId,
                customer_name: orderData.customer_name,
                customer_phone: orderData.customer_phone,
                customer_address: orderData.customer_address,
                delivery_option: orderData.delivery_option,
                subtotal,
                discount_amount: discountAmount,
                delivery_fee: deliveryFee,
                total,
                discount_code: orderData.discount_code,
                notes: orderData.notes,
                status: "pending",
            })
            .select()
            .single();

        if (orderError) throw orderError;

        // Create order items
        const orderItems = orderData.items.map((item) => ({
            order_id: order.id,
            product_id: item.product_id,
            variant_id: item.variant_id,
            product_name: item.product_name,
            variant_name: item.variant_name,
            quantity: item.quantity,
            unit_price: item.unit_price,
            subtotal: item.unit_price * item.quantity,
        }));

        const { error: itemsError } = await supabase
            .from("order_items")
            .insert(orderItems);

        if (itemsError) throw itemsError;

        // Update discount usage if applicable
        if (orderData.discount_code) {
            await supabase.rpc("increment_discount_usage", {
                discount_code: orderData.discount_code,
            });
        }

        revalidatePath("/admin/pedidos");
        return { success: true, order };
    } catch (error) {
        console.error("Error creating order:", error);
        return { success: false, error: "Error al crear el pedido" };
    }
}

/**
 * Update order status
 */
export async function updateOrderStatus(orderId: string, status: OrderStatus) {
    const supabase = await createClient();

    const updateData: any = { status };

    // If status is delivered, set delivered_at
    if (status === "delivered") {
        updateData.delivered_at = new Date().toISOString();
    }

    const { error } = await supabase
        .from("orders")
        .update(updateData)
        .eq("id", orderId);

    if (error) {
        console.error("Error updating order status:", error);
        return { success: false, error: "Error al actualizar el estado" };
    }

    revalidatePath("/admin/pedidos");
    revalidatePath(`/admin/pedidos/${orderId}`);
    return { success: true };
}

/**
 * Update order
 */
export async function updateOrder(
    orderId: string,
    updates: Partial<Order>
) {
    const supabase = await createClient();

    const { error } = await supabase
        .from("orders")
        .update(updates)
        .eq("id", orderId);

    if (error) {
        console.error("Error updating order:", error);
        return { success: false, error: "Error al actualizar el pedido" };
    }

    revalidatePath("/admin/pedidos");
    revalidatePath(`/admin/pedidos/${orderId}`);
    return { success: true };
}

/**
 * Delete order
 */
export async function deleteOrder(orderId: string) {
    const supabase = await createClient();

    const { error } = await supabase.from("orders").delete().eq("id", orderId);

    if (error) {
        console.error("Error deleting order:", error);
        return { success: false, error: "Error al eliminar el pedido" };
    }

    revalidatePath("/admin/pedidos");
    return { success: true };
}

/**
 * Validate discount code
 */
async function validateDiscount(code: string, subtotal: number) {
    const supabase = await createClient();

    const { data: discount } = await supabase
        .from("discounts")
        .select("*")
        .eq("code", code)
        .eq("is_active", true)
        .single();

    if (!discount) return null;

    // Check if expired
    if (discount.expires_at && new Date(discount.expires_at) < new Date()) {
        return null;
    }

    // Check if not started
    if (discount.starts_at && new Date(discount.starts_at) > new Date()) {
        return null;
    }

    // Check minimum purchase
    if (discount.min_purchase && subtotal < discount.min_purchase) {
        return null;
    }

    // Check max uses
    if (
        discount.max_uses &&
        discount.current_uses >= discount.max_uses
    ) {
        return null;
    }

    return discount;
}

/**
 * Get order statistics
 */
export async function getOrderStatistics(period: "today" | "week" | "month" | "all" = "all") {
    const supabase = await createClient();

    let query = supabase
        .from("orders")
        .select("*")
        .neq("status", "cancelled");

    // Filter by period
    const now = new Date();
    if (period === "today") {
        const startOfDay = new Date(now.setHours(0, 0, 0, 0)).toISOString();
        query = query.gte("created_at", startOfDay);
    } else if (period === "week") {
        const startOfWeek = new Date(now.setDate(now.getDate() - 7)).toISOString();
        query = query.gte("created_at", startOfWeek);
    } else if (period === "month") {
        const startOfMonth = new Date(now.setDate(now.getDate() - 30)).toISOString();
        query = query.gte("created_at", startOfMonth);
    }

    const { data: orders } = await query;

    if (!orders) {
        return {
            totalOrders: 0,
            totalRevenue: 0,
            averageOrderValue: 0,
            deliveredOrders: 0,
        };
    }

    const totalOrders = orders.length;
    const totalRevenue = orders.reduce((sum, order) => sum + Number(order.total), 0);
    const deliveredOrders = orders.filter((o) => o.status === "delivered").length;
    const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

    return {
        totalOrders,
        totalRevenue,
        averageOrderValue,
        deliveredOrders,
    };
}
