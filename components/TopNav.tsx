"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { FiMenu, FiUser, FiLogOut, FiMoon, FiSun } from 'react-icons/fi';
import { useTheme } from '@/contexts/ThemeContext';
import { BrandLogo } from './BrandLogo';
import { Button } from './ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { signOut, useSession } from 'next-auth/react';
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

const navItems = [
    { href: '/dashboard', label: 'Dashboard' },
    { href: '/statistics', label: 'Statistics' },
    { href: '/profile', label: 'Profile' },
];

export function TopNav() {
    const pathname = usePathname();
    const { theme, toggleTheme } = useTheme();
    const { data: session } = useSession();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    return (
        <header className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
            <div className="container px-4 h-16 flex items-center justify-between">

                {/* Logo & Desktop Nav */}
                <div className="flex items-center gap-8">
                    <BrandLogo variant="full" width={140} href="/dashboard" className="active:scale-95 transition-transform" />

                    <nav className="hidden md:flex items-center gap-6">
                        {navItems.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`text-sm font-medium transition-colors hover:text-primary ${pathname === item.href
                                    ? "text-primary bg-primary/10 px-3 py-1.5 rounded-full"
                                    : "text-muted-foreground"
                                    }`}
                            >
                                {item.label}
                            </Link>
                        ))}
                    </nav>
                </div>

                {/* Right Application Menu */}
                <div className="flex items-center gap-4">
                    {/* Theme Toggle */}
                    {mounted && (
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={toggleTheme}
                            className="text-muted-foreground hover:text-foreground"
                        >
                            {theme === 'dark' ? <FiMoon size={20} /> : <FiSun size={20} />}
                        </Button>
                    )}

                    {/* User Menu */}
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="relative h-9 w-9 rounded-full ring-2 ring-border/50 hover:ring-primary/20 p-0 overflow-hidden">
                                <Avatar className="h-9 w-9">
                                    <AvatarImage src={session?.user?.image || ''} alt={session?.user?.name || ''} />
                                    <AvatarFallback className="bg-primary/10 text-primary">
                                        {session?.user?.name ? session.user.name.substring(0, 2).toUpperCase() : <FiUser />}
                                    </AvatarFallback>
                                </Avatar>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-56" align="end" forceMount>
                            <DropdownMenuLabel className="font-normal">
                                <div className="flex flex-col space-y-1">
                                    <p className="text-sm font-medium leading-none">{session?.user?.name}</p>
                                    <p className="text-xs leading-none text-muted-foreground">
                                        {session?.user?.email}
                                    </p>
                                </div>
                            </DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem asChild>
                                <Link href="/profile" className="flex items-center w-full cursor-pointer">
                                    <FiUser className="mr-2 h-4 w-4" />
                                    <span>Profile</span>
                                </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                                <Link href="/statistics" className="flex items-center w-full cursor-pointer">
                                    <div className="mr-2 h-4 w-4 flex items-center justify-center">
                                        <span className="block h-2 w-2 rounded-full bg-green-500" />
                                    </div>
                                    <span>Statistics</span>
                                </Link>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                                className="text-destructive focus:text-destructive cursor-pointer"
                                onClick={() => signOut({ callbackUrl: '/login' })}
                            >
                                <FiLogOut className="mr-2 h-4 w-4" />
                                <span>Log out</span>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>

                    {/* Mobile Menu */}
                    <div className="md:hidden">
                        <Sheet>
                            <SheetTrigger asChild>
                                <Button variant="ghost" size="icon">
                                    <FiMenu size={24} />
                                </Button>
                            </SheetTrigger>
                            <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                                <div className="flex flex-col gap-8 py-8">
                                    <div className="flex items-center gap-2">
                                        <div className="h-8 w-8 rounded-lg bg-primary text-primary-foreground flex items-center justify-center font-bold text-lg shadow-sm">
                                            P
                                        </div>
                                        <span className="text-xl font-bold tracking-tight text-foreground">Proficia</span>
                                    </div>
                                    <nav className="flex flex-col gap-2">
                                        {navItems.map((item) => (
                                            <Link
                                                key={item.href}
                                                href={item.href}
                                                className={`text-lg font-medium py-3 px-4 rounded-lg transition-colors ${pathname === item.href
                                                    ? "bg-secondary text-secondary-foreground"
                                                    : "text-muted-foreground hover:bg-secondary/20 hover:text-foreground"
                                                    }`}
                                            >
                                                {item.label}
                                            </Link>
                                        ))}
                                    </nav>
                                </div>
                            </SheetContent>
                        </Sheet>
                    </div>
                </div>
            </div>
        </header>
    );
}
