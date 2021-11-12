import { Dispatch, SetStateAction, useCallback, useState } from "react";
import api, { Reservation } from "@afes-website/docs";
import moment from "moment";
import { useAspidaClient, useAuthState } from "hooks/auth/useAuth";
import { SetError, SetErrorCode } from "hooks/useErrorHandler";
import { isReservation } from "libs/isReservation";
import { StatusColor } from "types/statusColor";

interface ReturnType {
  latestRsv: Reservation | null;
  setRsv: (rsv: string, onSuccess?: () => void) => void;
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

  const setRsv: ReturnType["setRsv"] = (rsvJson, onSuccess) => {
    const reservation = JSON.parse(rsvJson);
    if (isReservation(reservation)) {
      if (
        moment() >= moment(reservation.term.enter_scheduled_time) &&
        moment() <= moment(reservation.term.exit_scheduled_time)
      ) {
        setCheckStatus("warning");
        if (onSuccess !== undefined) onSuccess();
      } else {
        setCheckStatus("error");
        setErrorCode("OUT_OF_RESERVATION_TIME");
      }
      setLatestRsv(reservation);
    } else {
      setCheckStatus("error");
      setErrorCode("QR_SYNTAX_ERROR");
    }
  };

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

  return { latestRsv, setRsv, checkRsv, init };
};

export default useCheckRsv;
