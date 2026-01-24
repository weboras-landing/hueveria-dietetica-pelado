"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Search, Plus, Trash2, User, Phone, MapPin } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { formatPrice } from "@/lib/products";
import { createOrder } from "@/app/admin/actions/orders";
import { getCustomers, searchCustomers } from "@/app/admin/actions/customers";
import { getProducts } from "@/app/admin/actions/products";
import { getActiveDiscounts, validateDiscountCode } from "@/app/admin/actions/discounts";
import { calculateDiscountAmount } from "@/lib/discount-utils";
import { toast } from "sonner";
import type { Customer, Discount } from "@/lib/types";
import type { Product } from "@/lib/products";

export default function NewOrderPage() {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Customer state
    const [customerName, setCustomerName] = useState("");
    const [customerPhone, setCustomerPhone] = useState("");
    const [customerAddress, setCustomerAddress] = useState("");
    const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
    const [customerSearch, setCustomerSearch] = useState("");
    const [showCustomerResults, setShowCustomerResults] = useState(false);
    const [customerResults, setCustomerResults] = useState<Customer[]>([]);

    // Order state
    const [deliveryOption, setDeliveryOption] = useState<"pickup" | "delivery">("pickup");
    const [notes, setNotes] = useState("");
    const [discountCode, setDiscountCode] = useState("");
    const [appliedDiscount, setAppliedDiscount] = useState<Discount | null>(null);
    const [discountError, setDiscountError] = useState("");

    // Products state
    const [products, setProducts] = useState<Product[]>([]);
    const [productSearch, setProductSearch] = useState("");
    const [orderItems, setOrderItems] = useState<any[]>([]);

    // Load initial data
    useEffect(() => {
        const loadData = async () => {
            const productsData = await getProducts();
            setProducts(productsData);
        };
        loadData();
    }, []);

    // Search customers
    useEffect(() => {
        const search = async () => {
            if (customerSearch.length < 2) {
                setCustomerResults([]);
                return;
            }
            const results = await searchCustomers(customerSearch);
            setCustomerResults(results);
            setShowCustomerResults(true);
        };
        const debounce = setTimeout(search, 300);
        return () => clearTimeout(debounce);
    }, [customerSearch]);

    const handleSelectCustomer = (customer: Customer) => {
        setSelectedCustomer(customer);
        setCustomerName(customer.name);
        setCustomerPhone(customer.phone || "");
        setCustomerAddress(customer.address || "");
        setShowCustomerResults(false);
        setCustomerSearch("");
    };

    const handleAddProduct = (product: Product) => {
        // Build product variant selector if needed, for now use default or first
        const variant = product.variants?.find(v => v.id === product.variants?.[0]?.id); // Simplification for now

        const existingItem = orderItems.find(
            item => item.product_id === product.id && item.variant_id === variant?.id
        );

        if (existingItem) {
            setOrderItems(orderItems.map(item =>
                item === existingItem
                    ? { ...item, quantity: item.quantity + 1 }
                    : item
            ));
        } else {
            setOrderItems([...orderItems, {
                product_id: product.id,
                variant_id: variant?.id,
                product_name: product.name,
                variant_name: variant?.unit || product.unit,
                quantity: 1,
                unit_price: variant ? variant.price : product.price,
                image: product.image_url
            }]);
        }
    };

    const updateQuantity = (index: number, delta: number) => {
        const newItems = [...orderItems];
        newItems[index].quantity += delta;
        if (newItems[index].quantity <= 0) {
            newItems.splice(index, 1);
        }
        setOrderItems(newItems);
    };

    const checkDiscount = async () => {
        if (!discountCode) return;

        const subtotal = orderItems.reduce((sum, item) => sum + (item.unit_price * item.quantity), 0);
        const result = await validateDiscountCode(discountCode, subtotal);

        if (result.valid && result.discount) {
            setAppliedDiscount(result.discount as Discount);
            setDiscountError("");
            toast.success("Descuento aplicado correctamente");
        } else {
            setAppliedDiscount(null);
            setDiscountError(result.error || "Error al aplicar descuento");
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (orderItems.length === 0) {
            toast.error("Agrega productos al pedido");
            return;
        }
        if (!customerName) {
            toast.error("Ingresa el nombre del cliente");
            return;
        }

        setIsSubmitting(true);
        try {
            const result = await createOrder({
                customer_name: customerName,
                customer_phone: customerPhone,
                customer_address: customerAddress,
                delivery_option: deliveryOption,
                notes,
                items: orderItems,
                discount_code: appliedDiscount?.code
            });

            if (result.success) {
                toast.success("Pedido creado exitosamente");
                router.push("/admin/pedidos");
            } else {
                toast.error(result.error || "Error al crear el pedido");
            }
        } catch (error) {
            console.error(error);
            toast.error("Error inesperado");
        } finally {
            setIsSubmitting(false);
        }
    };

    const subtotal = orderItems.reduce((sum, item) => sum + (item.unit_price * item.quantity), 0);
    const discountAmount = appliedDiscount ? calculateDiscountAmount(appliedDiscount, subtotal, orderItems) : 0;
    const deliveryFee = deliveryOption === "delivery" ? 500 : 0;
    const total = subtotal - discountAmount + deliveryFee;

    const filteredProducts = products.filter(p =>
        p.name.toLowerCase().includes(productSearch.toLowerCase()) && p.is_active
    );

    return (
        <div className="max-w-6xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Nuevo Pedido</h1>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column - Customer & Settings */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Customer Info */}
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                            <User className="h-5 w-5" />
                            Datos del Cliente
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2 relative">
                                <Label>Buscar Cliente (Opcional)</Label>
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                    <Input
                                        placeholder="Teléfono o nombre..."
                                        className="pl-9"
                                        value={customerSearch}
                                        onChange={e => setCustomerSearch(e.target.value)}
                                    />
                                </div>
                                {showCustomerResults && customerSearch.length >= 2 && (
                                    <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-lg shadow-lg z-20 mt-1 max-h-48 overflow-y-auto">
                                        {customerResults.map(c => (
                                            <button
                                                key={c.id}
                                                type="button"
                                                onClick={() => handleSelectCustomer(c)}
                                                className="w-full text-left p-2 hover:bg-gray-50 border-b last:border-0"
                                            >
                                                <p className="font-medium">{c.name}</p>
                                                <p className="text-xs text-gray-500">{c.phone}</p>
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label>Nombre *</Label>
                                <Input
                                    value={customerName}
                                    onChange={e => setCustomerName(e.target.value)}
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label>Teléfono</Label>
                                <Input
                                    value={customerPhone}
                                    onChange={e => setCustomerPhone(e.target.value)}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label>Método de Entrega</Label>
                                <div className="flex gap-2">
                                    <button
                                        type="button"
                                        onClick={() => setDeliveryOption("pickup")}
                                        className={`flex-1 p-2 rounded-lg border text-sm font-medium transition-colors ${deliveryOption === "pickup"
                                            ? "bg-primary/10 border-primary text-primary"
                                            : "border-gray-200 hover:bg-gray-50"
                                            }`}
                                    >
                                        Retiro
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setDeliveryOption("delivery")}
                                        className={`flex-1 p-2 rounded-lg border text-sm font-medium transition-colors ${deliveryOption === "delivery"
                                            ? "bg-primary/10 border-primary text-primary"
                                            : "border-gray-200 hover:bg-gray-50"
                                            }`}
                                    >
                                        Delivery
                                    </button>
                                </div>
                            </div>

                            {deliveryOption === "delivery" && (
                                <div className="md:col-span-2 space-y-2">
                                    <Label>Dirección</Label>
                                    <Input
                                        value={customerAddress}
                                        onChange={e => setCustomerAddress(e.target.value)}
                                        placeholder="Calle, número, barrio..."
                                    />
                                </div>
                            )}

                            <div className="md:col-span-2 space-y-2">
                                <Label>Notas</Label>
                                <Textarea
                                    value={notes}
                                    onChange={e => setNotes(e.target.value)}
                                    placeholder="Instrucciones especiales..."
                                />
                            </div>
                        </div>
                    </div>

                    {/* Product Selection */}
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                            <Search className="h-5 w-5" />
                            Agregar Productos
                        </h2>

                        <div className="mb-4">
                            <Input
                                placeholder="Buscar productos..."
                                value={productSearch}
                                onChange={e => setProductSearch(e.target.value)}
                            />
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-h-[400px] overflow-y-auto p-1">
                            {filteredProducts.map(product => {
                                const defaultVariant = product.variants?.find(v => v.is_default) || product.variants?.[0];
                                const price = defaultVariant ? defaultVariant.price : product.price;

                                return (
                                    <button
                                        key={product.id}
                                        type="button"
                                        onClick={() => handleAddProduct(product)}
                                        disabled={!product.is_active}
                                        className="flex flex-col items-start p-3 rounded-lg border border-gray-200 hover:border-primary hover:bg-primary/5 transition-all text-left disabled:opacity-50"
                                    >
                                        <div className="w-full aspect-square relative mb-2 bg-gray-100 rounded-md overflow-hidden">
                                            {product.image_url && (
                                                <Image
                                                    src={product.image_url}
                                                    alt={product.name}
                                                    fill
                                                    className="object-cover"
                                                />
                                            )}
                                        </div>
                                        <p className="font-medium text-sm line-clamp-1">{product.name}</p>
                                        <p className="text-primary font-bold">{formatPrice(price)}</p>
                                        {/* Show stock if needed */}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* Right Column - Order Summary */}
                <div className="space-y-6">
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 sticky top-4">
                        <h2 className="text-xl font-semibold mb-4">Resumen</h2>

                        <div className="space-y-4 mb-6">
                            {orderItems.length === 0 ? (
                                <p className="text-center text-gray-500 py-4">No hay productos agregados</p>
                            ) : (
                                <div className="space-y-3 max-h-[300px] overflow-y-auto">
                                    {orderItems.map((item, idx) => (
                                        <div key={idx} className="flex gap-3 items-start">
                                            <div className="flex-1">
                                                <p className="font-medium text-sm">{item.product_name}</p>
                                                <p className="text-xs text-gray-500">{item.variant_name}</p>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <span className="text-xs font-medium">{formatPrice(item.unit_price)}</span>
                                                </div>
                                            </div>
                                            <div className="flex flex-col items-end gap-1">
                                                <div className="flex items-center border rounded-md">
                                                    <button type="button" onClick={() => updateQuantity(idx, -1)} className="px-2 py-0.5 hover:bg-gray-100">-</button>
                                                    <span className="px-2 text-sm">{item.quantity}</span>
                                                    <button type="button" onClick={() => updateQuantity(idx, 1)} className="px-2 py-0.5 hover:bg-gray-100">+</button>
                                                </div>
                                                <span className="font-semibold text-sm">
                                                    {formatPrice(item.unit_price * item.quantity)}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="border-t pt-4 space-y-3">
                            {/* Discount Input */}
                            <div className="flex gap-2">
                                <Input
                                    placeholder="Código descuento"
                                    value={discountCode}
                                    onChange={e => setDiscountCode(e.target.value)}
                                    className="h-9 text-sm"
                                />
                                <Button
                                    type="button"
                                    onClick={checkDiscount}
                                    variant="outline"
                                    size="sm"
                                >
                                    Aplicar
                                </Button>
                            </div>
                            {discountError && <p className="text-xs text-red-500">{discountError}</p>}
                            {appliedDiscount && (
                                <div className="flex justify-between text-green-600 text-sm">
                                    <span>Descuento ({appliedDiscount.code})</span>
                                    <span>-{formatPrice(discountAmount)}</span>
                                </div>
                            )}

                            <div className="flex justify-between text-sm">
                                <span className="text-gray-600">Subtotal</span>
                                <span>{formatPrice(subtotal)}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-600">Envío</span>
                                <span>{formatPrice(deliveryFee)}</span>
                            </div>
                            <div className="flex justify-between text-lg font-bold border-t pt-2 mt-2">
                                <span>Total</span>
                                <span className="text-primary">{formatPrice(total)}</span>
                            </div>
                        </div>

                        <Button
                            className="w-full mt-6 bg-amber-500 hover:bg-amber-600"
                            size="lg"
                            type="submit"
                            disabled={isSubmitting || orderItems.length === 0}
                        >
                            {isSubmitting ? "Creando..." : "Crear Pedido"}
                        </Button>
                    </div>
                </div>
            </form>
        </div>
    );
}
