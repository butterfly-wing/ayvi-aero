import { Heading, Panel } from "../components/ui";
import { useLang } from "../i18n/context";

/** "Parcours": education and experience as a vertical timeline. */
export default function Path() {
  const { t } = useLang();

  return (
    <>
      <Heading>{t.path.heading}</Heading>

      <ol className="relative grid gap-5 lg:gap-6">
        {/* Timeline spine: a hairline fading out downward, behind the markers. */}
        <span
          aria-hidden="true"
          className="absolute top-2 bottom-2 left-[5px] hidden w-px bg-linear-to-b from-ink/50 to-ink/0 md:block"
        />
        {t.path.items.map((item) => (
          <li key={item.title} className="md:grid md:grid-cols-[11px_1fr] md:gap-6">
            <span aria-hidden="true" className="mt-8 hidden size-[11px] rotate-45 border border-ink bg-paper md:block" />
            <Panel>
              <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
                <h3 className="text-lg font-bold sm:text-xl">{item.title}</h3>
                <p className="text-xs font-semibold tracking-[0.2em] text-ink/55 uppercase">{item.period}</p>
              </div>
              <p className="mt-1 text-sm text-ink/60">{item.place}</p>
              <p className="mt-4 max-w-4xl leading-relaxed">{item.text}</p>
            </Panel>
          </li>
        ))}
      </ol>
    </>
  );
}
