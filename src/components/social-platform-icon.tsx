import {
    SiFacebook,
    SiInstagram,
    SiLinkerd,
    SiTiktok,
    SiYoutube,
    SiWhatsapp,
} from "@icons-pack/react-simple-icons";

interface Props {
    icon: string;
    className?: string;
}

export default function SocialPlatformIcon({
    icon,
    className = "size-5",
}: Props) {
    const icons: Record<string, React.ComponentType<any>> = {
        facebook: SiFacebook,
        instagram: SiInstagram,
        linkedin: SiLinkerd,
        tiktok: SiTiktok,
        youtube: SiYoutube,
        whatsapp: SiWhatsapp,
    };

    const Icon = icons[icon.toLowerCase()];

    if (!Icon) {
        return null;
    }

    return <Icon className={className} />;
}