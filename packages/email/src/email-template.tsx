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
  render,
  Row,
  Column,
} from "@react-email/components";
import { PortableText } from "@portabletext/react";

import tailwindConfig from "../tailwind.config";

import { Footer } from "./_components/footer";
import { mockHooks, restoreHooks } from "./_lib";

export interface EmailTemplateProps {
  id: string;
  preview: string;
  author: string;
  authorImage?: string;
  body: any;
  canUnsubscribe: boolean;
  server?: boolean;
}

export async function EmailTemplate({
  id,
  preview,
  author,
  authorImage,
  body,
  canUnsubscribe = false,
  server = false,
}: EmailTemplateProps) {
  return (
    <Tailwind config={tailwindConfig}>
      <Html>
        <Head />
        <Preview>{preview}</Preview>
        <Body className="font-sans bg-cream text-onyx">
          <Container
            style={{
              maxWidth: "600px",
            }}
            className="mx-auto pt-8 pb-12 mb-16"
          >
            <Section className="px-2">
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
              {server ? (
                <div
                  dangerouslySetInnerHTML={{
                    __html: await renderPortableText(body),
                  }}
                />
              ) : (
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
              )}
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
                      src={authorImage}
                      alt={author}
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
                    {author}, The Quill team
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
              <Footer id={id} canUnsubscribe={canUnsubscribe} />
            </Section>
          </Container>
        </Body>
      </Html>
    </Tailwind>
  );
}
export default EmailTemplate;
EmailTemplate.PreviewProps = {
  id: "85cb2df4-1bb4-4995-a418-7388ccaa730c",
  preview: "You have successfully subscribed to our newsletter!",
  author: "John D.",
  body: "You have successfully subscribed to our newsletter! You will now receive updates and news about our products and services.",
  canUnsubscribe: false,
  server: false,
} satisfies EmailTemplateProps;

async function renderPortableText(body: any) {
  const ogHooks = mockHooks();

  const html = await render(
    <PortableText
      value={body}
      components={{
        block: {
          normal: ({ children }) => (
            <Text
              style={{
                fontSize: "16px",
                lineHeight: "1.1",
                textAlign: "left",
              }}
            >
              {children}
            </Text>
          ),
        },
      }}
    />
  );

  restoreHooks(ogHooks);

  return html.replace(/<!DOCTYPE.*?>/, "");
}
