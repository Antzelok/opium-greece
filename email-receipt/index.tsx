import { Resend } from "resend";
import { SENDER_EMAIL, APP_NAME } from "@/lib/constants";
import { Order } from "@/types";
import dotenv from "dotenv";
dotenv.config();
import PurchaseReceiptEmail from "./purchase-receipt";

const resend = new Resend(process.env.RESEND_API_KEY as string);

export const sendPurchaseReceipt = async ({ order }: { order: Order }) => {
  const recipientEmail = order.user?.email || order.shippingAddress?.email;

  if (!recipientEmail) {
    throw new Error(
      `Δεν βρέθηκε email παραλήπτη για την παραγγελία ${order.id}`,
    );
  }

  await resend.emails.send({
    from: `${APP_NAME} <${SENDER_EMAIL}>`,
    to: recipientEmail,
    subject: `Order Confirmation ${order.id}`,
    react: <PurchaseReceiptEmail order={order} />,
  });
};
