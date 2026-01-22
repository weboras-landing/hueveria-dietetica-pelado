"use client";

import { useState, useEffect } from "react";
import { createProduct, updateProduct } from "@/app/admin/actions/products";
import { getCategories } from "@/app/admin/actions/categories";
import { ImageUpload } from "./image-upload";
import VariantManager from "./variant-manager";

interface Variant {
    id?: string;
    unit: string;
    price: number;
    stock: number;
    is_default: boolean;
}

interface ProductFormProps {
    product?: {
        id: string;
        name: string;
        description: string | null;
        category_id: string | null;
        image_url: string | null;
        is_featured: boolean;
        is_active: boolean;
        variants: Variant[];
    };
}

export default function ProductForm({ product }: ProductFormProps) {
    const [name, setName] = useState(product?.name || "");
    const [description, setDescription] = useState(product?.description || "");
    const [categoryId, setCategoryId] = useState(product?.category_id || "");
    const [imageUrl, setImageUrl] = useState(product?.image_url || "");
    const [isFeatured, setIsFeatured] = useState(product?.is_featured || false);
    const [isActive, setIsActive] = useState(product?.is_active ?? true);
    const [variants, setVariants] = useState<Variant[]>(
        product?.variants || [{ unit: "", price: 0, stock: 0, is_default: true }]
    );
    const [categories, setCategories] = useState<any[]>([]);

    useEffect(() => {
        getCategories().then(setCategories);
    }, []);

    const handleSubmit = async (formData: FormData) => {
        // Add variants as JSON
        formData.set("variants", JSON.stringify(variants));

        if (product) {
            await updateProduct(product.id, formData);
        } else {
            await createProduct(formData);
        }
    };

    return (
        <form action={handleSubmit} className="space-y-6">
            {/* Name */}
            <div>
                <label
                    htmlFor="name"
                    className="block text-sm font-semibold text-gray-700 mb-2"
                >
                    Nombre del Producto <span className="text-red-500">*</span>
                </label>
                <input
                    type="text"
                    id="name"
                    name="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    placeholder="Ej: Almendras Non Pareil"
                />
            </div>

            {/* Description */}
            <div>
                <label
                    htmlFor="description"
                    className="block text-sm font-semibold text-gray-700 mb-2"
                >
                    Descripción
                </label>
                <textarea
                    id="description"
                    name="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent resize-none"
                    placeholder="Descripción del producto..."
                />
            </div>

            {/* Category */}
            <div>
                <label
                    htmlFor="category_id"
                    className="block text-sm font-semibold text-gray-700 mb-2"
                >
                    Categoría
                </label>
                <select
                    id="category_id"
                    name="category_id"
                    value={categoryId}
                    onChange={(e) => setCategoryId(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                >
                    <option value="">Sin categoría</option>
                    {categories.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                            {cat.name}
                        </option>
                    ))}
                </select>
            </div>

            {/* Image Upload */}
            <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Imagen del Producto
                </label>
                <ImageUpload value={imageUrl} onChange={setImageUrl} />
            </div>

            {/* Toggles */}
            <div className="flex items-center gap-8">
                <label className="flex items-center gap-3 cursor-pointer">
                    <input
                        type="checkbox"
                        name="is_featured"
                        checked={isFeatured}
                        onChange={(e) => setIsFeatured(e.target.checked)}
                        value="true"
                        className="w-5 h-5 text-amber-500 border-gray-300 rounded focus:ring-amber-500"
                    />
                    <span className="text-sm font-medium text-gray-700">
                        Producto Destacado
                    </span>
                </label>

                <label className="flex items-center gap-3 cursor-pointer">
                    <input
                        type="checkbox"
                        name="is_active"
                        checked={isActive}
                        onChange={(e) => setIsActive(e.target.checked)}
                        value="true"
                        className="w-5 h-5 text-green-500 border-gray-300 rounded focus:ring-green-500"
                    />
                    <span className="text-sm font-medium text-gray-700">
                        Producto Activo
                    </span>
                </label>
            </div>

            {/* Variants */}
            <div className="border-t pt-6">
                <VariantManager variants={variants} onChange={setVariants} />
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3 pt-4 border-t">
                <button
                    type="submit"
                    className="bg-amber-500 hover:bg-amber-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
                >
                    {product ? "Actualizar Producto" : "Crear Producto"}
                </button>
                <a
                    href="/admin/productos"
                    className="text-gray-600 hover:text-gray-900 px-6 py-3 rounded-lg font-semibold transition-colors"
                >
                    Cancelar
                </a>
            </div>
        </form>
    );
}
