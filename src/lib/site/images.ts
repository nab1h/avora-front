/**
 * ASSET STRATEGY
 * --------------
 * Temporary curated stock photography (Unsplash) in a consistent warm /
 * architectural style. Replace these IDs with real brand and product
 * assets — every image reference in the site flows through this file,
 * so the swap is one place.
 */
const unsplash = (id: string, w = 1600, h?: number) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=80${h ? `&h=${h}` : ""}`;

const IDS = {
  heroBulbs: "photo-1507473885765-e6ed057f782c",
  bulbDetail: "photo-1513506003901-1e6a229e2d15",
  warmInterior: "photo-1524758631624-e2822e304c36",
  livingRoom: "photo-1493809842364-78817add7ffb",
  studioDetail: "photo-1519710164239-da123dc03ef4",
} as const;

export const siteImages = {
  hero: unsplash(IDS.heroBulbs, 2200),
  editorial: unsplash(IDS.bulbDetail, 2200),
  categories: [
    unsplash(IDS.bulbDetail),
    unsplash(IDS.warmInterior),
    unsplash(IDS.livingRoom),
  ],
  products: [
    unsplash(IDS.heroBulbs, 1200),
    unsplash(IDS.bulbDetail, 1200),
    unsplash(IDS.warmInterior, 1200),
    unsplash(IDS.livingRoom, 1200),
    unsplash(IDS.studioDetail, 1200),
  ],
};

export const productImage = (index: number) =>
  siteImages.products[index % siteImages.products.length];