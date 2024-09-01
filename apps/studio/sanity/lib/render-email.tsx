import { type Image } from "sanity";
import { type PortableTextBlock } from "next-sanity";
import createImageUrlBuilder from "@sanity/image-url";
import { render } from "@react-email/components";

import { EmailTemplate } from "@repo/email";

import { dataset, projectId } from "~/sanity/env";
import { type Author, type PreviewData, type Template } from "./email";

const imageBuilder = createImageUrlBuilder({
  projectId,
  dataset,
});

const urlForImage = (source: Image) => {
  return imageBuilder.image(source).auto("format").fit("max").url();
};

export async function renderEmail({
  data,
  author,
  template,
}: {
  data: PreviewData;
  author: Author | null;
  template: Template | null;
}) {
  const authorName =
    author?.firstName && author.lastName
      ? `${author.firstName} ${author.lastName.split("")[0].toUpperCase()}.`
      : EmailTemplate.PreviewProps.author;
  const authorImage = author?.image?.asset
    ? urlForImage(author.image.asset)
    : undefined;

  const body = applyTemplate(
    data.body ?? EmailTemplate.PreviewProps.body,
    template?.body ?? null
  );

  return render(
    <EmailTemplate
      id="previewId"
      author={authorName}
      authorImage={authorImage}
      preview={data.preview ?? EmailTemplate.PreviewProps.preview}
      body={
        data._type === "marketingEmail"
          ? body
          : (data.body ?? EmailTemplate.PreviewProps.body)
      }
      canUnsubscribe={data._type === "marketingEmail"}
    />
  );
}

const applyTemplate = (
  body: PortableTextBlock[] | string | null,
  template: PortableTextBlock[] | null
) => {
  if (!template) return body;

  let placeholderIndex = 0;
  template.forEach((block, index) => {
    placeholderIndex = block._type === "placeholder" ? index : placeholderIndex;
  });

  if (!body) return template.filter((block) => block._type !== "placeholder");

  return [
    template.slice(0, placeholderIndex),
    body,
    template.slice(placeholderIndex + 1),
  ].flat();
};
