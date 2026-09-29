import { useEffect, useRef, type ReactNode } from "react";
import { Button } from "../components/ui";
import { useLang } from "../i18n/context";

/**
 * Full-screen page shown on top of the scenes (project details, legal
 * notice). Scene navigation is paused while it is open; Escape or the Back
 * button closes it. Focus moves to the title on open so keyboard and screen
 * reader users start at the top.
 */
export default function Overlay({
  title,
  onClose,
  children,
}: {
  title: string;
  onClose: () => void;
  children: ReactNode;
}) {
  const { t } = useLang();
  const titleRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    titleRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={title}
      className="fixed inset-0 z-30 motion-safe:animate-[overlay-in_500ms_var(--ease-crystal)]"
    >
      <div data-scroll-area className="scroll-area h-full px-4 pt-20 pb-16 sm:px-10 sm:pt-24 sm:pb-12 lg:px-16 xl:px-24">
        <div className="mx-auto w-full max-w-[1280px]">
          <Button tone="glass" onClick={onClose} className="mb-8">
            <span aria-hidden="true" className="size-2 rotate-45 border-b-2 border-l-2 border-current" />
            {t.ui.back}
          </Button>

          <h1
            ref={titleRef}
            tabIndex={-1}
            className="mb-8 text-[clamp(1.75rem,4.5vw,3.25rem)] leading-tight font-black tracking-wide uppercase outline-none"
          >
            {title}
          </h1>

          {children}
        </div>
      </div>
    </div>
  );
}
