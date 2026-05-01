const sampleData = {
  products: [
    {
      name: "Sauvage Dior",
      slug: "sauvage-dior",
      category: "Men",
      brand: "Dior",
      description:
        "A radically fresh composition, dictated by a name that has the ring of a manifesto.",
      images: ["/product.jpg"],
      variants: {
        create: [
          { name: "100ml", type: "Perfume", price: "120.00" },
          { name: "200ml", type: "Shower Gel", price: "45.00" },
          { name: "50ml", type: "Beard Oil", price: "35.00" },
        ],
      },
    },
    {
      name: "Libre Le Parfum",
      slug: "libre-le-parfum",
      category: "Women",
      brand: "YSL",
      description: "The freedom to live everything with excess.",
      images: ["/product.jpg"],
      variants: {
        create: [
          { name: "50ml", type: "Perfume", price: "95.00" },
          { name: "90ml", type: "Perfume", price: "140.00" },
        ],
      },
    },
    {
      name: "Baccarat Rouge 540",
      slug: "baccarat-rouge-540",
      category: "Niche",
      brand: "Maison Francis Kurkdjian",
      description:
        "Luminous and sophisticated, Baccarat Rouge 540 lays on the skin like an amber, floral and woody breeze.",
      images: ["/product.jpg"],
      variants: {
        create: [
          { name: "70ml", type: "Perfume", price: "235.00" },
          { name: "200ml", type: "Perfume", price: "465.00" },
        ],
      },
    },
    {
      name: "Aventus",
      slug: "creed-aventus",
      category: "Niche",
      brand: "Creed",
      description:
        "The exceptional Aventus was inspired by the dramatic life of a historic emperor.",
      images: ["/product.jpg"],
      variants: {
        create: [{ name: "100ml", type: "Perfume", price: "295.00" }],
      },
    },
    {
      name: "Blue de Chanel",
      slug: "blue-de-chanel",
      category: "Men",
      brand: "Chanel",
      description:
        "A woody, aromatic fragrance for the man who defies convention.",
      images: ["/product.jpg"],
      variants: {
        create: [
          { name: "100ml", type: "Perfume", price: "115.00" },
          { name: "100ml", type: "After Shave", price: "65.00" },
        ],
      },
    },
    {
      name: "Black Opium",
      slug: "black-opium",
      category: "Women",
      brand: "YSL",
      description: "A glam rock fragrance full of mystery and energy.",
      images: ["/product.jpg"],
      variants: {
        create: [{ name: "50ml", type: "Perfume", price: "88.00" }],
      },
    },
    {
      name: "Layton",
      slug: "parfums-de-marly-layton",
      category: "Niche",
      brand: "Parfums de Marly",
      description: "An addictive composition that infuses ease and nobility.",
      images: ["/product.jpg"],
      variants: {
        create: [{ name: "125ml", type: "Perfume", price: "210.00" }],
      },
    },
    {
      name: "J’adore",
      slug: "dior-jadore",
      category: "Women",
      brand: "Dior",
      description:
        "An iconic fragrance, J’adore Eau de Parfum is the grand feminine floral by the House of Dior.",
      images: ["/product.jpg"],
      variants: {
        create: [{ name: "100ml", type: "Perfume", price: "135.00" }],
      },
    },
    {
      name: "Eros",
      slug: "versace-eros",
      category: "Men",
      brand: "Versace",
      description: "Love, passion, beauty and desire.",
      images: ["/product.jpg"],
      variants: {
        create: [
          { name: "100ml", type: "Perfume", price: "85.00" },
          { name: "250ml", type: "Shower Gel", price: "30.00" },
        ],
      },
    },
    {
      name: "Santall 33",
      slug: "le-labo-santal-33",
      category: "Niche",
      brand: "Le Labo",
      description:
        "A perfume that touches the sensual universality of this myth.",
      images: ["/product.jpg"],
      variants: {
        create: [{ name: "50ml", type: "Perfume", price: "180.00" }],
      },
    },
  ],
  users: [
    {
      name: "Admin User",
      email: "admin@example.com",
      password: "hashed_password_here",
      role: "admin",
    },
    {
      name: "John Doe",
      email: "user@example.com",
      password: "hashed_password_here",
      role: "user",
    },
  ],
};

export default sampleData;
