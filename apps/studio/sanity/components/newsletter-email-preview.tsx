import { render } from "@react-email/components";
import { type SanityDocument, groq } from "next-sanity";
import { memo, useCallback, useEffect, useRef } from "react";
import { useClient } from "sanity";

import { NewsletterEmail } from "@repo/email";

import { apiVersion } from "~/sanity/env";

export const NewsletterEmailPreview = memo(function NewsletterEmailPreview({
  id,
}: {
  id: string;
}) {
  const client = useClient({
    apiVersion,
  });

  const iframeRef = useRef<HTMLIFrameElement>(null);

  const updateIframeContent = (content: string) => {
    if (iframeRef.current?.contentDocument) {
      iframeRef.current.contentDocument.open();
      iframeRef.current.contentDocument.write(content);
      iframeRef.current.contentDocument.close();
    }
  };

  const getData = useCallback(() => {
    client
      .fetch(NEWSLETTER_EMAIL_QUERY, {
        id: `${id}`,
      })
      .then((res) => {
        updateIframeContent(renderEmail(res));
      })
      .catch((e) => {
        console.log(e);
      });
  }, [client, id]);

  useEffect(() => {
    getData();

    const subscription = client
      .listen(groq`*[_type == "newsletterEmail" && _id == $id][0]`, {
        id: `${id}`,
      })
      .subscribe(() => {
        getData();
      });

    () => {
      subscription.unsubscribe();
    };
  }, [client, id, getData]);

  return (
    <iframe
      ref={iframeRef}
      title="Preview"
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
    />
  );
});

const renderEmail = (data: SanityDocument | undefined) => {
  return render(
    <NewsletterEmail
      id="previewId"
      author={
        data
          ? `${data.author?.firstName} ${data.author.lastName?.split("")[0].toUpperCase()}.`
          : NewsletterEmail.PreviewProps.author
      }
      preview={data?.preview ?? NewsletterEmail.PreviewProps.preview}
      body={data?.body ?? NewsletterEmail.PreviewProps.body}
    />
  );
};

const NEWSLETTER_EMAIL_QUERY = groq`
*[_type == "newsletterEmail" && _id == $id][0]{
  ...,
  "author": author->
}
`;
