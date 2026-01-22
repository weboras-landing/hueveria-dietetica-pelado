import { Instagram, Facebook } from "lucide-react";

const socialLinks = [
    {
        name: "Instagram",
        url: "https://www.instagram.com/lahueveria.cosquin/",
        icon: Instagram,
        color: "hover:text-pink-600",
        bgColor: "hover:bg-pink-50",
    },
    {
        name: "TikTok",
        url: "https://www.tiktok.com/@elpeladodelossandwiches",
        icon: ({ className }: { className?: string }) => (
            <svg
                className={className}
                viewBox="0 0 24 24"
                fill="currentColor"
                xmlns="http://www.w3.org/2000/svg"
            >
                <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
            </svg>
        ),
        color: "hover:text-black",
        bgColor: "hover:bg-gray-100",
    },
    {
        name: "Facebook",
        url: "https://www.facebook.com/lahueveriapiedraroja/?locale=es_LA",
        icon: Facebook,
        color: "hover:text-blue-600",
        bgColor: "hover:bg-blue-50",
    },
];

interface SocialLinksProps {
    className?: string;
    iconSize?: string;
    compact?: boolean;
}

export function SocialLinks({ className = "", iconSize = "h-5 w-5", compact = false }: SocialLinksProps) {
    const buttonSize = compact ? "w-8 h-8" : "w-10 h-10";

    return (
        <div className={`flex items-center gap-2 ${className}`}>
            {socialLinks.map((social) => (
                <a
                    key={social.name}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`flex items-center justify-center ${buttonSize} rounded-full bg-white border border-gray-200 text-gray-600 transition-all duration-300 hover:scale-110 hover:shadow-md ${social.color} ${social.bgColor} active:scale-95`}
                    aria-label={social.name}
                >
                    <social.icon className={iconSize} />
                </a>
            ))}
        </div>
    );
}
