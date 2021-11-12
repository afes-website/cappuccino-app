import { BulkQuery, BulkResult } from "@afes-website/docs";

export type BulkQueryWithUser = BulkQuery & { userId: string };
export type BulkQueryResult = BulkQueryWithUser & BulkResult;

export type BulkUpdateState = {
  onLine: boolean;
  queries: BulkQueryWithUser[];
  results: BulkQueryResult[];
};

export type BulkUpdateDispatch = {
  pushQuery: (query: BulkQueryWithUser) => void;
};
