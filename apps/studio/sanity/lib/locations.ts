import { type DocumentLocationResolver } from "sanity/presentation";
import { map } from "rxjs";

// Pass 'context' as the second argument
export const locations: DocumentLocationResolver = (params, context) => {
  switch (params.type) {
    case "post":
      return postLocations(params, context);
    case "author":
      return authorLocations(params, context);
    case "category":
      return categoryLocations(params, context);
    default:
      return null;
  }
};

const postLocations: DocumentLocationResolver = (params, context) => {
  // Subscribe to the latest slug and title
  const doc$ = context.documentStore.listenQuery(
    `*[_id == $id][0]{slug,title}`,
    params,
    { perspective: "previewDrafts" } // returns a draft article if it exists
  );
  // Return a streaming list of locations
  return doc$.pipe(
    map((doc: any) => {
      // If the document doesn't exist or have a slug, return null
      if (!doc?.slug?.current) {
        return null;
      }
      return {
        locations: [
          {
            title: (doc.title as string) || "Untitled",
            href: `/posts/${doc.slug.current}`,
          },
          // {
          //   title: "Posts",
          //   href: "/posts",
          // },
          {
            title: "Home",
            href: "/",
          },
        ],
      };
    })
  );
};

const authorLocations: DocumentLocationResolver = (params, context) => {
  // Subscribe to the latest slug and name
  const doc$ = context.documentStore.listenQuery(
    `*[_id == $id][0]{slug,name}`,
    params,
    { perspective: "previewDrafts" } // returns a draft author if it exists
  );
  // Return a streaming list of locations
  return doc$.pipe(
    map((doc: any) => {
      // If the document doesn't exist or have a slug, return null
      if (!doc?.slug?.current) {
        return null;
      }
      return {
        locations: [
          // {
          //   title: (doc.name as string) || "Untitled",
          //   href: `/authors/${doc.slug.current}`,
          // },
          // {
          //   title: "Authors",
          //   href: "/authors",
          // },
          {
            title: "Home",
            href: "/",
          },
        ],
      };
    })
  );
};

const categoryLocations: DocumentLocationResolver = (params, context) => {
  // Subscribe to the latest slug and title
  const doc$ = context.documentStore.listenQuery(
    `*[_id == $id][0]{slug,title}`,
    params,
    { perspective: "previewDrafts" } // returns a draft category if it exists
  );
  // Return a streaming list of locations
  return doc$.pipe(
    map((doc: any) => {
      // If the document doesn't exist or have a slug, return null
      if (!doc?.slug?.current) {
        return null;
      }
      return {
        locations: [
          // {
          //   title: (doc.title as string) || "Untitled",
          //   href: `/categories/${doc.slug.current}`,
          // },
          // {
          //   title: "Categories",
          //   href: "/categories",
          // },
          {
            title: "Home",
            href: "/",
          },
        ],
      };
    })
  );
};
