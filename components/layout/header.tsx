"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { IoMenu, IoSearch, IoClose } from "react-icons/io5"; // Χρήση IoClose για ομοιομορφία
import { CgProfile } from "react-icons/cg";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { Cart } from "@/types";
import CartDrawer from "../shared/cart-drawer";

const navItems = [
  { title: "ALL", href: "/shop-all" },
  { title: "FOR HIM", href: "/for-him" },
  { title: "FOR HER", href: "/for-her" },
  { title: "NICHE", href: "/niche" },
  { title: "MYSTERY-BOX", href: "/mystery-box" },
  { title: "STORES", href: "/stores" },
];

const Header = ({ cart }: { cart?: Cart }) => {
  const [isOpen, setIsOpen] = React.useState(false);

  const navLinkClass =
    "text-sm font-medium tracking-widest text-neutral-200 hover:text-white transition-colors";

  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-24 bg-black/10 backdrop-blur-lg border-b border-white/5">
      <nav className="container mx-auto px-4 h-full flex items-center justify-between">
        {/* --- MOBILE LAYOUT --- */}
        <div className="flex lg:hidden items-center justify-between w-full relative">
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="text-neutral-200 -ml-2 hover:bg-white/10"
              >
                <IoMenu className="h-6! w-6!" />
              </Button>
            </SheetTrigger>

            {/* Χρησιμοποιούμε [&>button]:hidden για να σβήσουμε το X της Shadcn */}
            <SheetContent
              side="left"
              className="w-72 bg-black p-0 border-r border-white/5 text-white outline-none [&>button]:hidden"
            >
              <div className="sr-only">
                <SheetTitle>Opium Greece Menu</SheetTitle>
                <SheetDescription>Main navigation</SheetDescription>
              </div>

              {/* CUSTOM HEADER ΟΠΩΣ ΣΤΟ CART */}
              <div className="flex items-center justify-between px-6 py-7 border-b border-white/5">
                <Image
                  src="/opium-logo.jpg"
                  alt="Logo"
                  width={100}
                  height={35}
                  priority
                  className="h-auto w-auto"
                />
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-neutral-500 hover:text-white transition-colors outline-none p-1"
                >
                  <IoClose className="h-6! w-6!" />
                </button>
              </div>

              <div className="flex flex-col">
                {navItems.map((item) => (
                  <Link
                    key={item.title}
                    href={item.href}
                    className={cn(
                      navLinkClass,
                      "px-6 py-5 border-b border-white/5 uppercase",
                    )}
                    onClick={() => setIsOpen(false)}
                  >
                    {item.title}
                  </Link>
                ))}
              </div>
            </SheetContent>
          </Sheet>

          <Link href="/" className="absolute left-1/2 -translate-x-1/2">
            <Image
              src="/opium-logo.jpg"
              alt="Logo"
              width={100}
              height={35}
              priority
              className="h-auto w-auto"
            />
          </Link>

          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="text-neutral-200 hover:bg-white/10"
            >
              <IoSearch className="h-6! w-6!" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="text-neutral-200 hover:bg-white/10"
            >
              <CgProfile className="h-6! w-6!" />
            </Button>
            <CartDrawer cart={cart} />
          </div>
        </div>

        {/* --- DESKTOP LAYOUT --- */}
        <div className="hidden lg:flex items-center justify-between w-full">
          <Link href="/" className="shrink-0">
            <Image
              src="/opium-logo.jpg"
              alt="Logo"
              width={120}
              height={45}
              priority
              className="brightness-110 hover:opacity-80 transition-opacity h-auto w-auto"
            />
          </Link>

          <div className="flex items-center space-x-8 xl:space-x-12">
            {navItems.map((item) => (
              <Link key={item.title} href={item.href} className={navLinkClass}>
                {item.title}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="text-neutral-200 hover:bg-white/10"
            >
              <IoSearch className="h-6! w-6!" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="text-neutral-200 hover:bg-white/10"
            >
              <CgProfile className="h-6! w-6!" />
            </Button>
            <CartDrawer cart={cart} />
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;
