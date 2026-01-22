"use client";

import { useState, useCallback } from "react";
import { Upload, X, Image as ImageIcon, Loader2 } from "lucide-react";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";

interface ImageUploadProps {
    value: string;
    onChange: (url: string) => void;
    bucket?: string;
    folder?: string;
}

export function ImageUpload({
    value,
    onChange,
    bucket = "products",
    folder = "products",
}: ImageUploadProps) {
    const [isDragging, setIsDragging] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [preview, setPreview] = useState(value);

    const supabase = createClient();

    const uploadImage = async (file: File) => {
        try {
            setIsUploading(true);

            // Validate file type
            if (!file.type.startsWith("image/")) {
                toast.error("Por favor selecciona una imagen válida");
                return;
            }

            // Validate file size (max 5MB)
            if (file.size > 5 * 1024 * 1024) {
                toast.error("La imagen no puede superar los 5MB");
                return;
            }

            // Generate unique filename
            const fileExt = file.name.split(".").pop();
            const fileName = `${folder}/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;

            // Upload to Supabase Storage
            const { data, error } = await supabase.storage
                .from(bucket)
                .upload(fileName, file, {
                    cacheControl: "3600",
                    upsert: false,
                });

            if (error) {
                console.error("Upload error:", error);
                toast.error("Error al subir la imagen");
                return;
            }

            // Get public URL
            const {
                data: { publicUrl },
            } = supabase.storage.from(bucket).getPublicUrl(data.path);

            setPreview(publicUrl);
            onChange(publicUrl);
            toast.success("¡Imagen subida exitosamente!");
        } catch (error) {
            console.error("Upload error:", error);
            toast.error("Error al subir la imagen");
        } finally {
            setIsUploading(false);
        }
    };

    const handleDrop = useCallback(
        (e: React.DragEvent<HTMLDivElement>) => {
            e.preventDefault();
            setIsDragging(false);

            const files = Array.from(e.dataTransfer.files);
            if (files.length > 0) {
                uploadImage(files[0]);
            }
        },
        [uploadImage]
    );

    const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(true);
    }, []);

    const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(false);
    }, []);

    const handleFileSelect = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            const files = e.target.files;
            if (files && files.length > 0) {
                uploadImage(files[0]);
            }
        },
        [uploadImage]
    );

    const handleRemove = () => {
        setPreview("");
        onChange("");
    };

    return (
        <div className="space-y-4">
            {/* Drop Zone */}
            <div
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                className={`relative border-2 border-dashed rounded-xl transition-all duration-200 ${isDragging
                    ? "border-primary bg-primary/5 scale-[1.02]"
                    : "border-gray-300 hover:border-gray-400"
                    } ${isUploading ? "opacity-50 pointer-events-none" : ""}`}
            >
                <input
                    type="file"
                    id="image-upload"
                    accept="image/*"
                    onChange={handleFileSelect}
                    className="hidden"
                    disabled={isUploading}
                />

                {preview ? (
                    // Preview
                    <div className="relative group">
                        <div className="relative w-full h-64 rounded-xl overflow-hidden">
                            <Image
                                src={preview}
                                alt="Preview"
                                fill
                                className="object-contain bg-gray-50"
                            />
                        </div>
                        <button
                            type="button"
                            onClick={handleRemove}
                            className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                        >
                            <X className="h-4 w-4" />
                        </button>
                    </div>
                ) : (
                    // Upload Area
                    <label
                        htmlFor="image-upload"
                        className="flex flex-col items-center justify-center py-12 px-6 cursor-pointer"
                    >
                        {isUploading ? (
                            <>
                                <Loader2 className="h-12 w-12 text-primary animate-spin mb-4" />
                                <p className="text-sm font-medium text-gray-700">
                                    Subiendo imagen...
                                </p>
                            </>
                        ) : (
                            <>
                                <div className="p-4 bg-primary/10 rounded-full mb-4">
                                    <Upload className="h-8 w-8 text-primary" />
                                </div>
                                <p className="text-sm font-semibold text-gray-700 mb-1">
                                    Arrastra una imagen aquí
                                </p>
                                <p className="text-xs text-gray-500 mb-4">
                                    o haz click para seleccionar
                                </p>
                                <p className="text-xs text-gray-400">
                                    PNG, JPG, WEBP (máx. 5MB)
                                </p>
                            </>
                        )}
                    </label>
                )}
            </div>

            {/* Hidden input for form submission */}
            <input type="hidden" name="image_url" value={preview} />
        </div>
    );
}
