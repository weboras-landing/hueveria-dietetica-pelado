import { cn } from "@/lib/utils";

interface StockBadgeProps {
    stock: number;
    lowStockThreshold?: number;
    className?: string;
    showLabel?: boolean;
}

export function StockBadge({
    stock,
    lowStockThreshold = 10,
    className,
    showLabel = true,
}: StockBadgeProps) {
    const getStockInfo = () => {
        if (stock === 0) {
            return {
                label: "Agotado",
                bgColor: "bg-red-100",
                textColor: "text-red-800",
                borderColor: "border-red-200",
            };
        }

        if (stock <= lowStockThreshold) {
            return {
                label: "Pocas unidades",
                bgColor: "bg-yellow-100",
                textColor: "text-yellow-800",
                borderColor: "border-yellow-200",
            };
        }

        return {
            label: "Disponible",
            bgColor: "bg-green-100",
            textColor: "text-green-800",
            borderColor: "border-green-200",
        };
    };

    const stockInfo = getStockInfo();

    return (
        <span
            className={cn(
                "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border",
                stockInfo.bgColor,
                stockInfo.textColor,
                stockInfo.borderColor,
                className
            )}
        >
            <span
                className={cn(
                    "w-2 h-2 rounded-full",
                    stock === 0 && "bg-red-500",
                    stock > 0 && stock <= lowStockThreshold && "bg-yellow-500",
                    stock > lowStockThreshold && "bg-green-500"
                )}
            />
            {showLabel && stockInfo.label}
            {!showLabel && `${stock}`}
        </span>
    );
}
