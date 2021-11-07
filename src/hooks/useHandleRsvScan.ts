import { Dispatch, SetStateAction, useCallback, useState } from "react";
import { SetErrorCode } from "hooks/useErrorHandler";
import { isReservation } from "libs/isReservation";
import { StatusColor } from "types/statusColor";

interface ReturnType {
  latestRsvId: string;
  handleRsvScan: (rsvJson: string, onSuccess?: (rsvId: string) => void) => void;
  init: () => void;
}

const useHandleRsvScan = (
  setErrorCode: SetErrorCode,
  setCheckStatus: Dispatch<SetStateAction<StatusColor | null>>
): ReturnType => {
  const [latestRsvId, setLatestRsvId] = useState("");

  const handleRsvScan: ReturnType["handleRsvScan"] = useCallback(
    (rsvJson, onSuccess) => {
      setCheckStatus("loading");
      try {
        const _rsv = JSON.parse(rsvJson);
        if (isReservation(_rsv)) {
          setLatestRsvId(_rsv.id);
          if (onSuccess !== undefined) onSuccess(_rsv.id);
        } else {
          throw new Error("The given json is not valid Reservation");
        }
      } catch {
        setLatestRsvId("");
        setCheckStatus("error");
        setErrorCode("QR_SYNTAX_ERROR");
      }
    },
    [setCheckStatus, setErrorCode]
  );

  const init = useCallback(() => {
    setLatestRsvId("");
  }, []);

  return { latestRsvId, handleRsvScan, init };
};

export default useHandleRsvScan;
