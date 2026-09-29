import { createContext, useContext } from "react";
import type { Content, Lang } from "../content/types";

export type LangState = {
  lang: Lang;
  setLang: (lang: Lang) => void;
  /** All text for the active language. */
  t: Content;
};

export const LangContext = createContext<LangState | null>(null);

export function useLang(): LangState {
  const state = useContext(LangContext);
  if (!state) throw new Error("useLang must be used inside <LangProvider>");
  return state;
}
