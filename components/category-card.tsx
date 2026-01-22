import Image from "next/image";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import type { Category } from "@/lib/products";
import { Button } from "@/components/ui/button";

interface CategoryCardProps {
  category: Category;
}

export function CategoryCard({ category }: CategoryCardProps) {
  return (
    <Link href={`/categoria/${category.slug}`} className="block group">
      <div className="relative overflow-hidden rounded-2xl bg-white shadow-[0_2px_16px_rgba(0,0,0,0.06)] border border-gray-100/80 transition-all duration-300 hover:shadow-[0_8px_30px_rgba(0,0,0,0.12)] hover:border-primary/20 hover:-translate-y-1 active:scale-[0.98]">
        {/* Glow effect on hover */}
        <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5" />
        {/* Tag badge with premium styling */}
        {category.tag && (
          <div className="absolute top-3 right-3 z-20">
            <span className="inline-flex items-center bg-gradient-to-r from-secondary to-secondary/90 text-secondary-foreground px-2 py-1 rounded-md text-[10px] font-bold shadow-md shadow-secondary/20 tracking-wider uppercase">
              {category.tag}
            </span>
          </div>
        )}

        {/* Category header with refined gradient */}
        <div className="bg-gradient-to-r from-primary via-primary to-primary/95 px-5 py-3.5 relative overflow-hidden">
          {/* Subtle pattern overlay */}
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_1px_1px,white_1px,transparent_0)] bg-[length:16px_16px]" />
          <h3 className="font-serif text-lg font-bold text-primary-foreground italic relative z-10 tracking-wide">
            {category.name}
          </h3>
        </div>

        {/* Image container with elegant overlay */}
        <div className="relative aspect-[4/3] overflow-hidden">
          <Image
            src={category.image || "/placeholder.svg"}
            alt={category.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-110"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          />
          {/* Bottom gradient for better text readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>

        {/* CTA section with improved styling */}
        <div className="p-4 bg-gradient-to-b from-gray-50/0 to-gray-50/50">
          <Button
            variant="secondary"
            className="w-full rounded-xl h-12 font-semibold text-sm shadow-sm hover:shadow transition-all duration-200 group-hover:bg-secondary/90"
          >
            <span>Ver productos</span>
            <ChevronRight className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-0.5" />
          </Button>
        </div>
      </div>
    </Link>
  );
}
