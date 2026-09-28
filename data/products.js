/*
 * Catalogue data — the ONLY file that changes when stock or designs change.
 * Later this moves to an admin panel + database; the UI reads the same shape.
 *
 * stock:     sets available (0 = sold out, <= lowStockAt = "few left")
 * pcsPerSet: pieces (or metres, when unit is "m") in one wholesale set
 * pattern:   placeholder swatch style until real product photos are added
 */
window.MOHREY_CATALOGUE = {
  updatedAt: "2026-09-28",
  minOrderValue: 10000,
  lowStockAt: 5,
  whatsapp: "919999999999",
  categories: ["Sarees", "Kurtis", "Dress Materials", "Suiting", "Shirting", "Dupattas"],
  products: [
    { code: "MH-2417", name: "Banarasi Silk Saree", category: "Sarees", fabric: "Silk", pricePerPc: 1850, pcsPerSet: 4, stock: 18, isNew: true, colors: ["#6b1d24", "#1f3b2d", "#b8925a"], pattern: "brocade" },
    { code: "MH-2418", name: "Kanjivaram Border Saree", category: "Sarees", fabric: "Silk", pricePerPc: 2400, pcsPerSet: 4, stock: 3, isNew: true, colors: ["#8a3a1a", "#4a1030"], pattern: "border" },
    { code: "MH-2390", name: "Chanderi Cotton Saree", category: "Sarees", fabric: "Cotton", pricePerPc: 890, pcsPerSet: 6, stock: 40, isNew: false, colors: ["#c9ad86", "#8fa596", "#b97f7f"], pattern: "dots" },
    { code: "MH-2385", name: "Georgette Printed Saree", category: "Sarees", fabric: "Georgette", pricePerPc: 720, pcsPerSet: 6, stock: 0, isNew: false, colors: ["#3c4f7a", "#7a3c5a"], pattern: "floral" },

    { code: "MH-3120", name: "Anarkali Rayon Kurti", category: "Kurtis", fabric: "Rayon", pricePerPc: 540, pcsPerSet: 5, sizes: "S–XXL", stock: 25, isNew: true, colors: ["#2f4a3a", "#6b1d24", "#c9a86a"], pattern: "floral" },
    { code: "MH-3121", name: "Straight Cotton Kurti", category: "Kurtis", fabric: "Cotton", pricePerPc: 420, pcsPerSet: 5, sizes: "S–XXL", stock: 60, isNew: false, colors: ["#c9a86a", "#6b7f8f"], pattern: "stripe" },
    { code: "MH-3098", name: "Chikankari Kurti", category: "Kurtis", fabric: "Georgette", pricePerPc: 780, pcsPerSet: 5, sizes: "M–XXL", stock: 4, isNew: false, colors: ["#b9c9bd", "#d8c6b0"], pattern: "dots" },

    { code: "MH-4410", name: "Lawn Cotton Suit Set", category: "Dress Materials", fabric: "Cotton", pricePerPc: 650, pcsPerSet: 6, stock: 32, isNew: true, colors: ["#b5654a", "#3f5f6b"], pattern: "check" },
    { code: "MH-4402", name: "Muslin Embroidered Set", category: "Dress Materials", fabric: "Muslin", pricePerPc: 990, pcsPerSet: 4, stock: 12, isNew: false, colors: ["#5a2a3a", "#b08a70"], pattern: "brocade" },
    { code: "MH-4388", name: "Pashmina Winter Set", category: "Dress Materials", fabric: "Wool", pricePerPc: 1350, pcsPerSet: 4, stock: 0, isNew: false, colors: ["#4a3a30"], pattern: "check" },

    { code: "MH-5201", name: "Terry Rayon Suiting", category: "Suiting", fabric: "Poly-Viscose", pricePerPc: 310, unit: "m", pcsPerSet: 20, stock: 45, isNew: false, colors: ["#2b2f3a", "#4a4a4a", "#3a2f28"], pattern: "plain" },
    { code: "MH-5204", name: "Fine Wool Blend Suiting", category: "Suiting", fabric: "Wool", pricePerPc: 690, unit: "m", pcsPerSet: 20, stock: 8, isNew: true, colors: ["#1f2a44", "#3b3b3b"], pattern: "pinstripe" },

    { code: "MH-6010", name: "Oxford Cotton Shirting", category: "Shirting", fabric: "Cotton", pricePerPc: 240, unit: "m", pcsPerSet: 25, stock: 70, isNew: false, colors: ["#7f9bb8", "#b8a78f", "#b88f8f"], pattern: "stripe" },
    { code: "MH-6014", name: "Linen Blend Shirting", category: "Shirting", fabric: "Linen", pricePerPc: 380, unit: "m", pcsPerSet: 25, stock: 2, isNew: true, colors: ["#b5a585", "#8a9a8a"], pattern: "plain" },

    { code: "MH-7102", name: "Bandhani Silk Dupatta", category: "Dupattas", fabric: "Silk", pricePerPc: 460, pcsPerSet: 10, stock: 22, isNew: false, colors: ["#a3182e", "#c67a12", "#1a5a4a"], pattern: "dots" },
    { code: "MH-7108", name: "Phulkari Dupatta", category: "Dupattas", fabric: "Cotton", pricePerPc: 520, pcsPerSet: 10, stock: 15, isNew: true, colors: ["#6b1d24", "#c9962a"], pattern: "floral" }
  ]
};
