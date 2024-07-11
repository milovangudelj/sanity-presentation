import {
  type DocumentActionDescription,
  type DocumentActionProps,
  type DocumentActionComponent,
  type DocumentActionsResolver,
} from "sanity";

export const patchedActions: DocumentActionsResolver = (actions, context) => {
  return context.schemaType === "newsletterEmail"
    ? patchActions(actions)
    : actions;
};

const patchActions = (
  actions: DocumentActionComponent[]
): DocumentActionComponent[] => {
  return actions.map((action) => createPatchedAction(action));
};

const createPatchedAction = (
  action: DocumentActionComponent
): DocumentActionComponent => {
  if (action.action === "duplicate") return action;

  function patchedAction(
    props: DocumentActionProps
  ): DocumentActionDescription | null {
    const originalAction = action(props);

    if (!originalAction) return null;

    return {
      ...originalAction,
      disabled:
        props.published || !props.draft ? true : originalAction.disabled,
    } satisfies DocumentActionDescription;
  }
  return patchedAction;
};
