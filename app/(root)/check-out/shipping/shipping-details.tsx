"use client";

import React, {
  useState,
  useEffect,
  useRef,
  useSyncExternalStore,
  useTransition,
} from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import CheckoutSteps from "@/components/shared/checkout-steps";
import {
  updateCartShippingAddress,
  updateCartShippingMethod,
  updateCartGuestEmail,
} from "@/lib/actions/cart.actions";
import { shippingAddressSchema } from "@/lib/validators";
import { z } from "zod";
import { Button } from "@/components/ui/button";

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

const emptySubscribe = () => () => {};
const getClientSnapshot = () => true;
const getServerSnapshot = () => false;

const ShippingDetailsPage = () => {
  const router = useRouter();
  const [, startTransition] = useTransition();

  const isClient = useSyncExternalStore(
    emptySubscribe,
    getClientSnapshot,
    getServerSnapshot,
  );

  const [shippingMethod, setShippingMethod] = useState<string>("");
  const [boxNowLocker, setBoxNowLocker] = useState<{
    id: string;
    address: string;
  } | null>(null);
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


  useEffect(() => {
    if (!isClient) return;
    startTransition(async () => {
      await updateCartShippingMethod("");
      router.refresh();
    });
  }, [isClient, router]);

  useEffect(() => {
    if (!isClient || scriptLoadedRef.current) return;
    scriptLoadedRef.current = true;

    window._bn_afterSelect = async (selected: BoxNowSelectedData) => {
      if (selected?.boxnowLockerId) {
        const lockerData = {
          id: selected.boxnowLockerId,
          address: selected.boxnowLockerAddressLine1 || "",
        };
        setBoxNowLocker(lockerData);
        setShippingMethod("boxnow");

        startTransition(async () => {
          await updateCartShippingMethod("boxnow");
          router.refresh();
        });
      }
      setIsMapOpen(false);
    };

    window._bn_map_widget_config = {
      partnerId: 9083,
      parentElement: "#boxnowmap",
      type: "popup",
      autoclose: true,
      gps: true,
      afterSelect: (selected: BoxNowSelectedData) =>
        window._bn_afterSelect?.(selected),
    };

    const script = document.createElement("script");
    script.src = "https://widget-cdn.boxnow.gr/map-widget/client/v5.js";
    script.async = true;
    document.head.appendChild(script);
  }, [isClient, router]);

  const openBoxNow = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsMapOpen(true);

    setTimeout(() => {
      const btn = document.querySelector(
        ".boxnow-map-widget-button",
      ) as HTMLButtonElement;
      if (btn) btn.click();
    }, 50);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const selectElta = async () => {
    setBoxNowLocker(null);
    setShippingMethod("elta");

    startTransition(async () => {
      await updateCartShippingMethod("elta");
      router.refresh();
    });
  };

  const selectBoxNow = async () => {
    setShippingMethod("boxnow");

    startTransition(async () => {
      await updateCartShippingMethod("boxnow");
      router.refresh();
    });
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
      const res = await updateCartShippingAddress(
        validation.data as ShippingFormValues,
      );
      if (res.success) router.push("/check-out/payment-method");
      else setError(res.message);
    } catch {
      setError("An unexpected error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isClient) {
    return <div className="min-h-screen bg-zinc-950" />;
  }

  const inputStyle =
    "bg-zinc-900 border-white/10 rounded-xl h-12 focus:border-[#c5a059] focus:ring-1 focus:ring-[#c5a059]/20 transition-all placeholder:text-zinc-600 text-sm text-white w-full";

  return (
    <>
      <CheckoutSteps current={1} />
      <div className="max-w-5xl space-y-6 md:space-y-10 bg-zinc-950 p-4 sm:p-6 md:p-10 border border-white/5 mt-6 md:mt-10 rounded-2xl shadow-xl w-[calc(100%-2rem)] sm:w-full">
        {createPortal(
          <div
            id="boxnowmap"
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              zIndex: 9999,
              backgroundColor: "rgba(0,0,0,0.85)",
              visibility: isMapOpen ? "visible" : "hidden",
              opacity: isMapOpen ? 1 : 0,
              pointerEvents: isMapOpen ? "auto" : "none",
              transition: "opacity 0.3s ease",
            }}
          >
            <button className="boxnow-map-widget-button hidden" type="button">
              Select
            </button>
          </div>,
          document.body,
        )}

        {/* Shipping Methods */}
        <div className="space-y-4 md:space-y-6">
          <h3 className="text-[#c5a059] text-[11px] font-bold uppercase tracking-[0.2em] italic">
            Shipping Method
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
            {/* ELTA Button */}
            <button
              type="button"
              onClick={selectElta}
              className={`block p-5 md:p-6 border rounded-xl text-[10px] uppercase tracking-widest text-center transition-all duration-300 ${
                shippingMethod === "elta"
                  ? "border-[#c5a059] bg-[#c5a059]/5 text-white"
                  : "border-white/5 bg-zinc-900/50 text-zinc-400 hover:bg-zinc-800"
              }`}
            >
              ELTA Courier (+2.00€)
            </button>

            {/* BoxNow Button */}
            <div
              onClick={selectBoxNow}
              className={`block p-5 md:p-6 border rounded-xl text-center transition-all duration-300 cursor-pointer ${
                shippingMethod === "boxnow"
                  ? "border-[#c5a059] bg-[#c5a059]/5 text-white"
                  : "border-white/5 bg-zinc-900/50 text-zinc-400 hover:bg-zinc-800"
              }`}
            >
              <span className="block text-[10px] uppercase tracking-widest mb-3">
                BoxNow Locker (+2.00€)
              </span>

              {shippingMethod === "boxnow" && (
                <div className="animate-in fade-in zoom-in-95 duration-200">
                  <Button
                    type="button"
                    onClick={openBoxNow}
                    className="bg-[#c5a059] text-black font-bold text-[9px] uppercase tracking-wider px-4 py-2 rounded-lg hover:bg-white transition-colors w-full sm:w-auto"
                  >
                    {boxNowLocker ? "ΑΛΛΑΓΗ ΘΥΡΙΔΑΣ" : "ΕΠΙΛΟΓΗ ΘΥΡΙΔΑΣ"}
                  </Button>
                  {boxNowLocker && (
                    <p className="text-[#c5a059] text-[11px] font-mono mt-2 uppercase tracking-normal wrap-break-word">
                      Locker: {boxNowLocker.id} <br />
                      <span className="text-zinc-400 font-sans normal-case">
                        {boxNowLocker.address}
                      </span>
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Form Details */}
        {shippingMethod && (
          <form
            onSubmit={handleSubmit}
            className="space-y-6 md:space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500"
          >
            {error && (
              <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-500 text-[10px] uppercase font-mono rounded-lg wrap-break-word">
                {error}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              <div className="space-y-2">
                <Label className="text-[9px] uppercase tracking-widest text-zinc-500 ml-1">
                  First Name
                </Label>
                <Input
                  name="firstName"
                  placeholder="JOHN"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  required
                  className={inputStyle}
                />
              </div>
              <div className="space-y-2">
                <Label className="text-[9px] uppercase tracking-widest text-zinc-500 ml-1">
                  Last Name
                </Label>
                <Input
                  name="lastName"
                  placeholder="DOE"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  required
                  className={inputStyle}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              <div className="space-y-2">
                <Label className="text-[9px] uppercase tracking-widest text-zinc-500 ml-1">
                  Email
                </Label>
                <Input
                  name="email"
                  type="email"
                  placeholder="EXAMPLE@MAIL.COM"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className={inputStyle}
                />
              </div>
              <div className="space-y-2">
                <Label className="text-[9px] uppercase tracking-widest text-zinc-500 ml-1">
                  Phone
                </Label>
                <Input
                  name="phoneNumber"
                  placeholder="6900000000"
                  value={formData.phoneNumber}
                  onChange={handleInputChange}
                  required
                  className={inputStyle}
                />
              </div>
            </div>

            {shippingMethod === "elta" && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 animate-in slide-in-from-top-2 duration-300">
                <div className="md:col-span-2 space-y-2">
                  <Label className="text-[9px] uppercase tracking-widest text-zinc-500 ml-1">
                    Street Name
                  </Label>
                  <Input
                    name="streetName"
                    placeholder="STREET"
                    value={formData.streetName}
                    onChange={handleInputChange}
                    required={shippingMethod === "elta"}
                    className={inputStyle}
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-[9px] uppercase tracking-widest text-zinc-500 ml-1">
                    Number
                  </Label>
                  <Input
                    name="streetNumber"
                    placeholder="NO"
                    value={formData.streetNumber}
                    onChange={handleInputChange}
                    required={shippingMethod === "elta"}
                    className={inputStyle}
                  />
                </div>
                <div className="grid-cols-1 md:col-span-3 space-y-2">
                  <Label className="text-[9px] uppercase tracking-widest text-zinc-500 ml-1">
                    Postal Code
                  </Label>
                  <Input
                    name="postalCode"
                    placeholder="000 00"
                    value={formData.postalCode}
                    onChange={handleInputChange}
                    required={shippingMethod === "elta"}
                    className={inputStyle}
                  />
                </div>
              </div>
            )}

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-13 bg-[#c5a059] text-black py-4 md:py-5 rounded-xl text-[11px] font-black tracking-[0.3em] hover:bg-white transition-all transform active:scale-[0.98] uppercase disabled:opacity-50 shadow-lg shadow-[#c5a059]/10"
            >
              {isSubmitting ? "Processing..." : "Continue to Payment"}
            </Button>
          </form>
        )}
      </div>
    </>
  );
};

export default ShippingDetailsPage;
