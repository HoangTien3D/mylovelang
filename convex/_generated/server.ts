import { PublicHttpAction, GenericActionCtx } from "convex/server";

export function httpAction(
  handler: (ctx: GenericActionCtx<any>, request: Request) => Promise<Response>
): PublicHttpAction {
  return handler as unknown as PublicHttpAction;
}
