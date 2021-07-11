import { useCallback, useEffect, useState } from "react";
import isAxiosError from "libs/isAxiosError";

const useErrorHandler = (): [
  string,
  {
    open: boolean;
    title: string;
    message: string[];
    setOpen: (open: boolean) => void;
  },
  (code: string) => void,
  (e: unknown) => void
] => {
  const [code, setCode] = useState<ErrorCode | null>(null);
  const [errorMessage, setErrorMessage] = useState("");

  const [title, setTitle] = useState("");
  const [message, setMessage] = useState<string[]>([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setErrorMessage(
      (() => {
        switch (code) {
          // reservation
          case "RESERVATION_NOT_FOUND":
            return "合致する予約情報がありません。マニュアルを参照し、権限の強い人を呼んでください。";
          case "INVALID_RESERVATION_INFO":
            return "予約情報に不備があります。権限の強い人を呼んでください。";
          case "OUT_OF_RESERVATION_TIME":
            return "入場可能時間外です。マニュアルを参照してください。";
          case "ALL_MEMBER_CHECKED_IN":
            return "すでに予約人数全員の入場処理が完了しています。権限の強い人を呼んでください。";
          // guest (wristband)
          case "INVALID_WRISTBAND_CODE":
            return "リストバンド ID の形式が間違っています。予約 QR を読んでいませんか？";
          case "ALREADY_USED_WRISTBAND":
            return "使用済みのリストバンドです。権限の強い人を呼んでください。";
          case "WRONG_WRISTBAND_COLOR":
            return "リストバンドの種類が間違っています。";
          // guest scan
          case "GUEST_NOT_FOUND":
            return "合致する来場者情報がありません。";
          case "GUEST_ALREADY_ENTERED":
            return "すでに入室処理が完了しています。";
          case "PEOPLE_LIMIT_EXCEEDED":
            return "すでに展示の滞在人数の上限に達しています。";
          case "GUEST_ALREADY_EXITED":
            return "来場者は一度麻布から退場しています。必要に応じて近くの統制局員・総務局員にお問い合わせください。";
          case "EXIT_TIME_EXCEEDED":
            return "来場者は既に退場予定時刻を過ぎています。";
          case "EXHIBITION_NOT_FOUND":
            return "内部エラーです。至急、総務局にお問い合わせください。（EXHIBITION_NOT_FOUND）";
          case "NETWORK_ERROR":
            return "通信エラーが発生しました。通信環境を確認し、はじめからやり直してください。状況が改善しない場合は、総務局にお問い合わせください。";
          case "SERVER_ERROR":
            return "サーバーエラーが発生しました。至急、総務局にお問い合わせください。";
          case "INTERNAL_ERROR":
            return "内部エラーが発生しました。至急、総務局にお問い合わせください。";
          case null:
            return "";
        }
      })()
    );
  }, [code]);

  const setErrorCode = useCallback((code: string) => {
    if ((errorCodeList as ReadonlyArray<string>).includes(code))
      setCode(code as ErrorCode);
    else setCode("INTERNAL_ERROR");
  }, []);

  const setError = useCallback((e: unknown): void => {
    if (e === null) {
      setCode(null);
      setOpen(false);
      setTitle("");
      setMessage([]);
      return;
    }
    if (isAxiosError(e)) {
      const errorCode: unknown = e.response?.data.error_code;
      if (
        typeof errorCode === "string" &&
        (errorCodeList as ReadonlyArray<string>).includes(errorCode)
      ) {
        setCode(errorCode as ErrorCode);
        return;
      }
    } else {
      console.error(e);
      setOpen(true);
      if (isAxiosError(e)) {
        // axios error
        if (e.response?.status) {
          // status code があるとき
          setCode("SERVER_ERROR");
          setTitle("サーバーエラー");
          setMessage([
            "サーバーエラーが発生しました。",
            "総務局にお問い合わせください。",
            `status code: ${e.response?.status || "undefined"}`,
            e.message,
          ]);
        }
        // ないとき
        else {
          setCode("NETWORK_ERROR");
          setTitle("通信エラー");
          setMessage([
            "通信エラーが発生しました。",
            "通信環境を確認し、はじめからやり直してください。",
            "状況が改善しない場合は、総務局にお問い合わせください。",
            e.message,
          ]);
        }
      }
      // なにもわからないとき
      else {
        setCode("NETWORK_ERROR");
        setTitle("通信エラー");
        setMessage([
          "通信エラーが発生しました。",
          "通信環境を確認し、はじめからやり直してください。",
          "状況が改善しない場合は、総務局にお問い合わせください。",
        ]);
      }
    }
  }, []);

  return [
    errorMessage,
    { open, title, message, setOpen },
    setErrorCode,
    setError,
  ];
};

const errorCodeList = [
  // check in
  "INVALID_WRISTBAND_CODE",
  "ALREADY_USED_WRISTBAND",
  "RESERVATION_NOT_FOUND",
  "INVALID_RESERVATION_INFO",
  "ALL_MEMBER_CHECKED_IN",
  "OUT_OF_RESERVATION_TIME",
  "WRONG_WRISTBAND_COLOR",
  // guest scan
  "GUEST_NOT_FOUND",
  "GUEST_ALREADY_ENTERED",
  "PEOPLE_LIMIT_EXCEEDED",
  "GUEST_ALREADY_EXITED",
  "EXIT_TIME_EXCEEDED",
  "EXHIBITION_NOT_FOUND",
  // network error
  "NETWORK_ERROR",
  "SERVER_ERROR",
  // internal error
  "INTERNAL_ERROR",
] as const;

type ErrorCode = typeof errorCodeList[number];

export default useErrorHandler;
