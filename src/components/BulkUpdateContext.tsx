import React, { PropsWithChildren, useEffect, useState } from "react";
import {
  BulkUpdateDispatchContextProvider,
  BulkUpdateStateContextProvider,
} from "hooks/bulkUpdate/useBulkUpdate";

const BulkUpdateContext: React.VFC<PropsWithChildren<unknown>> = ({
  children,
}) => {
  const [onLine, setOnLine] = useState<boolean>(navigator.onLine);

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

  return (
    <BulkUpdateStateContextProvider value={{ onLine }}>
      <BulkUpdateDispatchContextProvider
        value={{
          push: () => {
            console.log("Hi");
          },
        }}
      >
        {children}
      </BulkUpdateDispatchContextProvider>
    </BulkUpdateStateContextProvider>
  );
};

export default BulkUpdateContext;
