"use client";

import { visionTool } from "@sanity/vision";
import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { presentationTool } from "sanity/presentation";

import { apiVersion, dataset, projectId } from "~/sanity/env";
import { schema } from "~/sanity/schema";
import { structure, defaultDocumentNode } from "~/sanity/structure";
import { locations } from "~/sanity/lib/locations";
import { patchedActions } from "~/sanity/lib/actions";

export default defineConfig({
  auth: {
    loginMethod: "token",
  },

  title: "Quill",
  projectId,
  dataset,

  schema,

  scheduledPublishing: {
    enabled: false,
  },
  tasks: { enabled: false },

  document: {
    actions: patchedActions,
    comments: {
      enabled: false,
    },
    newDocumentOptions: (prev, { currentUser, creationContext }) => {
      const { schemaType } = creationContext;
      if (schemaType === "contact") return [];

      return prev.filter((template) => template.templateId !== "contact");
    },
  },
  plugins: [
    structureTool({
      structure,
      defaultDocumentNode,
    }),
    presentationTool({
      resolve: {
        // mainDocuments: defineDocuments([
        //   {
        //     route: `${process.env.NEXT_PUBLIC_FRONTEND_URL}/posts/:slug`,
        //     filter: `_type == "post" && slug.current == $slug`,
        //   },
        // ]),
        locations,
      },
      previewUrl: {
        draftMode: {
          enable: `${process.env.NEXT_PUBLIC_FRONTEND_URL}/api/draft`,
        },
      },
    }),
    visionTool({ defaultApiVersion: apiVersion }),
  ],
});
