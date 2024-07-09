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

import { Footer } from "../_components/footer";
import { baseUrl } from "../_lib";

export interface UnsubscribedEmailProps {
  id: string;
}

export function UnsubscribedEmail({ id }: UnsubscribedEmailProps) {
  return (
    <Tailwind config={tailwindConfig}>
      <Html>
        <Head />
        <Preview>You have unsubscribed from our newsletter!</Preview>
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
                Thank you for the time spent with us!
              </Text>
              <Text className="text-[16px]/[1.1] text-onyx text-left">
                You have unsubscribed from our newsletter. It's sad to see you
                go, but if you come back we'll welcome you with open arms.
              </Text>
              <Text className="text-[16px]/[1.1] text-onyx text-left">
                — The Quill team
              </Text>
              <Hr className="my-8 border-onyx/40" />
              <Footer id={id} />
            </Section>
          </Container>
        </Body>
      </Html>
    </Tailwind>
  );
}
export default UnsubscribedEmail;
UnsubscribedEmail.PreviewProps = {
  id: "85cb2df4-1bb4-4995-a418-7388ccaa730c",
} satisfies UnsubscribedEmailProps;
