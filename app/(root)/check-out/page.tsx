"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";

export default function CheckOutPage() {
  return (
    <div className="bg-zinc-950 border border-white/5 p-8 md:p-12 animate-in fade-in duration-500">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
        {/* Guest Section */}
        <div className="space-y-6">
          <h2 className="text-[#c5a059] text-md tracking-[0.2em] font-bold">
            ΕΠΙΣΚΕΠΤΗΣ
          </h2>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="text-[10px] uppercase text-neutral-500 tracking-widest font-bold">
                Email Address
              </Label>
              <Input
                type="email"
                className="bg-black border-white/10 h-12 rounded-lg text-white focus-visible:ring-[#c5a059]"
              />
            </div>
            <Button
              asChild
              className="w-full bg-white text-black hover:bg-neutral-200 tracking-widest text-sm font-bold h-12 rounded-lg"
            >
              <Link href="/check-out/shipping">ΣΥΝΕΧΕΙΑ ΩΣ ΕΠΙΣΚΕΠΤΗΣ</Link>
            </Button>
          </div>
        </div>

        {/* Member Section */}
        <div className="space-y-6 md:border-l md:border-white/5 md:pl-16">
          <h2 className="text-[#c5a059] text-md tracking-[0.2em] font-bold">
            ΣΥΝΔΕΣΗ
          </h2>
          <form className="space-y-4">
            <div className="space-y-2">
              <Label className="text-[10px] uppercase text-neutral-400 tracking-widest font-bold">
                Email
              </Label>
              <Input
                type="email"
                className="bg-black border-white/10 h-12 rounded-lg text-white focus-visible:ring-[#c5a059]"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-[10px] uppercase text-neutral-400 tracking-widest font-bold">
                Κωδικος
              </Label>
              <Input
                type="password"
                className="bg-black border-white/10 h-12 rounded-lg text-white focus-visible:ring-[#c5a059]"
              />
            </div>
            <Button className="w-full bg-[#c5a059] hover:bg-[#b08e4d] text-black tracking-widest text-sm font-bold h-12 rounded-lg">
              ΕΙΣΟΔΟΣ
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
