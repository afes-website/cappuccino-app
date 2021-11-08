import { useReducer } from "react";

const useReset = (): [number, () => void] => {
  return useReducer((prev) => prev + 1, 0);
};

export default useReset;
