import Image from "next/image";
import Link from "next/link";
import type { Category } from "@/lib/products";
import { Button } from "@/components/ui/button";

interface CategoryCardProps {
  category: Category;
}

export function CategoryCard({ category }: CategoryCardProps) {
  return (
    <div className="group relative overflow-hidden rounded-xl border bg-card shadow-md transition-all hover:shadow-xl hover:-translate-y-1">
      {category.tag && (
        <div className="absolute top-3 right-3 z-10">
          <span className="inline-block bg-secondary text-secondary-foreground px-2.5 py-1 rounded-full text-xs font-medium shadow-sm">
            {category.tag}
          </span>
        </div>
      )}
      <div className="bg-primary px-4 py-2.5">
        <h3 className="font-serif text-lg font-semibold text-primary-foreground italic">
          {category.name}
        </h3>
      </div>
      <div className="relative aspect-[4/3] overflow-hidden">
        <Image
          src={category.image || "/placeholder.svg"}
          alt={category.name}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
        />
      </div>
      <div className="p-4">
        <Link href={`/categoria/${category.slug}`}>
          <Button variant="secondary" className="w-full">
            Ver productos
          </Button>
        </Link>
      </div>
    </div>
  );
}
