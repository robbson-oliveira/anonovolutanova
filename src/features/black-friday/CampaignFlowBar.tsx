import { BLACK_FRIDAY_HOME_ACTIVE } from "@/lib/black-friday";
import { BlackFridayTopBar } from "./BlackFridayTopBar";

/**
 * The campaign top bar on the cart and the checkout. Reads
 * `BLACK_FRIDAY_HOME_ACTIVE`, so turning that flag off removes the bar
 * and the desktop offset without editing those pages.
 */
export function CampaignFlowBar() {
  if (!BLACK_FRIDAY_HOME_ACTIVE) return null;
  return <BlackFridayTopBar />;
}

/**
 * Desktop clearance for the fixed bar (36px) plus the room the sticky
 * summaries already kept (`2rem`). Empty while the campaign is off, so
 * those pages sit where they did before.
 */
export const campaignFlowOffset = BLACK_FRIDAY_HOME_ACTIVE
  ? "lg:pt-9 lg:[--anln-flow-sticky:68px]"
  : "";
