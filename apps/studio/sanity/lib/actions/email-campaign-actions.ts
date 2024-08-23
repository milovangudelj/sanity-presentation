import {
  DocumentActionComponent,
  DocumentActionDescription,
  DocumentActionProps,
} from "sanity";

export const patchEmailCampaignActions = (
  actions: DocumentActionComponent[]
): DocumentActionComponent[] => {
  return actions.map((action) => createPatchedEmailCampaignAction(action));
};

const createPatchedEmailCampaignAction = (
  action: DocumentActionComponent
): DocumentActionComponent => {
  return function patchedEmailCampaignAction(
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
