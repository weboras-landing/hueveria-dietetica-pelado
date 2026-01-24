"use client";

import { useState } from "react";
import { createCategory, updateCategory } from "@/app/admin/actions/categories";
import { ImageUpload } from "./image-upload";

interface CategoryFormProps {
    category?: {
        id: string;
        name: string;
        slug: string;
        tag: string | null;
        image_url: string | null;
    };
}

export default function CategoryForm({ category }: CategoryFormProps) {
    const [name, setName] = useState(category?.name || "");
    const [slug, setSlug] = useState(category?.slug || "");
    const [tag, setTag] = useState(category?.tag || "");
    const [imageUrl, setImageUrl] = useState(category?.image_url || "");
    const [autoSlug, setAutoSlug] = useState(!category);

    const generateSlug = (text: string) => {
        return text
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/(^-|-$)/g, "");
    };

    const handleNameChange = (value: string) => {
        setName(value);
        if (autoSlug) {
            setSlug(generateSlug(value));
        }
    };

    const handleSubmit = async (formData: FormData) => {
        if (category) {
            await updateCategory(category.id, formData);
        } else {
            await createCategory(formData);
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
                    Nombre <span className="text-red-500">*</span>
                </label>
                <input
                    type="text"
                    id="name"
                    name="name"
                    value={name}
                    onChange={(e) => handleNameChange(e.target.value)}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent transition"
                    placeholder="Ej: Frutos Secos"
                />
            </div>

            {/* Slug */}
            <div>
                <label
                    htmlFor="slug"
                    className="block text-sm font-semibold text-gray-700 mb-2"
                >
                    Slug <span className="text-red-500">*</span>
                </label>
                <div className="flex items-center gap-2 mb-1">
                    <input
                        type="text"
                        id="slug"
                        name="slug"
                        value={slug}
                        onChange={(e) => {
                            setSlug(e.target.value);
                            setAutoSlug(false);
                        }}
                        required
                        className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent transition"
                        placeholder="frutos-secos"
                    />
                    {!autoSlug && (
                        <button
                            type="button"
                            onClick={() => {
                                setAutoSlug(true);
                                setSlug(generateSlug(name));
                            }}
                            className="px-4 py-3 text-sm text-amber-600 hover:text-amber-700 font-medium"
                        >
                            Auto-generar
                        </button>
                    )}
                </div>
                <p className="text-xs text-gray-500">
                    URL amigable (solo letras, números y guiones)
                </p>
            </div>

            {/* Tag */}
            <div>
                <label
                    htmlFor="tag"
                    className="block text-sm font-semibold text-gray-700 mb-2"
                >
                    Etiqueta (opcional)
                </label>
                <input
                    type="text"
                    id="tag"
                    name="tag"
                    value={tag}
                    onChange={(e) => setTag(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent transition"
                    placeholder="Ej: Más vendido, Stock permanente"
                />
            </div>

            {/* Image Upload */}
            <div>
                <label
                    htmlFor="image_url"
                    className="block text-sm font-semibold text-gray-700 mb-2"
                >
                    Imagen de la Categoría
                </label>
                <ImageUpload
                    value={imageUrl}
                    onChange={setImageUrl}
                    bucket="products"
                    folder="categories"
                />
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3 pt-4 border-t">
                <button
                    type="submit"
                    className="bg-amber-500 hover:bg-amber-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
                >
                    {category ? "Actualizar Categoría" : "Crear Categoría"}
                </button>
                <a
                    href="/admin/categorias"
                    className="text-gray-600 hover:text-gray-900 px-6 py-3 rounded-lg font-semibold transition-colors"
                >
                    Cancelar
                </a>
            </div>
        </form>
    );
}
