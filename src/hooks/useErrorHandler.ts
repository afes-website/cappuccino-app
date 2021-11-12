import { useCallback, useState } from "react";
import axios from "axios";

export type SetError = (e: unknown) => void;
export type SetErrorCode = (code: string | ErrorCode | null) => void;

const useErrorHandler = (): [
  readonly string[] | null,
  SetError,
  SetErrorCode
] => {
  const [errorMessage, setErrorMessage] = useState<readonly string[] | null>(
    null
  );

  const setErrorCode = useCallback((_code: string | ErrorCode | null): void => {
    if (_code === null) {
      setErrorMessage(null);
      return;
    }
    const errorCode: ErrorCode = (
      errorCodeList as ReadonlyArray<string>
    ).includes(_code)
      ? (_code as ErrorCode)
      : "INTERNAL_ERROR";
    setErrorMessage(errorMessageList[errorCode]);
  }, []);

  const setError = useCallback(
    (e: unknown): void => {
      if (e === null) {
        setErrorCode(null);
        return;
      }
      if (axios.isAxiosError(e)) {
        const errorCode: unknown = e.response?.data.error_code;
        if (typeof errorCode === "string" && errorCode !== "") {
          setErrorCode(errorCode);
          return;
        }
        // 500 系統
        setErrorCode("SERVER_ERROR");
        setErrorMessage((prev) => [
          ...(prev ?? []),
          `status: ${e.response?.status ?? "undefined"}`,
          e.message,
        ]);
      } else {
        // なんもわからん
        setErrorCode("NETWORK_ERROR");
      }
    },
    [setErrorCode]
  );

  return [errorMessage, setError, setErrorCode];
};

const errorCodeList = [
  // check in
  "INVALID_WRISTBAND_CODE",
  "ALREADY_USED_WRISTBAND",
  "RESERVATION_NOT_FOUND",
  "ALL_MEMBER_CHECKED_IN",
  "OUT_OF_RESERVATION_TIME",
  "WRONG_WRISTBAND_COLOR",
  // guest scan
  "GUEST_NOT_FOUND",
  "GUEST_ALREADY_ENTERED",
  "PEOPLE_LIMIT_EXCEEDED",
  "GUEST_ALREADY_CHECKED_OUT",
  "EXIT_TIME_EXCEEDED",
  "EXHIBITION_NOT_FOUND",
  "CHECK_OUT_PROHIBITED",
  // register spare
  "NO_MEMBER_CHECKED_IN",
  // network error
  "NETWORK_ERROR",
  "SERVER_ERROR",
  // internal error
  "INTERNAL_ERROR",
  "QR_SYNTAX_ERROR",
  "ID_IS_TOO_LONG",
] as const;

type ErrorCode = typeof errorCodeList[number];

export default useErrorHandler;

const errorMessageList: { [code in ErrorCode]: readonly string[] } = {
  // reservation
  RESERVATION_NOT_FOUND: [
    "合致する予約情報がありません。マニュアルを参照し、権限の強い人を呼んでください。",
  ],
  OUT_OF_RESERVATION_TIME: [
    "入場可能時間外です。マニュアルを参照してください。",
  ],
  ALL_MEMBER_CHECKED_IN: [
    "すでに予約人数全員の入場処理が完了しています。権限の強い人を呼んでください。",
  ],
  // guest (wristband)
  INVALID_WRISTBAND_CODE: [
    "リストバンド ID の形式が間違っています。予約 QR を読んでいませんか？",
  ],
  ALREADY_USED_WRISTBAND: [
    "使用済みのリストバンドです。権限の強い人を呼んでください。",
  ],
  WRONG_WRISTBAND_COLOR: ["リストバンドの種類が間違っています。"],
  // guest scan
  GUEST_NOT_FOUND: ["合致する来場者情報がありません。"],
  GUEST_ALREADY_ENTERED: ["すでに入室処理が完了しています。"],
  PEOPLE_LIMIT_EXCEEDED: ["すでに展示の滞在人数の上限に達しています。"],
  GUEST_ALREADY_CHECKED_OUT: [
    "来場者は一度麻布から退場しています。",
    "必要に応じて近くの統制局員・総務局員にお問い合わせください。",
  ],
  EXIT_TIME_EXCEEDED: ["来場者は既に退場予定時刻を過ぎています。"],
  EXHIBITION_NOT_FOUND: [
    "内部エラーです。至急、総務局にお問い合わせください。（EXHIBITION_NOT_FOUND）",
  ],
  CHECK_OUT_PROHIBITED: [
    "このリストバンドは退場できません。",
    "退場処理しようとしているリストバンドの種類を確認してください。",
  ],
  // register spare
  NO_MEMBER_CHECKED_IN: [
    "まだ誰も入場していない予約です。",
    "正しいチケットか確認し、問題がなければ入場処理を行ってください。",
  ],
  NETWORK_ERROR: [
    "通信エラーが発生しました。通信環境を確認し、はじめからやり直してください。",
    "状況が改善しない場合は、総務局にお問い合わせください。",
  ],
  SERVER_ERROR: [
    "サーバーエラーが発生しました。至急、総務局にお問い合わせください。",
  ],
  INTERNAL_ERROR: [
    "内部エラーが発生しました。至急、総務局にお問い合わせください。",
  ],
  QR_SYNTAX_ERROR: [
    "予約QRコードの形式が間違っています。",
    "リストバンドをスキャンしていませんか？",
  ],
  ID_IS_TOO_LONG: [
    "リストバンドQRコードの形式が間違っています。",
    "予約をスキャンする場合は、「処理を終了し予約スキャンに戻る」を押してください。",
  ],
} as const;
