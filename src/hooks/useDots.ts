import { useEffect, useReducer } from "react";

function useDots(interval: number): string {
  const [idx, update] = useReducer((prev) => (prev + 1) % 4, 0);
  useEffect(() => {
    const intervalId = setInterval(update, interval);
    return () => clearInterval(intervalId);
  }, [interval]);
  return ".".repeat(idx);
}

export default useDots;
