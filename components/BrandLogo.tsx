"use client";

import { useTheme } from "@/contexts/ThemeContext";
import Image from "next/image";
import { useEffect, useState } from "react";
import Link from 'next/link';

interface BrandLogoProps {
    variant?: "icon" | "full";
    className?: string; // For container sizing
    width?: number;
    height?: number;
    href?: string;
}

export function BrandLogo({
    variant = "full",
    className = "",
    width,
    height,
    href = "/"
}: BrandLogoProps) {
    const { theme } = useTheme();
    const [mounted, setMounted] = useState(false);

    // Avoid hydration mismatch by waiting for mount
    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        // Return a placeholder or the default (usually light or dark depending on system pref, 
        // but better to render a transparent box of same size to avoid layout shift)
        // Or just render the 'Dark' version as default if that's safer for your design
        return (
            <div
                className={`${className} animate-pulse bg-muted/20 rounded-md`}
                style={{ width: width || (variant === 'icon' ? 40 : 150), height: height || 40 }}
            />
        );
    }

    const isDark = theme === "dark";

    // Define Logo Paths
    // Full Logo (Text + Icon style usually)
    const FullLogoLight = "/logo/Light_ProficiaTextLogo.svg";
    const FullLogoDark = "/logo/Dark_ProficiaTextLogo.svg";

    // Icon Only (P)
    const IconLogoLight = "/logo/Light_Logo.svg";
    const IconLogoDark = "/logo/Dark_logo.svg";

    const src = variant === "full"
        ? (isDark ? FullLogoDark : FullLogoLight)
        : (isDark ? IconLogoDark : IconLogoLight);

    // Default dimensions if not provided
    const defaultWidth = variant === "full" ? 140 : 40;
    const defaultHeight = 40;

    const content = (
        <Image
            src={src}
            alt="Proficia Logo"
            width={width || defaultWidth}
            height={height || defaultHeight}
            className={`object-contain ${className}`}
            priority
        />
    );

    if (href) {
        return <Link href={href} className="flex items-center hover:opacity-90 transition-opacity">{content}</Link>;
    }

    return content;
}
