import { Metadata } from "next";
import ShippingDetailsPage from "./shipping-details";

export const metadata: Metadata = {
  title: `Shipping`,
};

const ShippingPage = () => {
  return <ShippingDetailsPage />;
};

export default ShippingPage;
