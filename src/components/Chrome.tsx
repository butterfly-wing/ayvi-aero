import { useLang } from "../i18n/context";
import { SCENES } from "../navigation/route";
import { CrystalLayers } from "./Crystal";
import { hexShape } from "./shapes";

// Fixed interface elements that stay on screen over every scene.

/** FR / EN toggle, top-right. */
export function LangSwitch() {
  const { lang, setLang, t } = useLang();
  const next = lang === "fr" ? "en" : "fr";

  return (
    <button
      type="button"
      onClick={() => setLang(next)}
      aria-label={t.ui.switchLang}
      title={t.ui.switchLang}
      className="group fixed top-4 right-4 z-50 flex gap-1.5 px-5 py-2 sm:px-6 text-xs font-semibold tracking-[0.2em] transition-[translate] duration-500 ease-crystal hover:-translate-y-0.5 sm:top-6 sm:right-6"
    >
      <CrystalLayers shape={hexShape} depth={3} interactive />
      <span className={`relative ${lang === "fr" ? "" : "text-ink/35"}`}>FR</span>
      <span aria-hidden="true" className="relative text-ink/35">/</span>
      <span className={`relative ${lang === "en" ? "" : "text-ink/35"}`}>EN</span>
    </button>
  );
}

/**
 * Row of diamonds (right edge on desktop, bottom on phones): shows the
 * current scene and jumps to any scene. On touch screens this is the only
 * way to change scenes.
 */
export function SceneIndicator({ active, onSelect }: { active: number; onSelect: (i: number) => void }) {
  const { t } = useLang();

  return (
    <nav
      aria-label="Sections"
      className="fixed bottom-2 left-1/2 z-40 -translate-x-1/2 sm:top-1/2 sm:right-6 sm:bottom-auto sm:left-auto sm:translate-x-0 sm:-translate-y-1/2"
    >
      <ol className="flex flex-row items-center gap-1 sm:flex-col sm:items-end sm:gap-4">
        {SCENES.map((key, i) => {
          const current = i === active;
          return (
            <li key={key}>
              <button
                type="button"
                onClick={() => onSelect(i)}
                aria-current={current ? "step" : undefined}
                className="group flex items-center gap-3 p-3 sm:p-1"
              >
                <span className="pointer-events-none hidden text-xs font-semibold tracking-[0.2em] text-ink/60 uppercase opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100 md:inline">
                  {t.ui.sections[key]}
                </span>
                <span className="sr-only md:hidden">{t.ui.sections[key]}</span>
                <span
                  aria-hidden="true"
                  className={`block rotate-45 border border-ink transition-all duration-500 ease-crystal ${
                    current ? "size-3 bg-ink" : "size-2 bg-transparent opacity-40 group-hover:opacity-100"
                  }`}
                />
              </button>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
