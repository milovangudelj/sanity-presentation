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
import { PortableText } from "@portabletext/react";

import tailwindConfig from "../../tailwind.config";

import { Footer } from "../_components/footer";
import { baseUrl } from "../_lib";

export interface NewsletterEmailProps {
  id: string;
  preview: string;
  author: string;
  body: any;
}

export function NewsletterEmail({
  id,
  preview,
  author,
  body,
}: NewsletterEmailProps) {
  return (
    <Tailwind config={tailwindConfig}>
      <Html>
        <Head />
        <Preview>{preview}</Preview>
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
              <PortableText
                value={body}
                components={{
                  block: {
                    normal: ({ children }) => (
                      <Text className="text-[16px]/[1.1] text-onyx text-left">
                        {children}
                      </Text>
                    ),
                  },
                }}
              />
              <Text className="text-[16px]/[1.1] text-onyx text-left">
                — {author}, The Quill team
              </Text>
              <Hr className="my-8 border-onyx/40" />
              <Footer id={id} canUnsubscribe />
            </Section>
          </Container>
        </Body>
      </Html>
    </Tailwind>
  );
}
export default NewsletterEmail;
NewsletterEmail.PreviewProps = {
  id: "85cb2df4-1bb4-4995-a418-7388ccaa730c",
  preview: "You have successfully subscribed to our newsletter!",
  author: "Milovan G.",
  body: "You have successfully subscribed to our newsletter! You will now receive updates and news about our products and services.",
} satisfies NewsletterEmailProps;
