import { PrismaClient } from "@prisma/client";
import { products } from "../src/lib/data";

const prisma = new PrismaClient();

async function main() {
  for (const p of products) {
    await prisma.product.upsert({
      where: { id: p.id },
      update: { name: p.name, category: p.tab, price: p.price, features: p.features },
      create: { id: p.id, name: p.name, category: p.tab, price: p.price, features: p.features },
    });
  }
  console.log("Produk terisi:", products.length);
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
