import "dotenv/config";
import prisma from "../src/lib/prisma";

async function main() {
  console.log("🌱 Seeding BIHARI BITES database with authentic product imagery on Neon DB...");

  // 1. Create or Update Categories
  const catSweets = await prisma.category.upsert({
    where: { slug: "sweets-snacks" },
    update: {
      image: "/images/products/thekua.jpg",
    },
    create: {
      name: "Sweets & Traditional Snacks",
      slug: "sweets-snacks",
      description: "Heritage Bihari treats prepared in pure desi ghee and jaggery.",
      image: "/images/products/thekua.jpg",
    },
  });

  const catStaples = await prisma.category.upsert({
    where: { slug: "staples-superfoods" },
    update: {
      image: "/images/products/sattu.jpg",
    },
    create: {
      name: "Sattu & Superfoods",
      slug: "staples-superfoods",
      description: "100% stone-ground roasted Bengal gram sattu. High protein, cooling, and nutrient-dense.",
      image: "/images/products/sattu.jpg",
    },
  });

  const catPickles = await prisma.category.upsert({
    where: { slug: "pickles-aachar" },
    update: {
      image: "/images/products/lal-mirch-aachar.jpg",
    },
    create: {
      name: "Bihari Aachar & Chutney",
      slug: "pickles-aachar",
      description: "Handcrafted pickles sun-cured in raw kachi ghani mustard oil with heirloom spice blends.",
      image: "/images/products/lal-mirch-aachar.jpg",
    },
  });

  const catDairy = await prisma.category.upsert({
    where: { slug: "pure-desi-ghee" },
    update: {
      image: "/images/products/desi-ghee.jpg",
    },
    create: {
      name: "Pure Bilona Desi Ghee",
      slug: "pure-desi-ghee",
      description: "Traditional bilona churned golden ghee with irresistible danedar texture and aroma.",
      image: "/images/products/desi-ghee.jpg",
    },
  });

  // 2. Product 1: Khasta Thekua
  const thekua = await prisma.product.upsert({
    where: { slug: "shuddh-ghee-khasta-thekua" },
    update: {
      name: "Shuddh Desi Ghee Khasta Thekua",
      tagline: "Authentic Chhath Mahaparv Style Crunchy Thekua",
    },
    create: {
      name: "Shuddh Desi Ghee Khasta Thekua",
      slug: "shuddh-ghee-khasta-thekua",
      tagline: "Authentic Chhath Mahaparv Style Crunchy Thekua",
      description:
        "Handcrafted using heritage wooden dies (saancha), whole wheat flour, Desi cow ghee, organic jaggery, fennel seeds (saunf), and crushed green cardamom. Crisp on the outside with a melt-in-the-mouth crumb.",
      ingredients: "Whole Wheat Atta, Shuddh Desi Ghee, Organic Gur (Jaggery), Saunf, Choti Elaichi, Dry Coconut.",
      features: ["100% Pure Desi Ghee", "No Palm Oil or Dalda", "No Artificial Preservatives", "Handcrafted in Small Batches"],
      shelfLife: "45 Days",
      isFeatured: true,
      categoryId: catSweets.id,
      variants: {
        create: [
          { weight: "500g", price: 299, mrp: 350, stock: 150, sku: "THK-500G" },
          { weight: "1kg", price: 549, mrp: 650, stock: 100, sku: "THK-1000G" },
        ],
      },
    },
  });

  await prisma.productImage.deleteMany({ where: { productId: thekua.id } });
  await prisma.productImage.create({
    data: {
      productId: thekua.id,
      url: "/images/products/thekua.jpg",
      alt: "Authentic Bihari Khasta Thekua made in pure desi ghee",
      isPrimary: true,
    },
  });

  // 3. Product 2: Stone Ground Chana Sattu
  const sattu = await prisma.product.upsert({
    where: { slug: "desi-chana-sattu" },
    update: {
      name: "Traditional Stone-Ground Chana Sattu",
      tagline: "Bihar's Ancient High-Protein Power Drink & Paratha Filling",
    },
    create: {
      name: "Traditional Stone-Ground Chana Sattu",
      slug: "desi-chana-sattu",
      tagline: "Bihar's Ancient High-Protein Power Drink & Paratha Filling",
      description:
        "Made from premium roasted Bengal gram (chana) dry-roasted in hot sand pits and slow ground on traditional stone mills to retain dietary fiber, natural vitamins, and intense nutty aroma. Perfect for Sattu Sharbat, Litti Chokha, and Parathas.",
      ingredients: "100% Roasted Bengal Gram (Chana) with roasted skin intact.",
      features: ["26g Natural Plant Protein per 100g", "Zero Added Sugar", "Stone Mill Ground", "Digestive Superfood"],
      shelfLife: "90 Days",
      isFeatured: true,
      categoryId: catStaples.id,
      variants: {
        create: [
          { weight: "500g", price: 149, mrp: 180, stock: 200, sku: "SAT-500G" },
          { weight: "1kg", price: 279, mrp: 340, stock: 180, sku: "SAT-1000G" },
        ],
      },
    },
  });

  await prisma.productImage.deleteMany({ where: { productId: sattu.id } });
  await prisma.productImage.create({
    data: {
      productId: sattu.id,
      url: "/images/products/sattu.jpg",
      alt: "Traditional stone ground roasted chana sattu",
      isPrimary: true,
    },
  });

  // 4. Product 3: Lal Mirch Bharua Aachar
  const aachar = await prisma.product.upsert({
    where: { slug: "bihari-lal-mirch-bharua-aachar" },
    update: {
      name: "Bihari Lal Mirch Bharua Aachar (Stuffed Red Chilli)",
      tagline: "Sun-Cured Grandma's Recipe in Cold-Pressed Mustard Oil",
    },
    create: {
      name: "Bihari Lal Mirch Bharua Aachar (Stuffed Red Chilli)",
      slug: "bihari-lal-mirch-bharua-aachar",
      tagline: "Sun-Cured Grandma's Recipe in Cold-Pressed Mustard Oil",
      description:
        "Plump whole Banarasi red chillies hand-stuffed with a spicy, tangy blend of amchoor (raw mango powder), roasted methi, yellow mustard seeds, saunf, and kalonji, steeped in pure wood-pressed kachi ghani mustard oil under the Bihar sun for 21 days.",
      ingredients: "Select Red Chillies, Pure Mustard Oil, Amchoor, Rai, Saunf, Fenugreek, Ajwain, Black Salt, Spices.",
      features: ["21 Days Sun-Matured", "Raw Kachi Ghani Mustard Oil", "No Synthetic Vinegar", "Authentic Bihari Swad"],
      shelfLife: "1 Year",
      isFeatured: true,
      categoryId: catPickles.id,
      variants: {
        create: [
          { weight: "400g Jar", price: 280, mrp: 340, stock: 120, sku: "LMR-400G" },
          { weight: "800g Jar", price: 520, mrp: 620, stock: 80, sku: "LMR-800G" },
        ],
      },
    },
  });

  await prisma.productImage.deleteMany({ where: { productId: aachar.id } });
  await prisma.productImage.create({
    data: {
      productId: aachar.id,
      url: "/images/products/lal-mirch-aachar.jpg",
      alt: "Bihari Bharua Lal Mirchi Pickle in Mustard Oil",
      isPrimary: true,
    },
  });

  // 5. Product 4: Danedar Desi Ghee
  const ghee = await prisma.product.upsert({
    where: { slug: "bilona-danedar-desi-ghee" },
    update: {
      name: "Bilona Danedar Shuddh Desi Ghee",
      tagline: "Slow-Simmered Cultured Butter with Rich Danedar Granules",
    },
    create: {
      name: "Bilona Danedar Shuddh Desi Ghee",
      slug: "bilona-danedar-desi-ghee",
      tagline: "Slow-Simmered Cultured Butter with Rich Danedar Granules",
      description:
        "Made via the ancient Vedic Bilona method from naturally fermented whole milk curd. Churned using wooden bilona, then slow-cooked over earthen flames to yield golden, aromatic, deeply granular (danedar) ghee with an authentic village fragrance.",
      ingredients: "100% Clarified Butter made from cultured whole milk curd.",
      features: ["Vedic Bilona Churned", "Danedar Golden Texture", "Rich in Butyric Acid & Omega-3", "Zero Adulteration"],
      shelfLife: "12 Months",
      isFeatured: true,
      categoryId: catDairy.id,
      variants: {
        create: [
          { weight: "500ml Glass Jar", price: 699, mrp: 850, stock: 90, sku: "GHE-500ML" },
          { weight: "1000ml Glass Jar", price: 1349, mrp: 1600, stock: 60, sku: "GHE-1000ML" },
        ],
      },
    },
  });

  await prisma.productImage.deleteMany({ where: { productId: ghee.id } });
  await prisma.productImage.create({
    data: {
      productId: ghee.id,
      url: "/images/products/desi-ghee.jpg",
      alt: "Vedic Bilona Danedar Pure Desi Ghee",
      isPrimary: true,
    },
  });

  // 6. Product 5: Aam Ka Khatta Meetha Aachar
  const aam = await prisma.product.upsert({
    where: { slug: "bihari-aam-ka-khatta-meetha-aachar" },
    update: {
      name: "Bihari Aam Ka Khatta-Meetha Gur Aachar",
      tagline: "Tangy Green Mangoes Simmered in Desi Jaggery and Panchphoran",
    },
    create: {
      name: "Bihari Aam Ka Khatta-Meetha Gur Aachar",
      slug: "bihari-aam-ka-khatta-meetha-aachar",
      tagline: "Tangy Green Mangoes Simmered in Desi Jaggery and Panchphoran",
      description:
        "Tender raw mango slices naturally preserved with pure country jaggery, mild chilli, and the classic Bihari five-spice (Panchphoran). The perfect sweet, tangy, and crunchy accompaniment for mathri, thekua, and paratha.",
      ingredients: "Raw Mango, Pure Desi Gur, Panch Phoran, Mustard Oil, Rock Salt, Kashmiri Degi Mirch.",
      features: ["Gur Sweetened", "Natural Probiotic Sun-cured", "Preservative Free"],
      shelfLife: "1 Year",
      isFeatured: false,
      categoryId: catPickles.id,
      variants: {
        create: [
          { weight: "400g Jar", price: 249, mrp: 300, stock: 110, sku: "AAM-400G" },
        ],
      },
    },
  });

  await prisma.productImage.deleteMany({ where: { productId: aam.id } });
  await prisma.productImage.create({
    data: {
      productId: aam.id,
      url: "/images/products/aam-aachar.jpg",
      alt: "Sweet & Tangy Mango Pickle with Jaggery",
      isPrimary: true,
    },
  });

  console.log("✅ Seed completed successfully with authentic local product imagery!");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
