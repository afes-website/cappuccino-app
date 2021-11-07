import { Provider, createContext, useContext } from "react";

/**
 * undefined を許さない createContext の wrapper
 * <br>
 * [【React】デフォルト値もundefinedチェックもいらないcreateContext【Typescript】 \- Qiita](https://qiita.com/johnmackay150/items/88654e5064290c24a32a)
 *
 * @return `[useCtx, CtxProvider]`
 *
 * @throws useCtx must be inside a Provider with a value
 */
export default function createCtx<ContextType>(): [
  () => ContextType,
  Provider<ContextType | undefined>
] {
  const ctx = createContext<ContextType | undefined>(undefined);
  function useCtx() {
    const c = useContext(ctx);
    if (!c) throw new Error("useCtx must be inside a Provider with a value");
    return c;
  }
  return [useCtx, ctx.Provider];
}
