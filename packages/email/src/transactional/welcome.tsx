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
        <Body className="font-sans bg-cream text-onyx">
          <Container
            style={{
              maxWidth: "600px",
            }}
            className="mx-auto pt-8 pb-12 mb-16"
          >
            <Section className="px-4">
              <Link href={process.env.NEXT_PUBLIC_WEBSITE_URL}>
                <Img
                  src={`${process.env.NEXT_PUBLIC_WEBSITE_URL}/images/logo.png`}
                  alt="Quill logo"
                  width="92"
                  height="36"
                />
              </Link>
              <Hr
                className="my-8"
                style={{
                  borderTop: "1px solid #0c0e06",
                  opacity: 0.1,
                }}
              />
              <Text className="text-[16px]/[1.1] text-onyx text-left">
                {resubscribed ? "Welcome back!" : "Thank you for subscribing!"}
              </Text>
              <Text className="text-[16px]/[1.1] text-onyx text-left">
                You have successfully subscribed to our newsletter! You will now
                receive updates and news about our products and services.
              </Text>
              <div
                style={{
                  margin: "32px 0 0",
                  width: "100%",
                  display: "table",
                  tableLayout: "fixed",
                }}
              >
                <div
                  style={{
                    display: "table-cell",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  <div
                    style={{
                      display: "inline-block",
                      verticalAlign: "middle",
                    }}
                  >
                    <Img
                      src={
                        "https://cdn.sanity.io/images/2hd6r3o4/production/c6c57dccdc4e25f7e556b046fd02b95702bcc75c-1280x1280.jpg?fit=max&auto=format"
                      }
                      alt="Milovan G."
                      width="48"
                      height="48"
                      style={{
                        borderRadius: "50%",
                        objectFit: "cover",
                        objectPosition: "center",
                        width: "48px",
                        height: "48px",
                      }}
                    />
                  </div>
                  <Text
                    className="text-[16px]/[1.1] text-onyx text-left"
                    style={{
                      margin: "0 0 0 16px",
                      verticalAlign: "middle",
                      display: "inline-block",
                    }}
                  >
                    Milovan G., The Quill team
                  </Text>
                </div>
              </div>
              <Hr
                className="my-8"
                style={{
                  borderTop: "1px solid #0c0e06",
                  opacity: 0.1,
                }}
              />
              <Footer id={id} canUnsubscribe />
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
