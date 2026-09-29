import { Button } from "../components/ui";
import { useLang } from "../i18n/context";

export default function Hero({ onNext, onContact }: { onNext: () => void; onContact: () => void }) {
  const { t } = useLang();

  return (
    <div className="flex flex-col">
      <h1 className="font-black leading-[0.95] tracking-[0.06em] uppercase">
        <span className="block text-[clamp(2.5rem,9vw,7.5rem)]">{t.hero.lastName}</span>
        <span className="mt-3 flex items-center gap-4 text-[clamp(1.5rem,4.5vw,3.5rem)] tracking-[0.04em] normal-case">
          {t.hero.firstName}
          <span aria-hidden="true" className="h-1 w-[clamp(3rem,10vw,9rem)] bg-ink" />
        </span>
      </h1>

      <p className="mt-8 flex items-center gap-3 text-sm font-semibold tracking-[0.18em] uppercase sm:text-base sm:tracking-[0.3em]">
        <span aria-hidden="true" className="size-2 rotate-45 bg-ink" />
        {t.hero.role}
      </p>

      <p className="mt-10 max-w-full text-sm leading-snug sm:text-base">{t.hero.status}</p>

      <div className="mt-5 flex flex-wrap gap-4">
        <Button onClick={onContact}>{t.hero.contactCta}</Button>
        <Button tone="glass" href={t.contact.cv.href} download>
          {t.hero.cvCta}
        </Button>
      </div>

      {/* "Scroll" hint: desktop only, phones change scenes with the dots. */}
      <button
        type="button"
        onClick={onNext}
        className="group mt-14 hidden w-fit sm:flex items-center gap-3 text-xs font-semibold tracking-[0.3em] text-ink/60 uppercase transition-colors hover:text-ink"
      >
        {t.ui.scrollHint}
        <span
          aria-hidden="true"
          className="block size-2.5 -translate-y-1 rotate-45 border-r-[1.5px] border-b-[1.5px] border-current transition-transform duration-500 ease-crystal group-hover:translate-y-0"
        />
      </button>
    </div>
  );
}
