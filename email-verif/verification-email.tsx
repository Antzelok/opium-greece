import {
  Tailwind,
  Body,
  Container,
  Section,
  Heading,
  Text,
  Link,
  Head,
} from "@react-email/components";

export const VerificationEmail = ({ url }: { url: string }) => (
  <Tailwind>
    <Head />
    <Body className="font-sans bg-white">
      <Container className="max-w-150 mx-auto my-10 border border-gray-200 rounded-lg overflow-hidden text-gray-800">
        <Section className="bg-black py-8 text-center">
          <Heading className="text-[#c5a25d] m-0 text-2xl">
            Opium Greece
          </Heading>
        </Section>

        <Section className="p-10">
          <Heading className="mt-0 mb-5 text-xl">Verify your account</Heading>
          <Text className="mb-8 leading-6">
            Thanks for joining! Please click the button below to verify your
            email address and start your journey with us.
          </Text>

          <Section className="text-center my-10">
            <Link
              href={url}
              className="bg-[#c5a25d] text-white py-4 px-8 rounded font-bold text-base no-underline"
            >
              Verify Email
            </Link>
          </Section>

          <Text className="mt-8 text-xs text-gray-500 border-t border-gray-200 pt-5">
            If you did not request this, you can safely ignore this email.
          </Text>
        </Section>
      </Container>
    </Body>
  </Tailwind>
);

export default VerificationEmail;
