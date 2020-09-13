import { createContext } from "react";

const TitleContext = createContext<{
  title: string;
  set: (_title: string) => void;
}>({
  title: "",
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  set: () => {},
});

export default TitleContext;
