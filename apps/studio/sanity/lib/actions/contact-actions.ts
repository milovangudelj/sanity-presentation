import {
  DocumentActionComponent,
  DocumentActionDescription,
  DocumentActionProps,
  useDocumentOperation,
} from "sanity";

export const patchContactActions = (
  actions: DocumentActionComponent[]
): DocumentActionComponent[] => {
  return actions.map((action) => createPatchedContactAction(action));
};

const createPatchedContactAction = (
  action: DocumentActionComponent
): DocumentActionComponent => {
  return function patchedContactAction(
    props: DocumentActionProps
  ): DocumentActionDescription | null {
    const originalAction = action(props);

    if (!originalAction) return originalAction;

    return {
      ...originalAction,
      disabled:
        originalAction.disabled ||
        action.action === "duplicate" ||
        action.action === "unpublish",
      onHandle:
        action.action === "publish"
          ? handleContactPublish(props)
          : originalAction.onHandle,
    } satisfies DocumentActionDescription;
  };
};

const handleContactPublish = (props: DocumentActionProps) => {
  const { patch, publish } = useDocumentOperation(props.id, props.type);

  return () => {
    patch.execute([
      {
        set: {
          updatedAt: new Date().toISOString(),
        },
      },
    ]);

    publish.execute();

    props.onComplete();
  };
};
