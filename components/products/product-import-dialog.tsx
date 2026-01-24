"use client";

import { useState } from "react";
import Papa from "papaparse";
import { Upload, FileText, AlertCircle, CheckCircle2 } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { bulkCreateProducts } from "@/app/admin/actions/products";
import { toast } from "sonner";

interface ParsedProduct {
    name: string;
    description?: string;
    category?: string;
    price: number;
    unit?: string;
    stock?: number;
    image_url?: string;
}

export function ProductImportDialog() {
    const [open, setOpen] = useState(false);
    const [file, setFile] = useState<File | null>(null);
    const [parsedData, setParsedData] = useState<ParsedProduct[]>([]);
    const [errors, setErrors] = useState<string[]>([]);
    const [isUploading, setIsUploading] = useState(false);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (!selectedFile) return;

        setFile(selectedFile);
        setErrors([]);
        setParsedData([]);

        Papa.parse(selectedFile, {
            header: true,
            skipEmptyLines: true,
            complete: (results) => {
                const validProducts: ParsedProduct[] = [];
                const parseErrors: string[] = [];

                results.data.forEach((row: any, index: number) => {
                    // Validate required fields
                    if (!row.Name || !row.Price) {
                        parseErrors.push(
                            `Row ${index + 1}: Missing required fields (Name, Price)`
                        );
                        return;
                    }

                    const price = parseFloat(row.Price);
                    if (isNaN(price)) {
                        parseErrors.push(`Row ${index + 1}: Invalid price value`);
                        return;
                    }

                    validProducts.push({
                        name: row.Name.trim(),
                        description: row.Description?.trim() || undefined,
                        category: row.Category?.trim() || undefined,
                        price,
                        unit: row.Unit?.trim() || "u",
                        stock: row.Stock ? parseInt(row.Stock) : 0,
                        image_url: row["Image URL"]?.trim() || undefined,
                    });
                });

                setParsedData(validProducts);
                setErrors(parseErrors);
            },
            error: (error) => {
                setErrors([`Error parsing CSV: ${error.message}`]);
            },
        });
    };

    const handleUpload = async () => {
        if (parsedData.length === 0) {
            toast.error("No valid products to upload");
            return;
        }

        setIsUploading(true);
        try {
            const results = await bulkCreateProducts(parsedData);

            if (results.success > 0) {
                toast.success(
                    `Successfully imported ${results.success} product(s)`
                );
            }

            if (results.failed > 0) {
                toast.error(`Failed to import ${results.failed} product(s)`);
                results.errors.forEach((error) => {
                    console.error("Import error:", error);
                });
            }

            // Close dialog and reset state
            setOpen(false);
            setFile(null);
            setParsedData([]);
            setErrors([]);
        } catch (error) {
            toast.error("Failed to import products");
            console.error("Upload error:", error);
        } finally {
            setIsUploading(false);
        }
    };

    const downloadTemplate = () => {
        const template = `Name,Description,Category,Price,Unit,Stock,Image URL
Producto Ejemplo 1,Descripción del producto,frutas,100,kg,50,
Producto Ejemplo 2,Otra descripción,verduras,200,u,20,`;

        const blob = new Blob([template], { type: "text/csv" });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "plantilla-productos.csv";
        a.click();
        window.URL.revokeObjectURL(url);
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline">
                    <Upload className="mr-2 h-4 w-4" />
                    Importar CSV
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
                <DialogHeader>
                    <DialogTitle>Importar Productos desde CSV</DialogTitle>
                    <DialogDescription>
                        Sube un archivo CSV con tus productos. Los campos requeridos son:
                        Name, Price.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4">
                    <div className="flex items-center gap-2">
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={downloadTemplate}
                        >
                            <FileText className="mr-2 h-4 w-4" />
                            Descargar Plantilla
                        </Button>
                    </div>

                    <div className="border-2 border-dashed rounded-lg p-6">
                        <input
                            type="file"
                            accept=".csv"
                            onChange={handleFileChange}
                            className="w-full"
                        />
                    </div>

                    {file && (
                        <div className="space-y-2">
                            <p className="text-sm font-medium">
                                Archivo: {file.name}
                            </p>

                            {parsedData.length > 0 && (
                                <div className="flex items-center gap-2 text-green-600">
                                    <CheckCircle2 className="h-4 w-4" />
                                    <span className="text-sm">
                                        {parsedData.length} producto(s) válido(s)
                                    </span>
                                </div>
                            )}

                            {errors.length > 0 && (
                                <div className="space-y-1">
                                    <div className="flex items-center gap-2 text-red-600">
                                        <AlertCircle className="h-4 w-4" />
                                        <span className="text-sm font-medium">
                                            {errors.length} error(es) encontrado(s)
                                        </span>
                                    </div>
                                    <div className="max-h-32 overflow-y-auto text-xs text-red-600 space-y-1">
                                        {errors.map((error, i) => (
                                            <div key={i}>• {error}</div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                <DialogFooter>
                    <Button
                        variant="outline"
                        onClick={() => setOpen(false)}
                        disabled={isUploading}
                    >
                        Cancelar
                    </Button>
                    <Button
                        onClick={handleUpload}
                        disabled={parsedData.length === 0 || isUploading}
                    >
                        {isUploading ? "Importando..." : "Importar"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
