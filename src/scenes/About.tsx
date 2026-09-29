import { CrystalList, Heading, Label, Panel, Tag } from "../components/ui";
import { useLang } from "../i18n/context";

export default function About() {
  const { t } = useLang();
  const a = t.about;

  return (
    <>
      <Heading>{a.heading}</Heading>

      <div className="grid gap-5 lg:grid-cols-[3fr_2fr] lg:gap-8">
        <Panel>
          <p className="mb-6 text-[clamp(1.25rem,2.4vw,1.75rem)] leading-tight font-black tracking-wide uppercase">
            {a.lead}
          </p>
          <div className="space-y-4 text-[15px] leading-relaxed sm:text-base">
            {a.paragraphs.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </div>
        </Panel>

        <div className="grid content-start gap-5 lg:gap-8">
          <Panel>
            <Label>{a.stackHeading}</Label>
            <ul className="flex flex-wrap gap-2">
              {a.stack.map((s) => (
                <Tag key={s}>{s}</Tag>
              ))}
            </ul>
          </Panel>
          <Panel>
            <Label>{a.softHeading}</Label>
            <div className="text-[15px] sm:text-base">
              <CrystalList items={a.soft} />
            </div>
          </Panel>
        </div>
      </div>
    </>
  );
}
