import { Phone } from 'lucide-react';
import SocialPlatformIcon from '@/components/social-platform-icon';

type FloatingContactButtonsProps = {
  phone?: string | null;
  whatsapp?: string | null;
};

export default function FloatingContactButtons({
  phone,
  whatsapp,
}: FloatingContactButtonsProps) {
  const phoneLink = phone?.replace(/[^\d+]/g, '');
  const whatsappLink = whatsapp?.replace(/\D/g, '');

  if (!phoneLink && !whatsappLink) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-3">
      {whatsappLink && (
        <a
          href={`https://wa.me/${whatsappLink}`}
          target="_blank"
          rel="noreferrer"
          aria-label="Contact us on WhatsApp"
          title="WhatsApp"
          className="inline-flex size-12 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg transition-transform hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2"
        >
          <SocialPlatformIcon icon="whatsapp" className="size-5" />
        </a>
      )}
      {phoneLink && (
        <a
          href={`tel:${phoneLink}`}
          aria-label="Call us"
          title="Call us"
          className="inline-flex size-12 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg transition-transform hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        >
          <Phone className="size-5" />
        </a>
      )}
    </div>
  );
}