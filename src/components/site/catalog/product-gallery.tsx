"use client";

import { useState } from "react";
import Image from "next/image";

import { cn } from "@/lib/utils";

export function ProductGallery({ images, alt }: { images: string[]; alt: string }) {
  const [active, setActive] = useState(0);

  return (
    <div>
      <div className="relative aspect-[4/3] overflow-hidden rounded-md border bg-muted">
        <Image
          key={active}
          src={images[active]}
          alt={alt}
          fill
          priority={active === 0}
          sizes="(min-width: 1024px) 50vw, 100vw"
          className="animate-in fade-in-0 duration-300 object-cover"
        />
      </div>

      {images.length > 1 && (
        <div className="mt-4 flex gap-3" role="tablist" aria-label="Product images">
          {images.map((src, index) => (
            <button
              key={src + index}
              type="button"
              role="tab"
              aria-selected={index === active}
              aria-label={`View image ${index + 1}`}
              onClick={() => setActive(index)}
              className={cn(
                "relative size-20 overflow-hidden rounded border-2 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                index === active ? "border-primary" : "border-transparent hover:border-border"
              )}
            >
              <Image src={src} alt="" fill sizes="80px" className="object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}