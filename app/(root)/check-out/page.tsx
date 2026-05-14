"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

export default function CheckOutPage() {
  return (
    <Card className="bg-zinc-950 border-white/5 rounded-lg md:p-6 animate-in fade-in duration-500">
      <CardContent className="p-0">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
          {/* Guest Section */}
          <div className="p-8 md:p-12 space-y-6">
            <CardHeader className="p-0 space-y-2">
              <CardTitle className="text-[#c5a059] text-md tracking-[0.2em] font-bold ">
                ΕΠΙΣΚΕΠΤΗΣ
              </CardTitle>
            </CardHeader>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-[10px] text-neutral-500 tracking-widest font-bold">
                  EMAIL ADDRESS
                </Label>
                <Input
                  type="email"
                  placeholder="name@example.com"
                  className="bg-black border-white/10 h-12 rounded-lg text-white focus-visible:ring-[#c5a059] placeholder:text-neutral-800"
                />
              </div>
              <Button
                asChild
                className="w-full bg-white text-black hover:bg-neutral-200 tracking-widest text-xs font-bold h-12 rounded-lg"
              >
                <Link href="/check-out/shipping">ΣΥΝΕΧΕΙΑ ΩΣ ΕΠΙΣΚΕΠΤΗΣ</Link>
              </Button>
            </div>
          </div>

          {/* Member Section */}
          <div className="p-8 md:p-12 space-y-6 bg-zinc-900/20 md:border-l md:border-white/5">
            <CardHeader className="p-0 space-y-2">
              <CardTitle className="text-[#c5a059] text-md tracking-[0.2em] font-bold uppercase">
                ΣΥΝΔΕΣΗ
              </CardTitle>
            </CardHeader>

            <form className="space-y-4">
              <div className="space-y-2">
                <Label className="text-[10px]  text-neutral-400 tracking-widest font-bold">
                  EMAIL
                </Label>
                <Input
                  type="email"
                  className="bg-black border-white/10 h-12 rounded-LG text-white focus-visible:ring-[#c5a059]"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] text-neutral-400 tracking-widest font-bold">
                  PASSWORD
                </Label>
                <Input
                  type="password"
                  className="bg-black border-white/10 h-12 rounded-lg text-white focus-visible:ring-[#c5a059]"
                />
              </div>
              <Button className="w-full bg-[#c5a059] hover:bg-[#b08e4d] text-black tracking-widest text-xs font-bold h-12 rounded-lg">
                ΕΙΣΟΔΟΣ
              </Button>
            </form>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
