import { type DocumentActionsResolver } from "sanity";

import { patchMarketingEmailActions } from "./marketing-email-actions";
import { patchTransactionalEmailActions } from "./transactional-email-actions";
import { patchEmailCampaignActions } from "./email-campaign-actions";
import { patchEmailCampaignTemplateActions } from "./email-campaign-template-actions";
import { patchContactActions } from "./contact-actions";

export const patchedActions: DocumentActionsResolver = (actions, context) => {
  switch (context.schemaType) {
    case "marketingEmail":
      return patchMarketingEmailActions(actions);
    case "transactionalEmail":
      return patchTransactionalEmailActions(actions);
    case "emailCampaign":
      return patchEmailCampaignActions(actions);
    case "emailCampaignTemplate":
      return patchEmailCampaignTemplateActions(actions);
    case "contact":
      return patchContactActions(actions);
    default:
      return actions;
  }
};
