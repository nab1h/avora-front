"use client";

import { useState } from "react";
import { Check, MessageCircle } from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import { formatPrice } from "@/lib/catalog/data";
import type { Product } from "@/lib/catalog/types";
import { cn } from "@/lib/utils";

type ProductInquiryProps = {
  product: Product;
  categoryName: string;
  locale: string;
  whatsapp?: string | null;
  label: string;
  subject: string;
};

export function ProductInquiry({ product, categoryName, locale, whatsapp, label, subject }: ProductInquiryProps) {
  const isArabic = locale === "ar";
  const colors = product.colors ?? [];
  const [selectedId, setSelectedId] = useState(colors[0]?.id);
  const selectedColor = colors.find((color) => color.id === selectedId);
  const number = whatsapp?.replace(/\D/g, "").replace(/^00/, "");
  const message = [
    `${subject}: ${product.name}`,
    isArabic ? "مرحبًا، أود الاستفسار عن السعر والتوفر والكمية المطلوبة للمنتج التالي:" : "Hello, I would like to ask about pricing, availability, and quantities for this product:",
    "",
    `${isArabic ? "اسم المنتج" : "Product"}: ${product.name}`,
    `${isArabic ? "رقم المنتج" : "Product ID"}: ${product.id}`,
    product.sku && `${isArabic ? "كود المنتج" : "SKU"}: ${product.sku}`,
    categoryName && `${isArabic ? "التصنيف" : "Category"}: ${categoryName}`,
    product.price !== undefined && `${isArabic ? "السعر المعروض" : "Listed price"}: ${formatPrice(product.price)}`,
    product.originalPrice !== undefined && `${isArabic ? "السعر قبل الخصم" : "Original price"}: ${formatPrice(product.originalPrice)}`,
    selectedColor && `${isArabic ? "اللون المطلوب" : "Selected color"}: ${selectedColor.name}}`,
    colors.length > 0 && `${isArabic ? "الألوان المتاحة" : "Available colors"}: ${colors.map((color) => color.name).join(isArabic ? "، " : ", ")}`,
    product.inStock !== undefined && `${isArabic ? "التوفر" : "Availability"}: ${product.inStock ? (isArabic ? "متوفر" : "In stock") : (isArabic ? "غير متوفر" : "Out of stock")}`,
    product.description && `\n${isArabic ? "الوصف" : "Description"}: ${product.description}`,
    ...(product.specs?.length ? ["", isArabic ? "الخصائص الفنية:" : "Technical specifications:", ...product.specs.map((spec) => `${spec.label}: ${spec.value}`)] : []),
  ].filter((line) => line !== false && line !== undefined && line !== null).join("\n");
  const href = number ? `https://wa.me/${number}?text=${encodeURIComponent(message)}` : `/${locale}/contact`;

  return (
    <div className="mt-8">
      {colors.length > 0 && (
        <fieldset className="mb-8">
          <legend className="mb-3 text-sm font-medium">
            {isArabic ? "اللون" : "Color"}
            <span className="ms-2 text-muted-foreground">{selectedColor?.name}</span>
          </legend>
          <div className="flex flex-wrap gap-3">
            {colors.map((color) => (
              <label key={color.id} className={cn("relative flex cursor-pointer items-center gap-2 rounded-md border bg-card px-3 py-2.5 text-sm transition-colors has-focus-visible:ring-2 has-focus-visible:ring-ring", selectedId === color.id ? "border-primary bg-primary/10" : "border-border hover:border-foreground/40")}>
                <input type="radio" name="product-color" value={color.id} checked={selectedId === color.id} onChange={() => setSelectedId(color.id)} className="sr-only" />
                <span aria-hidden="true" className="size-5 shrink-0 rounded-full border border-foreground/20" style={{ backgroundColor: color.hex ?? undefined }} />
                {color.name}
                {selectedId === color.id && <Check aria-hidden="true" className="size-3.5" />}
              </label>
            ))}
          </div>
        </fieldset>
      )}
      <a
        href={href}
        target={number ? "_blank" : undefined}
        rel={number ? "noopener noreferrer" : undefined}
        onClick={(event) => {
          if (number) {
            const withLink = `${message}\n\n${isArabic ? "رابط المنتج" : "Product link"}: ${window.location.href}`;
            event.currentTarget.href = `https://wa.me/${number}?text=${encodeURIComponent(withLink)}`;
          }
        }}
        className={buttonVariants({ size: "lg", className: "w-full sm:w-auto" })}
      >
        <MessageCircle aria-hidden="true" className="size-4" />
        {label}
      </a>
      {!number && <p className="mt-3 text-xs text-muted-foreground">{isArabic ? "تواصل معنا للاستفسار عن هذا المنتج." : "Contact us to ask about this product."}</p>}
    </div>
  );
}
