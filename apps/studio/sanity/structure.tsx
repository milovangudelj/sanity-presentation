import { Suspense } from "react";
import {
  type DefaultDocumentNodeResolver,
  type StructureBuilder,
  type StructureResolver,
} from "sanity/structure";
import { Flex, Spinner, Text } from "@sanity/ui";
import {
  Compass,
  Envelope,
  Feather,
  PencilLine,
  Shapes,
  User,
} from "@phosphor-icons/react";

import { EmailPreview } from "~/sanity/components/newsletter-email-preview";

const formView = (S: StructureBuilder) => {
  return S.view.form().icon(PencilLine);
};

const emailPreview = (S: StructureBuilder) => {
  return S.view
    .component(({ document }) => (
      <Suspense
        fallback={
          <Flex
            style={{
              width: "100%",
              height: "100%",
            }}
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
        }
      >
        <EmailPreview data={document.displayed} />
      </Suspense>
    ))
    .icon(Compass)
    .title("Preview");
};

export const defaultDocumentNode: DefaultDocumentNodeResolver = (
  S,
  { schemaType }
) => {
  switch (schemaType) {
    case "newsletterEmail":
      return S.document().views([formView(S), emailPreview(S)]);
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
