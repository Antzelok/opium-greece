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
  Hr,
} from "@react-email/components";
import { Order, ShippingAddress, PaymentResult } from "@/types";
import { formatCurrency } from "@/lib/utils";

type OrderInformationProps = {
  order: Order;
};

// Αντικατάστησε το localhost με το κανονικό σου domain στο production
const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:3000";

PurchaseReceiptEmail.PreviewProps = {
  order: {
    id: "ORD-73921X",
    userId: "123",
    user: {
      name: "John Doe",
      email: "test@test.com",
    },
    paymentMethod: "Stripe",
    shippingAddress: {
      shippingMethod: "boxnow",
      firstName: "Γιάννης",
      lastName: "Παπαδόπουλος",
      email: "test@test.com",
      streetName: "Λεωφόρος Κηφισίας",
      streetNumber: "12A",
      postalCode: "15124",
      phoneNumber: "6900000000",
      boxnowLockerId: "4823",
    } as ShippingAddress,
    createdAt: new Date(),
    totalPrice: 100.0,
    shippingPrice: 2.0,
    itemsPrice: 98.0,
    orderitems: [
      {
        variantId: "var-123",
        name: "Premium Perfume Absolute",
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
    } as PaymentResult,
  } as unknown as Order,
} satisfies OrderInformationProps;

const dateFormatter = new Intl.DateTimeFormat("el-GR", { dateStyle: "medium" });

export default function PurchaseReceiptEmail({ order }: OrderInformationProps) {
  return (
    <Html>
      <Preview>Επιβεβαίωση Παραγγελίας #{order.id}</Preview>
      <Tailwind>
        <Head />
        <Body className="font-sans bg-[#fafafa] text-[#111111] my-auto mx-auto px-2">
          <Container className="max-w-xl mx-auto my-10 bg-white border border-solid border-[#e5e5e5] rounded-xl p-6 shadow-sm">
            
            {/* Header / Success Alert */}
            <Section className="bg-[#10b981]/10 border border-solid border-[#10b981]/20 rounded-lg p-4 text-center mb-8">
              <Text className="text-[#10b981] font-bold text-sm tracking-wider m-0 uppercase">
                Η ΠΑΡΑΓΓΕΛΙΑ ΟΛΟΚΛΗΡΩΘΗΚΕ ΜΕ ΕΠΙΤΥΧΙΑ!
              </Text>
            </Section>

            <Heading className="text-xl font-bold tracking-tight text-black m-0 mb-6">
              Απόδειξη Αγοράς
            </Heading>

            {/* Order Meta Info */}
            <Section className="mb-6 bg-[#f9f9f9] p-4 rounded-lg border border-solid border-[#f0f0f0]">
              <Row>
                <Column className="w-1/3">
                  <Text className="text-xs font-semibold text-gray-500 uppercase tracking-wider m-0 mb-1">
                    ID Παραγγελίας
                  </Text>
                  <Text className="text-xs font-bold text-black m-0 break-all">
                    #{order.id.toString()}
                  </Text>
                </Column>
                <Column className="w-1/3 px-2">
                  <Text className="text-xs font-semibold text-gray-500 uppercase tracking-wider m-0 mb-1">
                    Ημερομηνία
                  </Text>
                  <Text className="text-xs font-medium text-black m-0">
                    {dateFormatter.format(new Date(order.createdAt))}
                  </Text>
                </Column>
                <Column className="w-1/3 text-right">
                  <Text className="text-xs font-semibold text-gray-500 uppercase tracking-wider m-0 mb-1">
                    Τρόπος Πληρωμής
                  </Text>
                  <Text className="text-xs font-bold text-black m-0 uppercase">
                    {order.paymentMethod}
                  </Text>
                </Column>
              </Row>
            </Section>

            {/* Order Items */}
            <Text className="text-sm font-bold text-black mb-3">Προϊόντα</Text>
            <Section className="border border-solid border-[#e5e5e5] rounded-lg p-4 mb-6">
              {order.orderitems.map((item, index) => {
                // Φτιάχνουμε σωστά το URL της εικόνας για να ανοίγει στο email client
                const imgUrl = item.image.startsWith("/")
                  ? `${SERVER_URL}${item.image}`
                  : item.image;

                return (
                  <div key={item.variantId}>
                    <Row className={index > 0 ? "mt-4" : ""}>
                      <Column className="w-16 h-16 bg-[#f9f9f9] rounded border border-solid border-[#f0f0f0] overflow-hidden">
                        <Img
                          width="64"
                          height="64"
                          alt={item.name}
                          className="object-cover rounded"
                          src={imgUrl}
                        />
                      </Column>
                      <Column className="pl-4 align-middle">
                        <Text className="text-sm font-bold text-black m-0">
                          {item.name}
                        </Text>
                        <Text className="text-xs text-gray-500 m-0 mt-1">
                          Ποσότητα: {item.qty}
                        </Text>
                      </Column>
                      <Column align="right" className="align-middle font-semibold text-sm text-black">
                        {formatCurrency(Number(item.price) * item.qty)}
                      </Column>
                    </Row>
                    {index < order.orderitems.length - 1 && (
                      <Hr className="border-[#f0f0f0] my-3" />
                    )}
                  </div>
                );
              })}
            </Section>

            {/* Shipping & Customer Details */}
            <Text className="text-sm font-bold text-black mb-3">Στοιχεία Αποστολής</Text>
            <Section className="border border-solid border-[#e5e5e5] rounded-lg p-4 mb-6 bg-[#fefefe]">
              <Row>
                <Column>
                  <Text className="text-xs text-gray-600 m-0 leading-relaxed">
                    <strong className="text-black">Ονοματεπώνυμο:</strong> {order.shippingAddress?.firstName} {order.shippingAddress?.lastName}
                  </Text>
                  <Text className="text-xs text-gray-600 m-0 mt-1 leading-relaxed">
                    <strong className="text-black">Διεύθυνση:</strong> {order.shippingAddress?.streetName} {order.shippingAddress?.streetNumber}, {order.shippingAddress?.postalCode}
                  </Text>
                  <Text className="text-xs text-gray-600 m-0 mt-1 leading-relaxed">
                    <strong className="text-black">Τηλέφωνο:</strong> {order.shippingAddress?.phoneNumber}
                  </Text>
                  
                  {/* BoxNow Locker ID Check */}
                  {order.shippingAddress?.shippingMethod === "boxnow" && order.shippingAddress?.boxnowLockerId && (
                    <Text className="text-xs text-[#green] font-bold m-0 mt-2 bg-green-500/10 p-2 rounded border border-solid border-green-500/20 inline-block">
                      📦 BoxNow Locker ID: {order.shippingAddress.boxnowLockerId}
                    </Text>
                  )}
                </Column>
              </Row>
            </Section>

            {/* Totals Section */}
            <Section className="bg-black text-white rounded-lg p-4 font-mono">
              {[
                { name: "Αξία Προϊόντων", price: order.itemsPrice, isBold: false },
                { name: "Μεταφορικά Έξοδα", price: order.shippingPrice, isBold: false },
              ].map(({ name, price }) => (
                <Row key={name} className="py-1">
                  <Column className="text-xs text-gray-400">{name}</Column>
                  <Column align="right" className="text-xs font-medium">
                    {formatCurrency(Number(price))}
                  </Column>
                </Row>
              ))}
              <Hr className="border-gray-800 my-2" />
              <Row>
                <Column className="text-sm font-bold text-white uppercase tracking-wider">Σύνολο Πληρωμής</Column>
                <Column align="right" className="text-sm font-bold text-[#10b981]">
                  {formatCurrency(Number(order.totalPrice))}
                </Column>
              </Row>
            </Section>

            {/* Footer Notice */}
            <Text className="text-center text-xs text-gray-400 mt-8 m-0 p-5">
              Ευχαριστούμε για την εμπιστοσύνη σας.
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}