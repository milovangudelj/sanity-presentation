import { create } from "zustand";
import { groq } from "next-sanity";

import { apiVersion } from "~/sanity/env";
import { Author, PreviewData, Template } from "../lib/email";
import { useCallback, useEffect, useRef } from "react";
import { useClient } from "sanity";
import { renderEmail } from "../lib/render-email";

interface EmailPreviewStoreState {
  authorId: string | null;
  author: Author | null;
  templateId: string | null;
  template: Template | null;
}

interface EmailPreviewStoreActions {
  setAuthorId: (authorId: string) => void;
  setAuthor: (author: Author) => void;
  setTemplateId: (templateId: string) => void;
  setTemplate: (template: Template) => void;
  reset: () => void;
}

type EmailPreviewStore = EmailPreviewStoreState & EmailPreviewStoreActions;

const initialState: EmailPreviewStoreState = {
  authorId: null,
  author: null,
  templateId: null,
  template: null,
};

const useEmailPreviewStore = create<EmailPreviewStore>()((set) => ({
  ...initialState,
  setAuthorId: (authorId) => {
    set({ authorId });
  },
  setAuthor: (author) => {
    set({ author });
  },
  setTemplateId: (templateId) => {
    set({ templateId });
  },
  setTemplate: (template) => {
    set({ template });
  },
  reset: () => {
    set(initialState);
  },
}));

export function EmailPreview({ data }: { data: PreviewData }) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const client = useClient({
    apiVersion,
  });
  const {
    authorId,
    setAuthorId,
    author,
    setAuthor,
    templateId,
    setTemplateId,
    template,
    setTemplate,
    reset,
  } = useEmailPreviewStore();

  // Reset the store when the component unmounts
  useEffect(() => {
    return () => {
      reset();
    };
  }, []);

  useEffect(() => {
    if (!data) return;

    if (data.author?._ref) setAuthorId(data.author._ref);

    if (data._type === "marketingEmail" && data.campaign?._ref) {
      setTemplateId(`${data.campaign._ref}_template`);
    }
  }, [data]);

  const getAuthor = useCallback(
    (id: string) => {
      client
        .fetch<(Author | null)[]>(
          groq`[*[_id == $draft][0], *[_id == $published][0]]`,
          {
            draft: `drafts.${id}`,
            published: id,
          }
        )
        .then((docs) => {
          const draftAuthor = docs[0];
          const publishedAuthor = docs[1];

          if (!draftAuthor && !publishedAuthor) return;

          setAuthor((draftAuthor ?? publishedAuthor)!);
        })
        .catch((e) => {
          console.error("Failed to fetch author!", e);
        });
    },
    [client]
  );

  const getTemplate = useCallback(
    (id: string) => {
      client
        .fetch<(Template | null)[]>(
          groq`[*[_id == $draft][0], *[_id == $published][0]]`,
          {
            draft: `drafts.${id}`,
            published: id,
          }
        )
        .then((docs) => {
          const draftTemplate = docs[0];
          const publishedTemplate = docs[1];

          if (!draftTemplate && !publishedTemplate) return;

          setTemplate((draftTemplate ?? publishedTemplate)!);
        })
        .catch((e) => {
          console.error("Failed to fetch template!", e);
        });
    },
    [client]
  );

  useEffect(() => {
    if (!authorId) return;

    getAuthor(authorId);
  }, [getAuthor, authorId]);

  useEffect(() => {
    if (!templateId) return;

    getTemplate(templateId);
  }, [getTemplate, templateId]);

  useEffect(() => {
    if (!authorId) return;

    const subscription = client
      .listen(groq`*[_id == $id][0]`, {
        id: `drafts.${authorId}`,
      })
      .subscribe(({ result }) => {
        if (!result) {
          if (!authorId) return;
          getAuthor(authorId);
          return;
        }

        setAuthor(result as Author);
      });

    return () => {
      subscription.unsubscribe();
    };
  }, [client, getAuthor, authorId]);

  useEffect(() => {
    if (!templateId) return;

    const subscription = client
      .listen(groq`*[_id == $id][0]`, {
        id: `drafts.${templateId}`,
      })
      .subscribe(({ result }) => {
        if (!result) {
          if (!templateId) return;
          getTemplate(templateId);
          return;
        }

        setTemplate(result as Template);
      });

    return () => {
      subscription.unsubscribe();
    };
  }, [client, getTemplate, templateId]);

  useEffect(() => {
    renderEmail({ data, author, template }).then((renderedOutput) =>
      updateIframeContent(renderedOutput)
    );
  }, [data, author, template]);

  const updateIframeContent = (content: string) => {
    const iframe = iframeRef.current?.contentDocument;
    if (!iframe) return;

    iframe.open();
    iframe.write(content);
    iframe.close();
  };

  const inspectJSON = false as any;

  return inspectJSON ? (
    <pre>{JSON.stringify({ data, author, template }, null, 2)}</pre>
  ) : (
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
}
