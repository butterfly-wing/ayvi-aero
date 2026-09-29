import { useEffect, useMemo, useState, type ReactNode } from "react";
import en from "../content/en";
import fr from "../content/fr";
import type { Lang } from "../content/types";
import { LangContext } from "./context";

const dictionaries = { fr, en };
const STORAGE_KEY = "lang";
const DEFAULT_LANG: Lang = "fr";

function readStoredLang(): Lang {
  try {
    const value = localStorage.getItem(STORAGE_KEY);
    if (value === "fr" || value === "en") return value;
  } catch {
    // Storage can be blocked (private mode, strict settings): use the default.
  }
  return DEFAULT_LANG;
}

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(readStoredLang);

  const setLang = (next: Lang) => {
    setLangState(next);
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // Not persisted; the choice still applies for this visit.
    }
  };

  // Keep <html lang>, the tab title and the meta description in sync.
  useEffect(() => {
    const { meta } = dictionaries[lang];
    document.documentElement.lang = lang;
    document.title = meta.title;
    document.querySelector('meta[name="description"]')?.setAttribute("content", meta.description);
  }, [lang]);

  const value = useMemo(() => ({ lang, setLang, t: dictionaries[lang] }), [lang]);
  return <LangContext.Provider value={value}>{children}</LangContext.Provider>;
}
