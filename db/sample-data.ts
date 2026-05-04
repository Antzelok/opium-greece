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
          { size: "30ml", type: "Perfume", price: "75.00" },
          { size: "50ml", type: "Perfume", price: "95.00" },
          { size: "100ml", type: "Perfume", price: "120.00" },
          { size: "Standard", type: "Shower Gel", price: "45.00" },
          { size: "Standard", type: "Beard Oil", price: "35.00" },
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
          { size: "30ml", type: "Perfume", price: "70.00" },
          { size: "50ml", type: "Perfume", price: "95.00" },
          { size: "90ml", type: "Perfume", price: "140.00" },
          { size: "Standard", type: "Body Lotion", price: "40.00" },
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
          { size: "35ml", type: "Perfume", price: "150.00" },
          { size: "70ml", type: "Perfume", price: "235.00" },
          { size: "200ml", type: "Perfume", price: "465.00" },
          { size: "Standard", type: "Body Cream", price: "85.00" },
        ],
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
          { size: "50ml", type: "Perfume", price: "90.00" },
          { size: "100ml", type: "Perfume", price: "115.00" },
          { size: "150ml", type: "Perfume", price: "150.00" },
          { size: "Standard", type: "After Shave", price: "65.00" },
        ],
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
          { size: "30ml", type: "Perfume", price: "55.00" },
          { size: "50ml", type: "Perfume", price: "70.00" },
          { size: "100ml", type: "Perfume", price: "85.00" },
          { size: "Standard", type: "Shower Gel", price: "30.00" },
        ],
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
