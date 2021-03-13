import { useEffect } from "react";
import createCtx from "@/libs/createCtx";

export function useTitleSet(_new_title: string): void {
  const titleCtx = useTitleContext();

  useEffect(() => {
    titleCtx._setTitle(_new_title);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [_new_title]);
}

export const [useTitleContext, TitleContextProvider] = createCtx<{
  title: string;
  _setTitle: (_new_title: string) => void;
}>();

export const TitleCtx = { useTitleContext, TitleContextProvider };

export default { useTitleSet, TitleCtx };
