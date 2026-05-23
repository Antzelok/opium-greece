"use client";

import React, { useState, useEffect, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import CheckoutSteps from "@/components/shared/checkout-steps";

const CheckoutPage = () => {
  const [shippingMethod, setShippingMethod] = useState("elta");
  const [boxNowLocker, setBoxNowLocker] = useState<{
    id: string;
    address: string;
  } | null>(null);
  const [isMapOpen, setIsMapOpen] = useState(false); // Track αν ο χάρτης είναι ανοιχτός για το pointer-events
  const scriptLoadedRef = useRef(false);

  useEffect(() => {
    if (scriptLoadedRef.current) return;
    scriptLoadedRef.current = true;

    const win = window as any;

    win._bn_afterSelect = (selected: any) => {
      console.log("BoxNow Selected:", selected);
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
      setIsMapOpen(false); // Κλείνει ο χάρτης, επαναφέρουμε το pointer-events
    };

    // Το config για το v5 widget
    win._bn_map_widget_config = {
      partnerId: "9083",
      parentElement: "#boxnowmap",
      type: "popup", // Αλλάχτηκε σε popup για να λειτουργεί σωστά το overlay
      autoclose: true,
      gps: true,
      afterSelect: (selected: any) => win._bn_afterSelect(selected),
    };

    const script = document.createElement("script");
    script.type = "text/javascript";
    script.src = "https://widget-cdn.boxnow.gr/map-widget/client/v5.js";
    script.async = true;
    script.defer = true;
    script.id = "boxnow-widget-script";

    script.onload = () => console.log("✓ BoxNow widget script loaded");
    script.onerror = () =>
      console.error("✗ Failed to load BoxNow widget script");

    document.head.appendChild(script);

    return () => {
      const scriptEl = document.getElementById("boxnow-widget-script");
      if (scriptEl) scriptEl.remove();
      delete win._bn_map_widget_config;
      delete win._bn_afterSelect;
      scriptLoadedRef.current = false;
    };
  }, []);

  const handleBoxNowSelect = () => {
    setShippingMethod("boxnow");
  };

  const openBoxNowWidget = () => {
    const triggerBtn = document.getElementById("boxnow-widget-trigger");
    if (triggerBtn) {
      setIsMapOpen(true); // Ενεργοποιούμε τα κλικ πριν ανοίξει ο χάρτης
      triggerBtn.click();
    }
  };

  return (
    <div className="min-h-screen bg-black text-white font-sans p-6 md:p-12">
      <CheckoutSteps current={2} />
      <div
        id="boxnowmap"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          zIndex: 9999,
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
          overflow: "hidden",
        }}
        aria-hidden="true"
        tabIndex={-1}
      >
        Open BoxNow
      </button>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {/* Left Form */}
        <div className="lg:col-span-2 space-y-8 bg-zinc-950 p-6 rounded-lg border border-zinc-900">
          <h2 className="text-xl font-semibold tracking-wider text-[#C5A861] uppercase">
            ΟΛΟΚΛΗΡΩΣΗ ΑΠΟΣΤΟΛΗΣ
          </h2>

          <div className="space-y-3">
            <span className="text-xs text-[#C5A861] uppercase tracking-wider block">
              ΕΠΙΛΟΓΗ ΜΕΤΑΦΟΡΙΚΗΣ (+€2.00)
            </span>

            <RadioGroup
              value={shippingMethod}
              onValueChange={setShippingMethod}
              className="grid grid-cols-1 md:grid-cols-2 gap-4"
            >
              {/* ELTA */}
              <Label
                htmlFor="elta"
                className={`flex items-start justify-between p-4 rounded-lg border cursor-pointer transition-all ${
                  shippingMethod === "elta"
                    ? "border-[#C5A861] bg-zinc-900"
                    : "border-zinc-800 bg-black"
                }`}
              >
                <div className="space-y-1">
                  <span className="font-bold block text-sm text-zinc-400">
                    ELTA COURIER
                  </span>
                  <span className="text-xs text-zinc-500 block">
                    ΠΑΡΑΔΟΣΗ ΣΤΟ ΧΩΡΟ ΣΑΣ
                  </span>
                  <span className="text-sm font-semibold mt-2 block">
                    + €2.00
                  </span>
                </div>
                <RadioGroupItem
                  value="elta"
                  id="elta"
                  className="border-zinc-600 text-[#C5A861]"
                />
              </Label>

              {/* BoxNow */}
              <Label
                htmlFor="boxnow"
                onClick={handleBoxNowSelect}
                className={`flex flex-col justify-between p-4 rounded-lg border cursor-pointer transition-all ${
                  shippingMethod === "boxnow"
                    ? "border-[#C5A861] bg-zinc-900"
                    : "border-zinc-800 bg-black"
                }`}
              >
                <div className="flex items-start justify-between w-full">
                  <div className="space-y-1">
                    <span className="font-bold block text-sm text-green-500">
                      BOX NOW
                    </span>
                    <span className="text-xs text-zinc-500 block">
                      ΕΠΙΛΟΓΗ ΑΠΟ ΧΑΡΤΗ
                    </span>
                    <span className="text-sm font-semibold mt-2 block">
                      + €2.00
                    </span>
                  </div>
                  <RadioGroupItem
                    value="boxnow"
                    id="boxnow"
                    className="border-zinc-600 text-[#C5A861]"
                  />
                </div>

                {shippingMethod === "boxnow" && (
                  <div className="mt-4 pt-4 border-t border-zinc-800 w-full space-y-3">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        openBoxNowWidget();
                      }}
                      className="w-full py-2 px-3 bg-green-600 text-white font-bold rounded text-xs tracking-wider uppercase text-center hover:bg-green-700 transition-colors"
                    >
                      {boxNowLocker ? "ΑΛΛΑΓΗ ΘΥΡΙΔΑΣ" : "ΕΠΙΛΕΞΤΕ ΘΥΡΙΔΑ"}
                    </button>

                    {boxNowLocker && (
                      <div className="p-2 bg-green-950/40 border border-green-800 rounded text-xs text-green-400">
                        <p className="font-bold">
                          ✓ Θυρίδα: #{boxNowLocker.id}
                        </p>
                        <p className="opacity-90">{boxNowLocker.address}</p>
                      </div>
                    )}
                  </div>
                )}
              </Label>
            </RadioGroup>
          </div>

          {/* Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
            <div className="space-y-2">
              <Label className="text-xs text-zinc-400 uppercase">
                Ονοματεπώνυμο
              </Label>
              <Input className="bg-black border-zinc-800 text-white focus:border-[#C5A861]" />
            </div>
            <div className="space-y-2">
              <Label className="text-xs text-zinc-400 uppercase">
                Τηλέφωνο
              </Label>
              <Input className="bg-black border-zinc-800 text-white focus:border-[#C5A861]" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
