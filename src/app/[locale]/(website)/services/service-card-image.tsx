import Image from 'next/image';
import { Image as ImageIcon } from 'lucide-react';

import { getPublicAssetUrl } from '@/lib/services/public-assets';

type ServiceCardImageProps = {
  image: string | null;
  alt: string;
  className: string;
};

export default function ServiceCardImage({
  image,
  alt,
  className,
}: ServiceCardImageProps) {
  const imageUrl = getPublicAssetUrl(image);

  return (
    <div className={`relative overflow-hidden bg-muted ${className}`}>
      {imageUrl ? (
        <Image
          src={imageUrl}
          alt={alt}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          unoptimized
          className="object-cover"
        />
      ) : (
        <div
          aria-hidden="true"
          className="flex size-full items-center justify-center text-muted-foreground"
        >
          <ImageIcon className="size-8" />
        </div>
      )}
    </div>
  );
}