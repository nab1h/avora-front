/**
 * BRAND PLACEHOLDERS — replace every value here with real company
 * information as soon as it is available. Nothing else in the site
 * hardcodes names, contacts, or URLs.
 */
export const siteConfig = {
  name: "Company Name", // TODO: real brand name
  tagline: "Lighting & Electrical Supplies",
  description:
    "Architectural lighting and dependable electrical products, curated for homes, workplaces, and commercial projects.",
  contact: {
    address: "Street address — placeholder",
    phone: "+00 000 000 0000",
    email: "hello@example.com",
  },
  /** Add real social URLs here; the footer renders links only when present. */
  social: [] as Array<{ label: string; href: string }>,
  /** Flip to true once a real cart workflow exists. */
  features: { cart: false },
  /** TODO: set the real display currency used by the API. */
  currency: "USD",
} as const;

export const siteNav = [
  { label: "Home", href: "/" },
  { label: "Products", href: "/products" },
  { label: "Collections", href: "/#categories" },
  { label: "Why Us", href: "/#why-us" },
] as const;