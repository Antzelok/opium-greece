import {
  Body,
  Column,
  Container,
  Head,
  Heading,
  Html,
  Img,
  Preview,
  Row,
  Section,
  Tailwind,
  Text,
} from "@react-email/components";
import { Order } from "@/types";
import { formatCurrency } from "@/lib/utils";
import dotenv from "dotenv";
dotenv.config();

type OrderInformationProps = {
  order: Order;
};

PurchaseReceiptEmail.PreviewProps = {
  order: {
    id: crypto.randomUUID(),
    userId: "123",
    user: {
      name: "John Doe",
      email: "test@test.com",
    },
    paymentMethod: "Stripe",
    shippingAddress: {
      shippingMethod: "boxnow",
      firstName: "John",
      lastName: "Doe",
      email: "test@test.com",
      streetName: "Main Street",
      streetNumber: "12",
      postalCode: "12345",
      phoneNumber: "6900000000",
      boxnowLockerId: "4823",
    },
    createdAt: new Date(),
    totalPrice: 100.0,
    shippingPrice: 2.0,
    itemsPrice: 98.0,
    orderitems: [
      {
        variantId: "var-123",
        name: "Premium Perfume",
        slug: "premium-perfume",
        image: "/images/sample.jpg",
        price: "98.00",
        qty: 1,
      },
    ],
    isDelivered: true,
    deliveredAt: new Date(),
    isPaid: true,
    paidAt: new Date(),
    paymentResult: {
      id: "ch_123",
      status: "succeeded",
      pricePaid: "100.00",
      email_address: "test@test.com",
    },
  } as unknown as Order,
} satisfies OrderInformationProps;

const dateFormatter = new Intl.DateTimeFormat("el-GR", { dateStyle: "medium" });

export default function PurchaseReceiptEmail({ order }: OrderInformationProps) {
  return (
    <Html>
      <Preview>Δείτε την απόδειξη της παραγγελίας σας</Preview>
      <Tailwind>
        <Head />
        <Body className="font-sans bg-white">
          <Container className="max-w-xl">
            <Heading>Απόδειξη Αγοράς</Heading>
            <Section>
              <Row>
                <Column>
                  <Text className="mb-0 mr-4 text-gray-500 whitespace-nowrap text-nowrap">
                    ID Παραγγελίας
                  </Text>
                  <Text className="mt-0 mr-4">{order.id.toString()}</Text>
                </Column>
                <Column>
                  <Text className="mb-0 mr-4 text-gray-500 whitespace-nowrap text-nowrap">
                    Ημερομηνία
                  </Text>
                  <Text className="mt-0 mr-4">
                    {dateFormatter.format(new Date(order.createdAt))}
                  </Text>
                </Column>
                <Column>
                  <Text className="mb-0 mr-4 text-gray-500 whitespace-nowrap text-nowrap">
                    Πληρώθηκε
                  </Text>
                  <Text className="mt-0 mr-4">
                    {formatCurrency(Number(order.totalPrice))}
                  </Text>
                </Column>
              </Row>
            </Section>
            <Section className="border border-solid border-gray-500 rounded-lg p-4 md:p-6 my-4">
              {order.orderitems.map((item) => (
                <Row key={item.variantId} className="mt-8">
                  <Column className="w-20">
                    <Img
                      width="80"
                      alt={item.name}
                      className="rounded"
                      src={
                        item.image.startsWith("/")
                          ? `${process.env.NEXT_PUBLIC_SERVER_URL}${item.image}`
                          : item.image
                      }
                    />
                  </Column>
                  <Column className="align-top">
                    {item.name} x {item.qty}
                  </Column>
                  <Column align="right" className="align-top">
                    {formatCurrency(Number(item.price))}
                  </Column>
                </Row>
              ))}
              {[
                { name: "Προϊόντα", price: order.itemsPrice },
                { name: "Μεταφορικά", price: order.shippingPrice },
                { name: "Σύνολο", price: order.totalPrice },
              ].map(({ name, price }) => (
                <Row key={name} className="py-1">
                  <Column align="right">{name}: </Column>
                  <Column align="right" width={70} className="align-top">
                    <Text className="m-0">{formatCurrency(Number(price))}</Text>
                  </Column>
                </Row>
              ))}
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}
