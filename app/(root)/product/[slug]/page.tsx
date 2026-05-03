"use client"

import React, { useState } from 'react';
import { HiChevronLeft, HiPlus, HiMinus, HiCheck } from 'react-icons/hi';
import { MdOutlineShoppingBag } from 'react-icons/md';
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

const ProductPage = () => {
  const [size, setSize] = useState('50ml');
  const [quantity, setQuantity] = useState(1);
  const [selectedExtras, setSelectedExtras] = useState<string[]>([]);

  const sizes = [
    { label: '30ml', price: 9 },
    { label: '50ml', price: 13 },
    { label: '100ml', price: 18 },
  ];

  const extras = [
    { id: 'lotion', label: 'Body Lotion', price: 12 },
    { id: 'gel', label: 'Shower Gel', price: 10 },
    { id: 'oil', label: 'Body Oil', price: 14 },
    { id: 'beard', label: 'Beard Oil', price: 11 },
    { id: 'car', label: 'Car Fragrance', price: 8 },
  ];

  const toggleExtra = (id: string) => {
    setSelectedExtras(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const basePrice = sizes.find(s => s.label === size)?.price || 0;
  const extrasPrice = extras
    .filter(item => selectedExtras.includes(item.id))
    .reduce((sum, item) => sum + item.price, 0);
  const totalPrice = (basePrice + extrasPrice) * quantity;

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white font-sans p-4 mt-5 md:p-8 selection:bg-[#c5a059]/30">
      {/* Header */}
      <header className="flex justify-between items-center mb-8 border-b border-white/10 pb-4">
        <button className="flex items-center text-[10px] tracking-widest uppercase opacity-60 hover:opacity-100 transition-opacity">
          <HiChevronLeft className="text-sm mr-1" /> Back
        </button>
        <h1 className="text-xl tracking-[0.4em] font-serif text-[#c5a059] uppercase">Opium</h1>
        <div className="w-10" />
      </header>

      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16">
        
        {/* Left Side: Product Image */}
        <div className="relative aspect-[4/5] bg-[#0f0f0f] border border-white/5 flex items-center justify-center p-12">
          <div className="absolute top-6 left-6 bg-[#c5a059] text-black text-[9px] font-bold px-2.5 py-1 tracking-tighter">
            40% OIL
          </div>
          <img 
            src="/perfume-bottle.png" 
            alt="Opium Inspired" 
            className="h-full object-contain drop-shadow-2xl"
          />
        </div>

        {/* Right Side: Configuration */}
        <div className="flex flex-col space-y-10">
          <div>
            <h2 className="text-6xl font-serif mb-6 tracking-tight">Inspired</h2>
            <p className="text-gray-500 text-sm leading-relaxed max-w-sm">
              Η νότα κορυφής είναι λεμόνι. Η μεσαία νότα είναι Καφές. Η νότα της βάσης είναι πατσουλί.
            </p>
          </div>

          {/* Size */}
          <div className="space-y-4">
            <span className="text-[10px] tracking-[0.2em] uppercase text-gray-500 font-semibold">Select Size</span>
            <RadioGroup defaultValue="50ml" onValueChange={setSize} className="grid grid-cols-3 gap-3">
              {sizes.map((s) => (
                <div key={s.label}>
                  <RadioGroupItem value={s.label} id={s.label} className="sr-only peer" />
                  <Label
                    htmlFor={s.label}
                    className="flex flex-col items-center py-4 border border-white/10 peer-data-[state=checked]:border-[#c5a059] peer-data-[state=checked]:bg-[#c5a059]/5 cursor-pointer hover:border-white/30 transition-all"
                  >
                    <span className="text-xs font-medium">{s.label}</span>
                    <span className="text-[#c5a059] text-[10px] mt-1">€{s.price}</span>
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          {/* Luxury Extras List */}
          <div className="space-y-4">
            <span className="text-[10px] tracking-[0.2em] uppercase text-gray-500 font-semibold">Complete Your Set</span>
            <div className="divide-y divide-white/5 border-y border-white/5">
              {extras.map((item) => {
                const active = selectedExtras.includes(item.id);
                return (
                  <button
                    key={item.id}
                    onClick={() => toggleExtra(item.id)}
                    className="w-full flex items-center justify-between py-4 group transition-all"
                  >
                    <div className="flex items-center gap-4">
                      <div className={cn(
                        "w-4 h-4 border border-white/20 flex items-center justify-center transition-all",
                        active ? "bg-[#c5a059] border-[#c5a059]" : "group-hover:border-[#c5a059]/50"
                      )}>
                        {active && <HiCheck className="text-black text-xs" />}
                      </div>
                      <span className={cn("text-sm transition-colors", active ? "text-white" : "text-gray-400 group-hover:text-white")}>
                        {item.label}
                      </span>
                    </div>
                    <span className={cn("text-[11px] font-medium transition-colors", active ? "text-[#c5a059]" : "text-gray-600")}>
                      +€{item.price}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Footer: Quantity & Add to Cart */}
          <div className="pt-4 space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center bg-white/5 border border-white/10">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="p-3 hover:text-[#c5a059] transition-colors"><HiMinus size={14} /></button>
                <span className="w-12 text-center text-sm font-medium">{quantity}</span>
                <button onClick={() => setQuantity(quantity + 1)} className="p-3 hover:text-[#c5a059] transition-colors"><HiPlus size={14} /></button>
              </div>
              <div className="text-right">
                <p className="text-[10px] tracking-widest text-gray-500 uppercase mb-1">Total Price</p>
                <p className="text-4xl font-serif text-[#c5a059]">€{totalPrice}</p>
              </div>
            </div>

            <Button className="w-full h-16 bg-[#c5a059] hover:bg-[#b08e4d] text-black rounded-none flex items-center justify-center gap-3 transition-transform active:scale-[0.98]">
              <MdOutlineShoppingBag size={20} />
              <span className="text-[11px] font-bold tracking-[0.2em] uppercase">Add to Cart — €{totalPrice}</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductPage;