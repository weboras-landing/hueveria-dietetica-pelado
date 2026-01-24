"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Tag, Save, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { createDiscount } from "@/app/admin/actions/discounts";
import { toast } from "sonner";
import type { DiscountType } from "@/lib/types";

export default function NewDiscountPage() {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [formData, setFormData] = useState({
        code: "",
        name: "",
        description: "",
        type: "percentage" as DiscountType,
        value: "",
        min_purchase: "",
        max_uses: "",
        is_active: true,
        expires_at: "",
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const result = await createDiscount({
                code: formData.code,
                name: formData.name,
                description: formData.description,
                type: formData.type,
                value: Number(formData.value),
                min_purchase: formData.min_purchase ? Number(formData.min_purchase) : 0,
                max_uses: formData.max_uses ? Number(formData.max_uses) : undefined,
                is_active: formData.is_active,
                expires_at: formData.expires_at ? new Date(formData.expires_at).toISOString() : undefined,
            });

            if (result.success) {
                toast.success("Descuento creado exitosamente");
                router.push("/admin/descuentos");
            } else {
                toast.error(result.error || "Error al crear el descuento");
            }
        } catch (error) {
            toast.error("Error inesperado");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="max-w-3xl mx-auto">
            <div className="flex items-center gap-4 mb-8">
                <Link
                    href="/admin/descuentos"
                    className="p-2 hover:bg-gray-100 rounded-lg text-gray-600 transition-colors"
                >
                    <ArrowLeft className="w-6 h-6" />
                </Link>
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">
                        Nuevo Descuento
                    </h1>
                    <p className="text-gray-600">
                        Crear cupón o promoción
                    </p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-8">
                {/* Basic Info */}
                <div className="space-y-4">
                    <h2 className="text-lg font-semibold flex items-center gap-2">
                        <Tag className="w-5 h-5" />
                        Información Básica
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Código (Cupón) *</Label>
                            <Input
                                value={formData.code}
                                onChange={e => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                                placeholder="Eje: VERANO2026"
                                required
                                className="uppercase font-mono"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label>Nombre de la Promoción *</Label>
                            <Input
                                value={formData.name}
                                onChange={e => setFormData({ ...formData, name: e.target.value })}
                                placeholder="Eje: Descuento de Verano"
                                required
                            />
                        </div>

                        <div className="md:col-span-2 space-y-2">
                            <Label>Descripción</Label>
                            <Textarea
                                value={formData.description}
                                onChange={e => setFormData({ ...formData, description: e.target.value })}
                                placeholder="Descripción interna..."
                            />
                        </div>
                    </div>
                </div>

                {/* Values */}
                <div className="space-y-4 pt-4 border-t">
                    <h2 className="text-lg font-semibold">Valores y Reglas</h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Tipo de Descuento</Label>
                            <Select
                                value={formData.type}
                                onValueChange={(v: DiscountType) => setFormData({ ...formData, type: v })}
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="percentage">Porcentaje (%)</SelectItem>
                                    <SelectItem value="fixed">Monto Fijo ($)</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label>
                                {formData.type === 'percentage' ? 'Porcentaje de Descuento (%)' : 'Monto de Descuento ($)'} *
                            </Label>
                            <Input
                                type="number"
                                min="0"
                                step={formData.type === 'percentage' ? "0.1" : "1"}
                                max={formData.type === 'percentage' ? "100" : undefined}
                                value={formData.value}
                                onChange={e => setFormData({ ...formData, value: e.target.value })}
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label>Compra Mínima ($)</Label>
                            <Input
                                type="number"
                                min="0"
                                value={formData.min_purchase}
                                onChange={e => setFormData({ ...formData, min_purchase: e.target.value })}
                                placeholder="0"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label>Límite de Usos (Opcional)</Label>
                            <Input
                                type="number"
                                min="1"
                                value={formData.max_uses}
                                onChange={e => setFormData({ ...formData, max_uses: e.target.value })}
                                placeholder="Ilimitado"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label>Fecha de Expiración</Label>
                            <Input
                                type="datetime-local"
                                value={formData.expires_at}
                                onChange={e => setFormData({ ...formData, expires_at: e.target.value })}
                            />
                        </div>

                        <div className="flex items-center space-x-2 pt-8">
                            <Switch
                                id="active"
                                checked={formData.is_active}
                                onCheckedChange={c => setFormData({ ...formData, is_active: c })}
                            />
                            <Label htmlFor="active">Activo inmediatamente</Label>
                        </div>
                    </div>
                </div>

                <div className="pt-6 border-t flex justify-end gap-3">
                    <Link href="/admin/descuentos">
                        <Button variant="outline" type="button">Cancelar</Button>
                    </Link>
                    <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="bg-primary hover:bg-primary/90 min-w-[120px]"
                    >
                        {isSubmitting ? "Guardando..." : "Crear Descuento"}
                    </Button>
                </div>
            </form>
        </div>
    );
}
