"use client";

import React, { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import CheckoutSteps from "@/components/shared/checkout-steps";

interface BoxNowSelectedData {
  boxnowLockerId: string;
  boxnowLockerAddressLine1?: string;
  boxnowLockerAddressLine2?: string;
}

interface BoxNowWindow extends Window {
  _bn_afterSelect?: (selected: BoxNowSelectedData) => void;
  _bn_map_widget_config?: {
    partnerId: string;
    parentElement: string;
    type: "popup" | "iframe";
    autoclose: boolean;
    gps: boolean;
    afterSelect: (selected: BoxNowSelectedData) => void;
  };
}

const ShippingDetailsPage = () => {
  const [shippingMethod, setShippingMethod] = useState<"elta" | "boxnow" | "">(
    "",
  );
  const [boxNowLocker, setBoxNowLocker] = useState<{
    id: string;
    address: string;
  } | null>(null);
  const [isMapOpen, setIsMapOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const scriptLoadedRef = useRef(false);

  // Form State
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    streetName: "",
    streetNumber: "",
    postalCode: "",
    phoneNumber: "",
  });

  useEffect(() => {
    const handle = requestAnimationFrame(() => {
      setMounted(true);
    });
    return () => cancelAnimationFrame(handle);
  }, []);

  useEffect(() => {
    if (scriptLoadedRef.current) return;
    scriptLoadedRef.current = true;

    const win = window as unknown as BoxNowWindow;

    win._bn_afterSelect = (selected: BoxNowSelectedData) => {
      if (selected && selected.boxnowLockerId) {
        setBoxNowLocker({
          id: selected.boxnowLockerId,
          address: [
            selected.boxnowLockerAddressLine1,
            selected.boxnowLockerAddressLine2,
          ]
            .filter(Boolean)
            .join(", "),
        });
        setShippingMethod("boxnow");
      }
      setIsMapOpen(false);
    };

    win._bn_map_widget_config = {
      partnerId: "9083",
      parentElement: "#boxnowmap",
      type: "popup",
      autoclose: true,
      gps: true,
      afterSelect: (selected: BoxNowSelectedData) =>
        win._bn_afterSelect?.(selected),
    };

    const script = document.createElement("script");
    script.type = "text/javascript";
    script.src = "https://widget-cdn.boxnow.gr/map-widget/client/v5.js";
    script.async = true;
    script.defer = true;
    script.id = "boxnow-widget-script";
    document.head.appendChild(script);

    return () => {
      const scriptEl = document.getElementById("boxnow-widget-script");
      if (scriptEl) scriptEl.remove();
      const cleanWin = window as unknown as BoxNowWindow;
      delete cleanWin._bn_map_widget_config;
      delete cleanWin._bn_afterSelect;
      scriptLoadedRef.current = false;
    };
  }, []);

  const openBoxNowWidget = () => {
    const triggerBtn = document.getElementById("boxnow-widget-trigger");
    if (triggerBtn) {
      setIsMapOpen(true);
      triggerBtn.click();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <>
      <CheckoutSteps current={1} />
      <div className="space-y-8 bg-zinc-950 p-8 border border-white/5 rounded-none">
        {mounted &&
          createPortal(
            <>
              <div
                id="boxnowmap"
                onClick={() => setIsMapOpen(false)}
                style={{
                  position: "fixed",
                  top: 0,
                  left: 0,
                  width: "100vw",
                  height: "100vh",
                  zIndex: 99999,
                  pointerEvents: isMapOpen ? "auto" : "none",
                }}
              />
              <button
                id="boxnow-widget-trigger"
                className="boxnow-map-widget-button"
                style={{
                  position: "absolute",
                  opacity: 0,
                  pointerEvents: "none",
                  width: 0,
                  height: 0,
                }}
                aria-hidden="true"
                tabIndex={-1}
              >
                Open
              </button>
            </>,
            document.body,
          )}

        {/* Header */}
        <div>
          <h2 className="text-[11px] font-black tracking-[0.2em] text-[#c5a059] uppercase italic mb-2">
            ΟΛΟΚΛΗΡΩΣΗ ΑΠΟΣΤΟΛΗΣ
          </h2>
          <div className="h-px bg-white/5 my-4" />
        </div>

        {/* Shipping Methods */}
        <div className="space-y-4">
          <span className="text-[10px] text-neutral-500 uppercase tracking-widest block font-bold">
            ΕΠΙΛΟΓΗ ΜΕΤΑΦΟΡΙΚΗΣ
          </span>

          <RadioGroup
            value={shippingMethod}
            onValueChange={(val) => setShippingMethod(val as "elta" | "boxnow")}
            className="grid grid-cols-1 sm:grid-cols-2 gap-4"
          >
            {/* ELTA Courier */}
            <Label
              htmlFor="elta"
              className={`flex items-start justify-between p-5 rounded-none border cursor-pointer transition-all ${
                shippingMethod === "elta"
                  ? "border-[#c5a059] bg-white/2"
                  : "border-white/5 bg-black hover:border-white/10"
              }`}
            >
              <div className="space-y-1">
                <span className="font-bold block text-[12px] uppercase tracking-wider text-neutral-200">
                  ELTA COURIER
                </span>
                <span className="text-[10px] text-neutral-500 block tracking-wide">
                  ΠΑΡΑΔΟΣΗ ΣΤΟ ΧΩΡΟ ΣΑΣ (ΑΝΤΙΚΑΤΑΒΟΛΗ)
                </span>
                <span className="text-xs font-mono mt-3 block text-[#c5a059]">
                  + €2.00
                </span>
              </div>
              <RadioGroupItem
                value="elta"
                id="elta"
                className="border-neutral-700 text-[#c5a059]"
              />
            </Label>

            {/* BoxNow */}
            <Label
              htmlFor="boxnow"
              onClick={() => setShippingMethod("boxnow")}
              className={`flex flex-col justify-between p-5 rounded-none border cursor-pointer transition-all ${
                shippingMethod === "boxnow"
                  ? "border-[#c5a059] bg-white/2"
                  : "border-white/5 bg-black hover:border-white/10"
              }`}
            >
              <div className="flex items-start justify-between w-full">
                <div className="space-y-1">
                  <span className="font-bold block text-[12px] uppercase tracking-wider text-green-500">
                    BOX NOW
                  </span>
                  <span className="text-[10px] text-neutral-500 block tracking-wide">
                    ΕΠΙΛΟΓΗ ΑΠΟ ΧΑΡΤΗ
                  </span>
                  <span className="text-xs font-mono mt-3 block text-green-500">
                    + €2.00
                  </span>
                </div>
                <RadioGroupItem
                  value="boxnow"
                  id="boxnow"
                  className="border-neutral-700 text-[#c5a059]"
                />
              </div>

              {shippingMethod === "boxnow" && (
                <div className="mt-4 pt-4 border-t border-white/5 w-full space-y-3">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      openBoxNowWidget();
                    }}
                    className="w-full py-2.5 px-4 bg-green-600 text-white font-black rounded-none text-[10px] tracking-widest uppercase text-center hover:bg-green-700 transition-colors"
                  >
                    {boxNowLocker ? "ΑΛΛΑΓΗ ΘΥΡΙΔΑΣ" : "ΕΠΙΛΕΞΤΕ ΘΥΡΙΔΑ"}
                  </button>

                  {boxNowLocker && (
                    <div className="p-3 bg-green-950/20 border border-green-900/30 rounded-none text-[11px] text-green-400">
                      <p className="font-bold uppercase tracking-wider">
                        ✓ Θυρίδα: #{boxNowLocker.id}
                      </p>
                      <p className="opacity-80 mt-1">{boxNowLocker.address}</p>
                    </div>
                  )}
                </div>
              )}
            </Label>
          </RadioGroup>
        </div>

        {/* Address Form Fields - Rendered Conditionally */}
        {shippingMethod !== "" && (
          <div className="space-y-4 pt-4 animate-in fade-in duration-300">
            <span className="text-[10px] text-neutral-500 uppercase tracking-widest block font-bold">
              ΣΤΟΙΧΕΙΑ ΑΠΟΣΤΟΛΗΣ & ΕΠΙΚΟΙΝΩΝΙΑΣ
            </span>

            {/* Όνομα / Επώνυμο */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-[10px] text-neutral-400 uppercase tracking-widest">
                  Όνομα
                </Label>
                <Input
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  className="bg-black border-white/5 text-white focus-visible:ring-1 focus-visible:ring-[#c5a059] rounded-none text-sm h-11"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] text-neutral-400 uppercase tracking-widest">
                  Επώνυμο
                </Label>
                <Input
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  className="bg-black border-white/5 text-white focus-visible:ring-1 focus-visible:ring-[#c5a059] rounded-none text-sm h-11"
                />
              </div>
            </div>

            {/* Email (Μόνο για BoxNow) & Τηλέφωνο Επικοινωνίας */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {shippingMethod === "boxnow" && (
                <div className="space-y-2">
                  <Label className="text-[10px] text-neutral-400 uppercase tracking-widest">
                    Email
                  </Label>
                  <Input
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="bg-black border-white/5 text-white focus-visible:ring-1 focus-visible:ring-[#c5a059] rounded-none text-sm h-11"
                  />
                </div>
              )}
              <div className="space-y-2 col-span-1">
                <Label className="text-[10px] text-neutral-400 uppercase tracking-widest">
                  Τηλέφωνο Επικοινωνίας
                </Label>
                <Input
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleInputChange}
                  className="bg-black border-white/5 text-white focus-visible:ring-1 focus-visible:ring-[#c5a059] rounded-none text-sm h-11"
                  type="tel"
                />
              </div>
            </div>

            {/* Οδός / Αριθμός / Τ.Κ. - Εμφανίζονται ΜΟΝΟ αν επιλεγεί ELTA */}
            {shippingMethod === "elta" && (
              <div className="space-y-4 animate-in fade-in duration-200">
                <div className="grid grid-cols-4 gap-4">
                  <div className="col-span-3 space-y-2">
                    <Label className="text-[10px] text-neutral-400 uppercase tracking-widest">
                      Οδός
                    </Label>
                    <Input
                      name="streetName"
                      value={formData.streetName}
                      onChange={handleInputChange}
                      className="bg-black border-white/5 text-white focus-visible:ring-1 focus-visible:ring-[#c5a059] rounded-none text-sm h-11"
                    />
                  </div>
                  <div className="col-span-1 space-y-2">
                    <Label className="text-[10px] text-neutral-400 uppercase tracking-widest">
                      Αριθμός
                    </Label>
                    <Input
                      name="streetNumber"
                      value={formData.streetNumber}
                      onChange={handleInputChange}
                      className="bg-black border-white/5 text-white focus-visible:ring-1 focus-visible:ring-[#c5a059] rounded-none text-sm h-11"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-[10px] text-neutral-400 uppercase tracking-widest">
                      Ταχυδρομικός Κώδικας (Τ.Κ.)
                    </Label>
                    <Input
                      name="postalCode"
                      value={formData.postalCode}
                      onChange={handleInputChange}
                      className="bg-black border-white/5 text-white focus-visible:ring-1 focus-visible:ring-[#c5a059] rounded-none text-sm h-11"
                      maxLength={5}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default ShippingDetailsPage;
