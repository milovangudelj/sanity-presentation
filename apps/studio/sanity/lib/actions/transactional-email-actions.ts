import {
  DocumentActionComponent,
  DocumentActionDescription,
  DocumentActionProps,
} from "sanity";

export const patchTransactionalEmailActions = (
  actions: DocumentActionComponent[]
): DocumentActionComponent[] => {
  return actions.map((action) => createPatchedTransactionalEmailAction(action));
};

const createPatchedTransactionalEmailAction = (
  action: DocumentActionComponent
): DocumentActionComponent => {
  return function patchedTransactionalEmailAction(
    props: DocumentActionProps
  ): DocumentActionDescription | null {
    const originalAction = action(props);

    if (!originalAction) return originalAction;

    return {
      ...originalAction,
      disabled:
        originalAction.disabled ||
        action.action === "delete" ||
        action.action === "duplicate" ||
        action.action === "unpublish",
    } satisfies DocumentActionDescription;
  };
};
