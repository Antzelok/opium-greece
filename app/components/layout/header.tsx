"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, Search, ShoppingBag } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

// Ορισμός των πλοηγήσεων για εύκολη συντήρηση
const navItems = [
  { title: "SHOP ALL", href: "/shop-all" },
  { title: "MEN", href: "/men" },
  { title: "WOMEN", href: "/women" },
  { title: "NICHE", href: "/niche" },
  { title: "MYSTERY-BOX", href: "/mystery-box" },
  { title: "STORES", href: "/stores" },
];

const Header = () => {
  const [isOpen, setIsOpen] = React.useState(false);

  const navLinkClass =
    "text-xs font-medium tracking-widest text-neutral-200 hover:text-white transition-colors";

  return (
    <header className="fixed top-0 left-0 h-25 right-0 z-50 bg-black/10 backdrop-blur-lg bg-cover bg-center ">
      <nav className="container mx-auto px-4 h-20 flex items-center justify-between ">
        {/* --- MOBILE LAYOUT (< lg) --- */}
        <div className="flex lg:hidden items-center justify-between w-full">
          {/* Hamburger Menu (Left) - shadcn Sheet */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="text-neutral-200 -ml-2"
              >
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent
              side="left"
              className="w-75 bg-[#0a0a0a] p-0 border-neutral-800"
            >
              <div className="flex flex-col py-6">
                {/* Logo inside mobile menu */}
                <div className="px-6 mb-8">
                  <Image
                    src="/opium-logo.jpg"
                    alt="Opium Logo"
                    width={100}
                    height={40}
                    priority
                  />
                </div>
                {/* Mobile Links */}
                <div className="flex flex-col space-y-1">
                  {navItems.map((item) => (
                    <Link
                      key={item.title}
                      href={item.href}
                      className={cn(
                        navLinkClass,
                        "px-6 py-3 text-sm border-b border-neutral-800/50",
                      )}
                      onClick={() => setIsOpen(false)}
                    >
                      {item.title}
                    </Link>
                  ))}
                </div>
              </div>
            </SheetContent>
          </Sheet>

          {/* Logo (Middle) */}
          <Link href="/" className="absolute left-1/2 -translate-x-1/2">
            <Image
              src="/opium-logo.jpg"
              alt="Opium Logo"
              width={100}
              height={40}
              priority
            />
          </Link>

          {/* Icons (Right) */}
          <div className="flex items-center space-x-1">
            <Button variant="ghost" size="icon" className="text-neutral-200">
              <Search className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" className="text-neutral-200">
              <ShoppingBag className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* --- DESKTOP LAYOUT (>= lg) --- */}
        <div className="hidden lg:flex items-center justify-between w-full">
          {/* Logo (Left) */}
          <Link href="/" className="shrink-0">
            <Image
              src="/opium-logo.jpg"
              alt="Opium Logo"
              width={130}
              height={50}
              priority
            />
          </Link>

          {/* Navigation Pages (Middle) */}
          <div className="flex items-center space-x-6 xl:space-x-8">
            {navItems.map((item) => (
              <Link key={item.title} href={item.href} className={navLinkClass}>
                {item.title}
              </Link>
            ))}
          </div>

          {/* Icons (Right) */}
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="icon"
              className="text-neutral-200 hover:text-white hover:bg-neutral-800/50"
            >
              <Search className="h-5 w-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="text-neutral-200 hover:text-white hover:bg-neutral-800/50"
            >
              <ShoppingBag className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;
