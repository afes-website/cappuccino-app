import { AxiosError } from "axios";
function is_object(x: unknown): x is Record<string, unknown> {
  return x !== null && (typeof x === "object" || typeof x === "function");
}
export default function isAxiosError(e: unknown): e is AxiosError {
  if (!is_object(e)) return false;
  return "isAxiosError" in e;
}
