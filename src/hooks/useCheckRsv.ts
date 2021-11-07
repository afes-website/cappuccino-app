import { Dispatch, SetStateAction, useCallback, useState } from "react";
import api, { Reservation } from "@afes-website/docs";
import { useAspidaClient, useAuthState } from "hooks/auth/useAuth";
import { SetError, SetErrorCode } from "hooks/useErrorHandler";
import { StatusColor } from "types/statusColor";

interface ReturnType {
  latestRsv: Reservation | null;
  checkRsv: (rsvId: string, onSuccess?: () => void) => Promise<void>;
  init: () => void;
}

const useCheckRsv = (
  setError: SetError,
  setErrorCode: SetErrorCode,
  setCheckStatus: Dispatch<SetStateAction<StatusColor | null>>
): ReturnType => {
  const aspida = useAspidaClient();
  const { currentUser } = useAuthState();

  const [latestRsv, setLatestRsv] = useState<Reservation | null>(null);

  const checkRsv: ReturnType["checkRsv"] = useCallback(
    async (rsvId, onSuccess) => {
      try {
        const res = await api(aspida)
          .reservations._id(rsvId)
          .check.$get({
            headers: {
              Authorization: "bearer " + currentUser?.token,
            },
          });
        setLatestRsv(res.reservation);
        if (res.valid) {
          setCheckStatus("success");
          if (onSuccess !== undefined) onSuccess();
        } else {
          setCheckStatus("error");
          if (res.error_code) setErrorCode(res.error_code);
        }
      } catch (e) {
        setCheckStatus("error");
        setError(e);
      }
    },
    [aspida, currentUser?.token, setCheckStatus, setError, setErrorCode]
  );

  const init = useCallback(() => {
    setLatestRsv(null);
  }, []);

  return { latestRsv, checkRsv, init };
};

export default useCheckRsv;
