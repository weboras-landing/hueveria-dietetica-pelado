// Types for the complete store management system

export interface Customer {
    id: string;
    name: string;
    phone?: string;
    email?: string;
    address?: string;
    notes?: string;
    is_frequent: boolean;
    total_orders: number;
    total_spent: number;
    last_order_at?: string;
    created_at: string;
    updated_at: string;
}

export type OrderStatus = 'pending' | 'confirmed' | 'preparing' | 'ready' | 'delivered' | 'cancelled';
export type DeliveryOption = 'pickup' | 'delivery';

export interface Order {
    id: string;
    order_number: string;
    customer_id?: string;
    customer_name: string;
    customer_phone?: string;
    customer_address?: string;
    delivery_option: DeliveryOption;
    status: OrderStatus;
    subtotal: number;
    discount_amount: number;
    delivery_fee: number;
    total: number;
    discount_code?: string;
    notes?: string;
    whatsapp_sent: boolean;
    created_at: string;
    updated_at: string;
    delivered_at?: string;
    customer?: Customer;
    items?: OrderItem[];
}

export interface OrderItem {
    id: string;
    order_id: string;
    product_id?: string;
    variant_id?: string;
    product_name: string;
    variant_name?: string;
    quantity: number;
    unit_price: number;
    subtotal: number;
    created_at: string;
}

export interface CreateOrderData {
    customer_name: string;
    customer_phone?: string;
    customer_address?: string;
    delivery_option: DeliveryOption;
    notes?: string;
    items: {
        product_id: string;
        variant_id?: string;
        product_name: string;
        variant_name?: string;
        quantity: number;
        unit_price: number;
    }[];
    discount_code?: string;
}

export type DiscountType = 'percentage' | 'fixed' | 'product' | 'category';

export interface Discount {
    id: string;
    code: string;
    name: string;
    description?: string;
    type: DiscountType;
    value: number;
    min_purchase: number;
    max_uses?: number;
    current_uses: number;
    applies_to_product_id?: string;
    applies_to_category_id?: string;
    is_active: boolean;
    starts_at?: string;
    expires_at?: string;
    created_at: string;
    updated_at: string;
}

export interface Supplier {
    id: string;
    name: string;
    contact_name?: string;
    phone?: string;
    email?: string;
    address?: string;
    notes?: string;
    is_active: boolean;
    created_at: string;
    updated_at: string;
}

export interface Expense {
    id: string;
    category: string;
    description: string;
    amount: number;
    date: string;
    supplier_id?: string;
    receipt_url?: string;
    notes?: string;
    created_at: string;
    updated_at: string;
    supplier?: Supplier;
}

export interface StoreSettings {
    id: string;
    key: string;
    value: any;
    updated_at: string;
}

// Analytics types
export interface OrderStats {
    date: string;
    total_orders: number;
    delivered_orders: number;
    cancelled_orders: number;
    total_revenue: number;
    avg_order_value: number;
}

export interface TopProduct {
    product_id: string;
    product_name: string;
    times_ordered: number;
    total_quantity: number;
    total_revenue: number;
}

export interface DashboardStats {
    today: {
        orders: number;
        revenue: number;
    };
    week: {
        orders: number;
        revenue: number;
    };
    month: {
        orders: number;
        revenue: number;
    };
    topProducts: TopProduct[];
    recentOrders: Order[];
    lowStockProducts: number;
    pendingOrders: number;
}
