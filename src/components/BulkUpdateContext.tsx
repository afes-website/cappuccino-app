import React, {
  PropsWithChildren,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import api, { BulkQuery, BulkResult } from "@afes-website/docs";
import { useAspidaClient, useAuthState } from "hooks/auth/useAuth";
import { BulkQueryResult, BulkQueryWithUser } from "hooks/bulkUpdate/@types";
import {
  BulkUpdateDispatchContextProvider,
  BulkUpdateStateContextProvider,
} from "hooks/bulkUpdate/useBulkUpdate";

const ls_key_query = "bulk_update_queries";

const BulkUpdateContext: React.VFC<PropsWithChildren<unknown>> = ({
  children,
}) => {
  const aspida = useAspidaClient();
  const { allUsers } = useAuthState();

  const [onLine, setOnLine] = useState<boolean>(navigator.onLine);
  const [queries, setQueries] = useState<BulkQueryWithUser[]>(
    JSON.parse(localStorage.getItem(ls_key_query) ?? "[]")
  );
  const [results, setResults] = useState<BulkQueryResult[]>([]);

  useEffect(() => {
    localStorage.setItem(ls_key_query, JSON.stringify(queries));
  }, [queries]);

  // push query
  const pushQuery = useCallback((_query: BulkQueryWithUser): void => {
    setQueries((prev) => [...prev, _query]);
  }, []);

  const _bulkUpdate = useCallback(async () => {
    type UserQueryRecord = Record<string, (BulkQuery & { index: number })[]>;
    type UserQueryResultRecord = Record<
      string,
      (BulkQuery & BulkResult & { index: number })[]
    >;

    // query をユーザーごとに分類
    const userQueries: UserQueryRecord = queries.reduce<UserQueryRecord>(
      (obj, query, index) => {
        const { userId, ...bulkQuery } = query;
        if (obj[userId] === undefined) obj[userId] = [];
        obj[userId].push({ ...bulkQuery, index });
        return obj;
      },
      {}
    );

    // ユーザーごとに bulk_update を POST
    const userQueryResult: UserQueryResultRecord = (
      await Promise.all(
        Object.entries(userQueries).map(([userId, bulkQueryWithIndex]) =>
          api(aspida)
            .guests.bulk_update.$post({
              headers: {
                Authorization: "bearer " + allUsers[userId].token,
              },
              body: bulkQueryWithIndex,
            })
            .then((res) => {
              console.log(
                `[bulk update] user: @${userId} / count: ${res.length}`
              );
              return {
                userId,
                queryResults: res.map((bulkResult, indexInUser) => ({
                  ...bulkQueryWithIndex[indexInUser],
                  ...bulkResult,
                })),
              };
            })
        )
      )
    ).reduce<UserQueryResultRecord>((obj, queryResultWithIndex) => {
      const { userId, queryResults } = queryResultWithIndex;
      obj[userId] = queryResults;
      return obj;
    }, {});

    // 更新後の state を用意
    const nextResultsWithIndex: (BulkQueryResult & { index: number })[] =
      Object.entries(userQueryResult).flatMap(([userId, queryResults]) =>
        queryResults
          .flatMap((queryResult) => ({ userId, ...queryResult }))
          .sort((a, b) => a.index - b.index)
      );
    const nextQueries: BulkQueryWithUser[] = queries.filter((query, index) =>
      nextResultsWithIndex.every((queryResult) => index !== queryResult.index)
    );

    // setState
    setResults(nextResultsWithIndex);
    setQueries(nextQueries);
  }, [allUsers, aspida, queries]);

  // 1分ごとに _bulkUpdate を実行する
  useEffect(() => {
    const intervalId = window.setInterval(_bulkUpdate, 60000);
    return () => window.clearInterval(intervalId);
  }, [_bulkUpdate]);

  // offline / online 検知
  useEffect(() => {
    const onOnLine = () => setOnLine(true);
    const onOffLine = () => setOnLine(false);

    window.addEventListener("online", onOnLine);
    window.addEventListener("offline", onOffLine);

    return () => {
      window.removeEventListener("online", onOnLine);
      window.removeEventListener("offline", onOffLine);
    };
  }, []);

  const bulkUpdateState = useMemo(
    () => ({
      onLine,
      queries,
      results,
    }),
    [onLine, queries, results]
  );

  const bulkUpdateDispatch = useMemo(
    () => ({
      pushQuery,
    }),
    [pushQuery]
  );

  return (
    <BulkUpdateStateContextProvider value={bulkUpdateState}>
      <BulkUpdateDispatchContextProvider value={bulkUpdateDispatch}>
        {children}
      </BulkUpdateDispatchContextProvider>
    </BulkUpdateStateContextProvider>
  );
};

export default BulkUpdateContext;
