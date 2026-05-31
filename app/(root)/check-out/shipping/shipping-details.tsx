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
      if (btn) btn.click();
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

  const inputStyle = "bg-zinc-900 border-white/10 rounded-xl h-12 focus:border-[#c5a059] focus:ring-1 focus:ring-[#c5a059]/20 transition-all placeholder:text-zinc-600 text-sm";

  return (
    <>
      <CheckoutSteps current={1} />
      {/* Max width αυξημένο σε 4xl */}
      <div className="max-w-4xl mx-auto space-y-10 bg-zinc-950 p-10 border border-white/5 mt-10 rounded-2xl shadow-xl">
        
        {createPortal(
          <div 
            id="boxnowmap" 
            style={{ 
              position: "fixed", top: 0, left: 0, width: "100%", height: "100%", 
              zIndex: 9999, backgroundColor: "rgba(0,0,0,0.85)",
              visibility: isMapOpen ? "visible" : "hidden",
              opacity: isMapOpen ? 1 : 0,
              pointerEvents: isMapOpen ? "auto" : "none",
              transition: "opacity 0.3s ease"
            }}
          >
            <button className="boxnow-map-widget-button hidden" type="button">Select</button>
          </div>,
          document.body
        )}

        <div className="space-y-6">
          <h3 className="text-[#c5a059] text-[11px] font-bold uppercase tracking-[0.2em] italic">Shipping Method</h3>
          <RadioGroup value={shippingMethod} onValueChange={setShippingMethod} className="grid grid-cols-2 gap-6">
            <div onClick={() => { setBoxNowLocker(null); setShippingMethod("elta"); }}>
              <RadioGroupItem value="elta" id="elta" className="sr-only peer" />
              <Label htmlFor="elta" className="block p-6 bg-zinc-900/50 border border-white/5 rounded-xl peer-data-[state=checked]:border-[#c5a059] peer-data-[state=checked]:bg-[#c5a059]/5 cursor-pointer text-[10px] uppercase tracking-widest text-center transition-all hover:bg-zinc-800">
                ELTA Courier
              </Label>
            </div>
            <div onClick={openBoxNow}>
              <RadioGroupItem value="boxnow" id="boxnow" className="sr-only peer" />
              <Label htmlFor="boxnow" className="block p-6 bg-zinc-900/50 border border-white/5 rounded-xl peer-data-[state=checked]:border-[#c5a059] peer-data-[state=checked]:bg-[#c5a059]/5 cursor-pointer text-[10px] uppercase tracking-widest text-center transition-all hover:bg-zinc-800">
                {boxNowLocker ? `Locker: ${boxNowLocker.id}` : "BoxNow Map"}
              </Label>
            </div>
          </RadioGroup>
          {boxNowLocker && (
             <p className="text-[#c5a059] text-[10px] font-mono tracking-tighter bg-[#c5a059]/10 w-fit px-3 py-1 rounded-full uppercase">
               Selected Locker: {boxNowLocker.id}
             </p>
          )}
        </div>

        {shippingMethod && (
          <form onSubmit={handleSubmit} className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
            {error && <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-500 text-[10px] uppercase font-mono rounded-lg">{error}</div>}
            
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label className="text-[9px] uppercase tracking-widest text-zinc-500 ml-1">First Name</Label>
                <Input name="firstName" placeholder="JOHN" onChange={handleInputChange} required className={inputStyle} />
              </div>
              <div className="space-y-2">
                <Label className="text-[9px] uppercase tracking-widest text-zinc-500 ml-1">Last Name</Label>
                <Input name="lastName" placeholder="DOE" onChange={handleInputChange} required className={inputStyle} />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label className="text-[9px] uppercase tracking-widest text-zinc-500 ml-1">Email</Label>
                <Input name="email" type="email" placeholder="EXAMPLE@MAIL.COM" onChange={handleInputChange} required className={inputStyle} />
              </div>
              <div className="space-y-2">
                <Label className="text-[9px] uppercase tracking-widest text-zinc-500 ml-1">Phone</Label>
                <Input name="phoneNumber" placeholder="6900000000" onChange={handleInputChange} required className={inputStyle} />
              </div>
            </div>

            {shippingMethod === "elta" && (
              <div className="grid grid-cols-3 gap-6 animate-in slide-in-from-top-2">
                <div className="col-span-2 space-y-2">
                  <Label className="text-[9px] uppercase tracking-widest text-zinc-500 ml-1">Street Name</Label>
                  <Input name="streetName" placeholder="STREET" onChange={handleInputChange} required className={inputStyle} />
                </div>
                <div className="space-y-2">
                  <Label className="text-[9px] uppercase tracking-widest text-zinc-500 ml-1">Number</Label>
                  <Input name="streetNumber" placeholder="NO" onChange={handleInputChange} required className={inputStyle} />
                </div>
                <div className="col-span-3 space-y-2">
                  <Label className="text-[9px] uppercase tracking-widest text-zinc-500 ml-1">Postal Code</Label>
                  <Input name="postalCode" placeholder="000 00" onChange={handleInputChange} required className={inputStyle} />
                </div>
              </div>
            )}

            <button 
              type="submit" 
              disabled={isSubmitting} 
              className="w-full bg-[#c5a059] text-black py-5 rounded-xl text-[11px] font-black tracking-[0.3em] hover:bg-white transition-all transform active:scale-[0.98] uppercase disabled:opacity-50 shadow-lg shadow-[#c5a059]/10"
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