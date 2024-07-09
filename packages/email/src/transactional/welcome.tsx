import {
  Tailwind,
  Html,
  Container,
  Head,
  Preview,
  Body,
  Section,
  Text,
  Hr,
  Link,
  Img,
} from "@react-email/components";

import tailwindConfig from "../../tailwind.config";

import { Unsubscribe } from "../_components/unsubscribe";
import { baseUrl } from "../_lib";

export interface WelcomeEmailProps {
  id: string;
  resubscribed?: boolean;
}

export function WelcomeEmail({ id, resubscribed = false }: WelcomeEmailProps) {
  return (
    <Tailwind config={tailwindConfig}>
      <Html>
        <Head />
        <Preview>You have successfully subscribed to our newsletter!</Preview>
        <Body className="font-sans bg-transparent text-onyx">
          <Container className="bg-cream mx-auto pt-8 pb-12 mb-16">
            <Section className="px-12">
              <Link href={baseUrl}>
                <Img
                  src={`${baseUrl}/images/logo.png`}
                  alt="Quill logo"
                  width="92"
                  height="36"
                />
              </Link>
              <Hr className="my-8 border-onyx/40" />
              <Text className="text-[16px]/[1.1] text-onyx text-left">
                {resubscribed ? "Welcome back!" : "Thank you for subscribing!"}
              </Text>
              <Text className="text-[16px]/[1.1] text-onyx text-left">
                You have successfully subscribed to our newsletter! You will now
                receive updates and news about our products and services.
              </Text>
              <Text className="text-[16px]/[1.1] text-onyx text-left">
                — The Quill team
              </Text>
              <Hr className="my-8 border-onyx/40" />
              <Unsubscribe id={id} />
            </Section>
          </Container>
        </Body>
      </Html>
    </Tailwind>
  );
}
export default WelcomeEmail;
WelcomeEmail.PreviewProps = {
  id: "85cb2df4-1bb4-4995-a418-7388ccaa730c",
  resubscribed: false,
} satisfies WelcomeEmailProps;
