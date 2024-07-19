import { render } from "@react-email/components";
import { type PortableTextBlock, groq } from "next-sanity";
import { useEffect, useRef, useReducer, useCallback } from "react";
import { useClient } from "sanity";

import { NewsletterEmail } from "@repo/email";

import { apiVersion } from "~/sanity/env";

interface Author {
  _createdAt: string;
  _updatedAt: string;
  _id: string;
  _rev: string;
  _type: "author";
  firstName: string | null;
  lastName: string | null;
  slug: {
    current: string;
    _type: "slug";
  } | null;
  role: string | null;
  bio: PortableTextBlock[] | null;
  image: {
    asset: {
      _ref: string;
      _type: "reference";
    } | null;
    _type: "image";
    alt: string | null;
  } | null;
}
interface Data {
  _createdAt: string;
  _updatedAt: string;
  _id: string;
  _rev: string;
  _type: "newsletterEmail";
  author: {
    _ref: string;
    _type: "reference";
  } | null;
  body: PortableTextBlock[] | null;
  preview: string | null;
  subject: string | null;
  title: string | null;
}
interface FullData extends Omit<Data, "author"> {
  author: Author;
}

const renderEmail = (data: Data | FullData) => {
  const author =
    data.author?._type === "author" &&
    data.author.firstName &&
    data.author.lastName
      ? `${data.author.firstName} ${data.author.lastName.split("")[0].toUpperCase()}.`
      : NewsletterEmail.PreviewProps.author;

  return render(
    <NewsletterEmail
      id="previewId"
      author={author}
      preview={data.preview ?? NewsletterEmail.PreviewProps.preview}
      body={data.body ?? NewsletterEmail.PreviewProps.body}
    />
  );
};

interface EmailPreviewState {
  authorId: string | undefined;
  author: Author | undefined;
  fullData: FullData | undefined;
}

type EmailPreviewAction =
  | {
      type: "SET_AUTHOR_ID";
      authorId: string | undefined;
    }
  | {
      type: "SET_AUTHOR";
      author: Author | undefined;
    }
  | {
      type: "SET_FULL_DATA";
      fullData: FullData | undefined;
    };

const initialState: EmailPreviewState = {
  authorId: undefined,
  author: undefined,
  fullData: undefined,
};

const reducer = (
  state: EmailPreviewState,
  action: EmailPreviewAction
): EmailPreviewState => {
  switch (action.type) {
    case "SET_AUTHOR_ID":
      return {
        ...state,
        authorId: action.authorId,
      };
    case "SET_AUTHOR":
      return {
        ...state,
        author: action.author,
      };
    case "SET_FULL_DATA":
      return {
        ...state,
        fullData: action.fullData,
      };
    default:
      return state;
  }
};

export function EmailPreview({ data }: { data: Data }) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const client = useClient({
    apiVersion,
  });
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    dispatch({ type: "SET_AUTHOR_ID", authorId: data.author?._ref });
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
          // docs[0] is the draft, docs[1] is the published version
          dispatch({
            type: "SET_AUTHOR",
            author: (docs[0] ?? docs[1])!,
          });
        })
        .catch((e) => {
          console.error("Failed to fetch author!", e);
        });
    },
    [client]
  );

  useEffect(() => {
    if (!state.authorId) return;

    getAuthor(state.authorId);
  }, [getAuthor, state.authorId]);

  useEffect(() => {
    if (!state.authorId) return;

    const subscription = client
      .listen(groq`*[_id == $id][0]`, {
        id: `drafts.${state.authorId}`,
      })
      .subscribe(({ result }) => {
        if (!result) {
          if (!state.authorId) return;
          getAuthor(state.authorId);
          return;
        }

        dispatch({
          type: "SET_AUTHOR",
          author: result as Author,
        });
      });

    return () => {
      subscription.unsubscribe();
    };
  }, [client, getAuthor, state.authorId]);

  useEffect(() => {
    dispatch({
      type: "SET_FULL_DATA",
      fullData: { ...data, author: state.author! },
    });
  }, [data, state.author]);

  useEffect(() => {
    updateIframeContent(renderEmail(state.fullData ?? data));
  }, [data, state.fullData]);

  const updateIframeContent = (content: string) => {
    const iframe = iframeRef.current?.contentDocument;
    if (!iframe) return;

    iframe.open();
    iframe.write(content);
    iframe.close();
  };

  const inspectJSON = false as any;

  return inspectJSON ? (
    <pre>{JSON.stringify(state.fullData, null, 2)}</pre>
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
