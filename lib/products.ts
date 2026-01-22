export interface Product {
  id: string;
  name: string;
  price: number;
  unit: string;
  category: string;
  image: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  image: string;
  tag?: string;
}

export const categories: Category[] = [
  {
    id: "1",
    name: "Huevos",
    slug: "huevos",
    image: "/images/categoria-huevos.jpg",
    tag: "Mas vendido",
  },
  {
    id: "2",
    name: "Frutos Secos",
    slug: "frutos-secos",
    image: "/images/categoria-frutos-secos.jpg",
    tag: "Stock permanente",
  },
  {
    id: "3",
    name: "Semillas",
    slug: "semillas",
    image: "/images/categoria-semillas.jpg",
  },
  {
    id: "4",
    name: "Legumbres",
    slug: "legumbres",
    image: "/images/categoria-legumbres.jpg",
    tag: "Stock permanente",
  },
];

export const products: Product[] = [
  // Huevos
  {
    id: "h1",
    name: "Huevos de Campo x 6",
    price: 1200,
    unit: "media docena",
    category: "huevos",
    image: "/images/huevos-campo-6.jpg",
  },
  {
    id: "h2",
    name: "Huevos de Campo x 12",
    price: 2200,
    unit: "docena",
    category: "huevos",
    image: "/images/huevos-campo-12.jpg",
  },
  {
    id: "h3",
    name: "Huevos de Campo x 30",
    price: 5000,
    unit: "maple",
    category: "huevos",
    image: "/images/huevos-campo-30.jpg",
  },
  {
    id: "h4",
    name: "Huevos Blancos x 12",
    price: 1800,
    unit: "docena",
    category: "huevos",
    image: "/images/huevos-blancos-12.jpg",
  },

  // Frutos Secos
  {
    id: "f1",
    name: "Almendras",
    price: 3500,
    unit: "250g",
    category: "frutos-secos",
    image: "/images/almendras.jpg",
  },
  {
    id: "f2",
    name: "Nueces",
    price: 3200,
    unit: "250g",
    category: "frutos-secos",
    image: "/images/nueces.jpg",
  },
  {
    id: "f3",
    name: "Castanas de Caju",
    price: 4000,
    unit: "250g",
    category: "frutos-secos",
    image: "/images/castanas-caju.jpg",
  },
  {
    id: "f4",
    name: "Mani Tostado",
    price: 1500,
    unit: "500g",
    category: "frutos-secos",
    image: "/images/mani-tostado.jpg",
  },
  {
    id: "f5",
    name: "Avellanas",
    price: 4500,
    unit: "250g",
    category: "frutos-secos",
    image: "/images/avellanas.jpg",
  },

  // Semillas
  {
    id: "s1",
    name: "Semillas de Chia",
    price: 1800,
    unit: "500g",
    category: "semillas",
    image: "/images/semillas-chia.jpg",
  },
  {
    id: "s2",
    name: "Semillas de Lino",
    price: 1200,
    unit: "500g",
    category: "semillas",
    image: "/images/semillas-lino.jpg",
  },
  {
    id: "s3",
    name: "Semillas de Girasol",
    price: 1000,
    unit: "500g",
    category: "semillas",
    image: "/images/semillas-girasol.jpg",
  },
  {
    id: "s4",
    name: "Semillas de Sesamo",
    price: 1400,
    unit: "500g",
    category: "semillas",
    image: "/images/semillas-sesamo.jpg",
  },
  {
    id: "s5",
    name: "Mix de Semillas",
    price: 2000,
    unit: "500g",
    category: "semillas",
    image: "/images/mix-semillas.jpg",
  },

  // Legumbres
  {
    id: "l1",
    name: "Lentejas",
    price: 1200,
    unit: "500g",
    category: "legumbres",
    image: "/images/lentejas.jpg",
  },
  {
    id: "l2",
    name: "Garbanzos",
    price: 1400,
    unit: "500g",
    category: "legumbres",
    image: "/images/garbanzos.jpg",
  },
  {
    id: "l3",
    name: "Porotos Negros",
    price: 1300,
    unit: "500g",
    category: "legumbres",
    image: "/images/porotos-negros.jpg",
  },
  {
    id: "l4",
    name: "Porotos Blancos",
    price: 1300,
    unit: "500g",
    category: "legumbres",
    image: "/images/porotos-blancos.jpg",
  },
  {
    id: "l5",
    name: "Arvejas Secas",
    price: 1100,
    unit: "500g",
    category: "legumbres",
    image: "/images/arvejas-secas.jpg",
  },
];

export function getProductsByCategory(slug: string): Product[] {
  return products.filter((product) => product.category === slug);
}

export function getCategoryBySlug(slug: string): Category | undefined {
  return categories.find((category) => category.slug === slug);
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
  }).format(price);
}
