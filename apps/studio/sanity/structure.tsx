import {
  type DefaultDocumentNodeResolver,
  type StructureBuilder,
  type StructureResolver,
} from "sanity/structure";
import { Flex, Spinner, Text } from "@sanity/ui";
import { render } from "@react-email/components";
import {
  Compass,
  Envelope,
  Feather,
  PencilLine,
  Shapes,
  User,
} from "@phosphor-icons/react";

import { NewsletterEmail } from "@repo/email";

import { apiVersion } from "~/sanity/env";
import { type SanityDocument, type SanityClient } from "sanity";
import { Suspense, memo, useEffect, useState } from "react";
import { groq } from "next-sanity";

const formView = (S: StructureBuilder) => {
  return S.view.form().icon(PencilLine);
};

function Loading() {
  return (
    <Flex
      style={{ width: "100%", height: "100%" }}
      justify="center"
      align="center"
      direction="column"
      gap={4}
    >
      <Spinner muted />
      <Text muted size={1}>
        Loading…
      </Text>
    </Flex>
  );
}

const IFrameInner = memo(async function IFrameInner({
  emailId,
  client,
}: {
  emailId: string;
  client: SanityClient;
}) {
  const [html, setHtml] = useState("");

  useEffect(() => {
    const subscription = client
      .listen<any>(
        groq`*[_type == "newsletterEmail" && _id == $id][0]{
          ...,
          "author": author->
        }`,
        {
          id: emailId,
        }
      )
      .subscribe((update) => {
        const emailData = update.result;

        setHtml(
          emailData
            ? render(
                <NewsletterEmail
                  id="previewId"
                  author={`${emailData.author.firstName} ${emailData.author.lastName.split("")[0].toUpperCase()}.`}
                  preview={emailData.preview as string}
                  body={emailData.body}
                />
              )
            : ""
        );
      });

    return () => {
      subscription.unsubscribe();
    };
  }, [client, emailId]);

  return (
    <iframe
      style={{
        width: "100%",
        height: "100%",
        backgroundColor: "white",
        border: "none",
        display: "block",
        verticalAlign: "middle",
        boxSizing: "border-box",
        borderWidth: "0",
        borderStyle: "solid",
        borderColor: "#e5e7eb",
      }}
      srcDoc={html}
      title="Preview"
    />
  );
});

function IFrame({
  document,
  client,
}: {
  document: {
    displayed: SanityDocument;
    draft: SanityDocument | null;
    published: SanityDocument | null;
  };
  client: SanityClient;
}) {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
      }}
    >
      <Suspense fallback={<Loading />}>
        <IFrameInner emailId={document.displayed._id} client={client} />
      </Suspense>
    </div>
  );
}

const iframeView = (S: StructureBuilder, client: SanityClient) => {
  return S.view
    .component(({ document }) => {
      return <IFrame document={document} client={client} />;
    })
    .icon(Compass)
    .title("Preview");
};

export const defaultDocumentNode: DefaultDocumentNodeResolver = (
  S,
  { schemaType, getClient }
) => {
  const client = getClient({
    apiVersion,
  });

  switch (schemaType) {
    case "newsletterEmail":
      return S.document().views([formView(S), iframeView(S, client)]);
    default:
      return S.document().views([formView(S)]);
  }
};

export const structure: StructureResolver = (S) =>
  S.list()
    .title("Content")
    .items([
      S.listItem()
        .title("Post")
        .icon(Feather)
        .child(S.documentTypeList("post")),
      S.listItem()
        .title("Author")
        .icon(User)
        .child(S.documentTypeList("author")),
      S.listItem()
        .title("Category")
        .icon(Shapes)
        .child(S.documentTypeList("category")),
      S.listItem()
        .title("Newsletter Email")
        .icon(Envelope)
        .child(S.documentTypeList("newsletterEmail")),
    ]);
