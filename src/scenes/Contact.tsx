import { Button, CrystalList, Heading, Label, Panel } from "../components/ui";
import { useLang } from "../i18n/context";

export default function Contact({ onOpenLegal }: { onOpenLegal: () => void }) {
  const { t } = useLang();
  const c = t.contact;

  return (
    <div className="w-full max-w-3xl">
      <Heading>{c.heading}</Heading>

      <Panel className="mb-6 lg:mb-8">
        <Label>{c.availability.title}</Label>
        <CrystalList items={c.availability.lines} />
      </Panel>

      <Panel>
        <ul className="divide-y divide-ink/10">
          {c.links.map((link) => (
            <li key={link.label}>
              <a
                href={link.href}
                target={link.href.startsWith("http") ? "_blank" : undefined}
                rel="noreferrer"
                className="group flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 py-4"
              >
                <span className="text-xs font-semibold tracking-[0.24em] text-ink/55 uppercase">{link.label}</span>
                <span className="flex items-center gap-3 font-semibold break-all">
                  {link.value}
                  <span
                    aria-hidden="true"
                    className="size-2 shrink-0 rotate-45 border-t-2 border-r-2 border-current transition-transform group-hover:translate-x-1"
                  />
                </span>
              </a>
            </li>
          ))}
        </ul>

        <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-center">
          <Button href={c.cv.href} download>
            {c.cv.label}
            <span className="text-paper/50 max-[380px]:hidden">PDF</span>
          </Button>
          <Button tone="glass" onClick={onOpenLegal}>
            {c.legalLink}
          </Button>
        </div>
      </Panel>
    </div>
  );
}
