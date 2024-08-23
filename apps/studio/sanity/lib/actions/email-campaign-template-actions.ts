import {
  DocumentActionComponent,
  DocumentActionDescription,
  DocumentActionProps,
} from "sanity";

export const patchEmailCampaignTemplateActions = (
  actions: DocumentActionComponent[]
): DocumentActionComponent[] => {
  return actions.map((action) =>
    createPatchedEmailCampaignTemplateAction(action)
  );
};

const createPatchedEmailCampaignTemplateAction = (
  action: DocumentActionComponent
): DocumentActionComponent => {
  return function patchedEmailCampaignTemplateAction(
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
