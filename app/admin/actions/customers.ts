"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import type { Customer } from "@/lib/types";

/**
 * Get all customers
 */
export async function getCustomers() {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from("customers")
        .select("*")
        .order("created_at", { ascending: false });

    if (error) {
        console.error("Error fetching customers:", error);
        return [];
    }

    return data as Customer[];
}

/**
 * Get a single customer by ID with order history
 */
export async function getCustomerById(id: string) {
    const supabase = await createClient();

    const { data: customer, error } = await supabase
        .from("customers")
        .select(`
            *,
            orders:orders(
                *,
                items:order_items(*)
            )
        `)
        .eq("id", id)
        .single();

    if (error) {
        console.error("Error fetching customer:", error);
        return null;
    }

    return customer;
}

/**
 * Get frequent customers
 */
export async function getFrequentCustomers() {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from("customers")
        .select("*")
        .eq("is_frequent", true)
        .order("total_spent", { ascending: false });

    if (error) {
        console.error("Error fetching frequent customers:", error);
        return [];
    }

    return data as Customer[];
}

/**
 * Create a new customer
 */
export async function createCustomer(customerData: Omit<Customer, "id" | "is_frequent" | "total_orders" | "total_spent" | "last_order_at" | "created_at" | "updated_at">) {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from("customers")
        .insert(customerData)
        .select()
        .single();

    if (error) {
        console.error("Error creating customer:", error);
        return { success: false, error: "Error al crear el cliente" };
    }

    revalidatePath("/admin/clientes");
    return { success: true, customer: data };
}

/**
 * Update customer
 */
export async function updateCustomer(
    customerId: string,
    updates: Partial<Customer>
) {
    const supabase = await createClient();

    const { error } = await supabase
        .from("customers")
        .update(updates)
        .eq("id", customerId);

    if (error) {
        console.error("Error updating customer:", error);
        return { success: false, error: "Error al actualizar el cliente" };
    }

    revalidatePath("/admin/clientes");
    revalidatePath(`/admin/clientes/${customerId}`);
    return { success: true };
}

/**
 * Delete customer
 */
export async function deleteCustomer(customerId: string) {
    const supabase = await createClient();

    const { error } = await supabase
        .from("customers")
        .delete()
        .eq("id", customerId);

    if (error) {
        console.error("Error deleting customer:", error);
        return { success: false, error: "Error al eliminar el cliente" };
    }

    revalidatePath("/admin/clientes");
    return { success: true };
}

/**
 * Search customers by name or phone
 */
export async function searchCustomers(query: string) {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from("customers")
        .select("*")
        .or(`name.ilike.%${query}%,phone.ilike.%${query}%`)
        .order("total_orders", { ascending: false })
        .limit(10);

    if (error) {
        console.error("Error searching customers:", error);
        return [];
    }

    return data as Customer[];
}

/**
 * Get customer statistics
 */
export async function getCustomerStatistics() {
    const supabase = await createClient();

    const { data: customers } = await supabase
        .from("customers")
        .select("*");

    if (!customers) {
        return {
            totalCustomers: 0,
            frequentCustomers: 0,
            averageOrdersPerCustomer: 0,
            averageSpentPerCustomer: 0,
        };
    }

    const totalCustomers = customers.length;
    const frequentCustomers = customers.filter((c) => c.is_frequent).length;
    const totalOrders = customers.reduce((sum, c) => sum + c.total_orders, 0);
    const totalSpent = customers.reduce((sum, c) => sum + Number(c.total_spent), 0);

    return {
        totalCustomers,
        frequentCustomers,
        averageOrdersPerCustomer: totalCustomers > 0 ? totalOrders / totalCustomers : 0,
        averageSpentPerCustomer: totalCustomers > 0 ? totalSpent / totalCustomers : 0,
    };
}
