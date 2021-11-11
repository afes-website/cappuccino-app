import { BulkUpdateDispatch, BulkUpdateState } from "hooks/bulkUpdate/@types";
import createCtx from "libs/createCtx";

export const [useBulkUpdateState, BulkUpdateStateContextProvider] =
  createCtx<BulkUpdateState>();
export const [useBulkUpdateDispatch, BulkUpdateDispatchContextProvider] =
  createCtx<BulkUpdateDispatch>();
