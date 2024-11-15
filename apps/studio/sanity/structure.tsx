import { Suspense } from "react";
import {
  type DefaultDocumentNodeResolver,
  type StructureBuilder,
  type StructureResolver,
} from "sanity/structure";
import { Flex, Spinner, Text } from "@sanity/ui";
import {
  Bell,
  Compass,
  Envelope,
  Feather,
  FileDashed,
  Gear,
  Megaphone,
  PencilLine,
  Shapes,
  User,
} from "@phosphor-icons/react";

import { apiVersion } from "~/sanity/env";
import { EmailPreview } from "~/sanity/components/email-preview";
import { ContactView } from "./schemaTypes/contact";

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
    case "marketingEmail":
    case "transactionalEmail":
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
        .title("Emails")
        .icon(Envelope)
        .child(
          S.list()
            .title("Emails")
            .items([
              S.listItem()
                .title("Contacts")
                .icon(User)
                .child(
                  S.documentTypeList("contact")
                    .title("Contacts")
                    .child(
                      (id) => S.document().schemaType("contact").documentId(id)
                      // .views([
                      //   S.view
                      //     .component(
                      //       ({ document, documentId, schemaType }) => (
                      //         <ContactView
                      //           document={document}
                      //           documentId={documentId}
                      //           schemaType={schemaType}
                      //         />
                      //       )
                      //     )
                      //     .id(id)
                      //     .title("Contact"),
                      // ])
                    )
                ),
              S.divider(),
              S.listItem()
                .title("Campaigns")
                .icon(Megaphone)
                .child(
                  S.documentList()
                    .title("Campaigns")
                    .filter('_type == "emailCampaign"')
                    .apiVersion(apiVersion)
                    .child(
                      async (
                        campaignId,
                        { structureContext: { getClient } }
                      ) => {
                        const client = getClient({
                          apiVersion,
                        });
                        const campaignTitle =
                          (await client.getDocument(campaignId))?.title ||
                          "Campaign";

                        return S.list()
                          .title(campaignTitle)
                          .id(campaignId)
                          .items([
                            S.listItem()
                              .title("Settings")
                              .id("settings")
                              .icon(Gear)
                              .child(
                                S.document()
                                  .id(campaignId)
                                  .title("Settings")
                                  .schemaType("emailCampaign")
                              ),
                            S.listItem()
                              .title("Template")
                              .id("template")
                              .icon(FileDashed)
                              .child(
                                S.document()
                                  .id(`${campaignId}_template`)
                                  .schemaType("emailCampaignTemplate")
                              ),
                            S.divider(),
                            S.listItem()
                              .title("Emails")
                              .id("emails")
                              .icon(Envelope)
                              .child(
                                S.documentList()
                                  .title("Emails")
                                  .filter(
                                    `_type == "marketingEmail" && references($campaignId)`
                                  )
                                  .apiVersion(apiVersion)
                                  .params({ campaignId })
                                  .initialValueTemplates([
                                    S.initialValueTemplateItem("meTemplate", {
                                      campaignId,
                                    }),
                                  ])
                              ),
                          ]);
                      }
                    )
                ),
              S.listItem()
                .title("Transactional")
                .id("transactional")
                .icon(Bell)
                .child(
                  S.list()
                    .title("Transactional")
                    .items([
                      S.listItem()
                        .title("Welcome Email")
                        .icon(Envelope)
                        .id("welcome-email")
                        .child(
                          S.defaultDocument({
                            documentId: "welcome-email",
                            schemaType: "transactionalEmail",
                          }).id("welcome-email")
                        ),
                      S.listItem()
                        .title("Unsubscribed Email")
                        .icon(Envelope)
                        .id("unsubscribed-email")
                        .child(
                          S.defaultDocument({
                            documentId: "unsubscribed-email",
                            schemaType: "transactionalEmail",
                          }).id("unsubscribed-email")
                        ),
                    ])
                ),
            ])
        ),
    ]);
