"use client";

import { visionTool } from "@sanity/vision";
import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { presentationTool } from "sanity/presentation";

import { apiVersion, dataset, projectId } from "~/sanity/env";
import { schema } from "~/sanity/schema";
import { locations } from "~/sanity/lib/locations";

export default defineConfig({
  auth: {
    loginMethod: "token",
  },

  projectId,
  dataset,

  schema,

  plugins: [
    structureTool(),
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
