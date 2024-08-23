import {
  DocumentActionComponent,
  DocumentActionDescription,
  DocumentActionProps,
  useDocumentOperation,
} from "sanity";

export const patchMarketingEmailActions = (
  actions: DocumentActionComponent[]
): DocumentActionComponent[] => {
  return actions.map((action) => createPatchedMarketingEmailAction(action));
};

const createPatchedMarketingEmailAction = (
  action: DocumentActionComponent
): DocumentActionComponent => {
  if (action.action === "duplicate") return action;

  function patchedMarketingEmailAction(
    props: DocumentActionProps
  ): DocumentActionDescription | null {
    const originalAction = action(props);

    if (!originalAction) return originalAction;

    return {
      ...originalAction,
      disabled:
        props.published || !props.draft ? true : originalAction.disabled,
      onHandle:
        action.action === "publish"
          ? handleMarketingEmailPublish(props)
          : originalAction.onHandle,
    } satisfies DocumentActionDescription;
  }
  return patchedMarketingEmailAction;
};

const handleMarketingEmailPublish = (props: DocumentActionProps) => {
  const { patch, publish } = useDocumentOperation(props.id, props.type);

  return () => {
    patch.execute([
      {
        set: {
          status: "published",
          publishedAt: new Date().toISOString(),
        },
      },
    ]);

    publish.execute();

    props.onComplete();
  };
};
