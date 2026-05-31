"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import CheckoutSteps from "@/components/shared/checkout-steps";
import { updateCartShippingAddress, updateCartGuestEmail } from "@/lib/actions/cart.actions"; 
import { shippingAddressSchema } from "@/lib/validators";
import { z } from "zod";

interface BoxNowSelectedData {
  boxnowLockerId: string;
  boxnowLockerAddressLine1?: string;
}

interface BoxNowConfig {
  partnerId: number;
  parentElement: string;
  type: "popup" | "iframe";
  autoclose: boolean;
  gps: boolean;
  afterSelect: (selected: BoxNowSelectedData) => void;
}

declare global {
  interface Window {
    _bn_afterSelect?: (selected: BoxNowSelectedData) => void;
    _bn_map_widget_config?: BoxNowConfig;
  }
}

type ShippingFormValues = z.infer<typeof shippingAddressSchema>;

const ShippingDetailsPage = () => {
  const router = useRouter();
  
  const [shippingMethod, setShippingMethod] = useState<string>("");
  const [boxNowLocker, setBoxNowLocker] = useState<{ id: string; address: string } | null>(null);
  const [isMapOpen, setIsMapOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const scriptLoadedRef = useRef(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    streetName: "",
    streetNumber: "",
    postalCode: "",
    phoneNumber: "",
  });

  // Αποφυγή Hydration Error χωρίς useEffect state updates
  const isServer = useMemo(() => typeof window === "undefined", []);

  useEffect(() => {
    if (isServer || scriptLoadedRef.current) return;
    scriptLoadedRef.current = true;

    window._bn_afterSelect = (selected: BoxNowSelectedData) => {
      if (selected?.boxnowLockerId) {
        setBoxNowLocker({ 
          id: selected.boxnowLockerId, 
          address: selected.boxnowLockerAddressLine1 || "" 
        });
        setShippingMethod("boxnow");
      }
      setIsMapOpen(false);
    };

    window._bn_map_widget_config = {
      partnerId: 9083, 
      parentElement: "#boxnowmap", 
      type: "popup", 
      autoclose: true, 
      gps: true,
      afterSelect: (selected: BoxNowSelectedData) => window._bn_afterSelect?.(selected),
    };

    const script = document.createElement("script");
    script.src = "https://widget-cdn.boxnow.gr/map-widget/client/v5.js";
    script.async = true;
    document.head.appendChild(script);
  }, [isServer]);

  const openBoxNow = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsMapOpen(true);
    
    setTimeout(() => { 
      const btn = document.querySelector(".boxnow-map-widget-button") as HTMLButtonElement;
      if (btn) {
        btn.click();
      }
    }, 50);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    const payload = {
      ...formData,
      shippingMethod,
      boxnowLockerId: boxNowLocker?.id || "",
    };

    const validation = shippingAddressSchema.safeParse(payload);
    if (!validation.success) {
      setError(validation.error.message);
      setIsSubmitting(false);
      return;
    }

    try {
      await updateCartGuestEmail(formData.email);
      const res = await updateCartShippingAddress(validation.data as ShippingFormValues);
      if (res.success) router.push("/payment-method");
      else setError(res.message);
    } catch {
      setError("An unexpected error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isServer) return <div className="min-h-screen bg-zinc-950" />;

  return (
    <>
      <CheckoutSteps current={1} />
      <div className="max-w-3xl mx-auto space-y-8 bg-zinc-950 p-8 border border-white/5 mt-10">
        
        {createPortal(
          <div 
            id="boxnowmap" 
            style={{ 
              position: "fixed", 
              top: 0, left: 0, width: "100%", height: "100%", 
              zIndex: 9999, backgroundColor: "rgba(0,0,0,0.8)",
              visibility: isMapOpen ? "visible" : "hidden",
              opacity: isMapOpen ? 1 : 0,
              pointerEvents: isMapOpen ? "auto" : "none",
              transition: "opacity 0.2s ease"
            }}
          >
            {/* Το default class name που ψάχνει το script της BoxNow */}
            <button className="boxnow-map-widget-button hidden" type="button">Select</button>
          </div>,
          document.body
        )}

        <div className="space-y-4">
          <h3 className="text-[#c5a059] text-[10px] font-bold uppercase tracking-widest italic">Shipping Method</h3>
          <RadioGroup value={shippingMethod} onValueChange={setShippingMethod} className="grid grid-cols-2 gap-4">
            <div onClick={() => { setBoxNowLocker(null); setShippingMethod("elta"); }}>
              <RadioGroupItem value="elta" id="elta" className="sr-only peer" />
              <Label htmlFor="elta" className="block p-4 bg-zinc-900 border border-white/5 peer-data-[state=checked]:border-[#c5a059] cursor-pointer text-xs uppercase text-center transition-all hover:bg-zinc-800">
                ELTA Courier
              </Label>
            </div>
            <div onClick={openBoxNow}>
              <RadioGroupItem value="boxnow" id="boxnow" className="sr-only peer" />
              <Label htmlFor="boxnow" className="block p-4 bg-zinc-900 border border-white/5 peer-data-[state=checked]:border-[#c5a059] cursor-pointer text-xs uppercase text-center transition-all hover:bg-zinc-800">
                {boxNowLocker ? `Locker: ${boxNowLocker.id}` : "BoxNow Map"}
              </Label>
            </div>
          </RadioGroup>
          {boxNowLocker && (
             <p className="text-[#c5a059] text-[10px] font-mono">Locker: {boxNowLocker.id}</p>
          )}
        </div>

        {shippingMethod && (
          <form onSubmit={handleSubmit} className="space-y-6 animate-in fade-in duration-500">
            {error && <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-500 text-[10px] uppercase font-mono">{error}</div>}
            
            <div className="grid grid-cols-2 gap-4">
              <Input name="firstName" placeholder="FIRST NAME" onChange={handleInputChange} required className="bg-zinc-900 border-white/10 rounded-none focus:border-[#c5a059]" />
              <Input name="lastName" placeholder="LAST NAME" onChange={handleInputChange} required className="bg-zinc-900 border-white/10 rounded-none focus:border-[#c5a059]" />
            </div>
            <Input name="email" type="email" placeholder="EMAIL" onChange={handleInputChange} required className="bg-zinc-900 border-white/10 rounded-none focus:border-[#c5a059]" />
            <Input name="phoneNumber" placeholder="PHONE" onChange={handleInputChange} required className="bg-zinc-900 border-white/10 rounded-none focus:border-[#c5a059]" />

            {shippingMethod === "elta" && (
              <div className="grid grid-cols-3 gap-4 animate-in slide-in-from-top-2">
                <div className="col-span-2">
                  <Input name="streetName" placeholder="STREET" onChange={handleInputChange} required className="bg-zinc-900 border-white/10 rounded-none" />
                </div>
                <Input name="streetNumber" placeholder="NO" onChange={handleInputChange} required className="bg-zinc-900 border-white/10 rounded-none" />
                <div className="col-span-3">
                  <Input name="postalCode" placeholder="POSTAL CODE" onChange={handleInputChange} required className="bg-zinc-900 border-white/10 rounded-none" />
                </div>
              </div>
            )}

            <button 
              type="submit" 
              disabled={isSubmitting} 
              className="w-full bg-[#c5a059] text-black py-4 text-[11px] font-black tracking-[0.2em] hover:bg-white transition-colors uppercase disabled:opacity-50"
            >
              {isSubmitting ? "Processing..." : "Continue to Payment"}
            </button>
          </form>
        )}
      </div>
    </>
  );
};

export default ShippingDetailsPage;