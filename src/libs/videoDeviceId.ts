import { useState } from "react";

const storage_key = "videoDeviceId";

export const useDeviceId = (): [string, (val: string) => void] => {
  const [state, setState] = useState<string>(
    localStorage.getItem(storage_key) || ""
  );
  const setDeviceId = (deviceId: string) => {
    setState(deviceId);
    localStorage.setItem(storage_key, deviceId);
  };
  return [state, setDeviceId];
};

export const getDeviceIdFromStorage = (): string | null =>
  localStorage.getItem(storage_key);
