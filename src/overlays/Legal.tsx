import { Label, Panel } from "../components/ui";
import { useLang } from "../i18n/context";
import Overlay from "./Overlay";

export default function Legal({ onClose }: { onClose: () => void }) {
  const { t } = useLang();

  return (
    <Overlay title={t.legal.heading} onClose={onClose}>
      <Panel>
        <div className="space-y-8">
          {t.legal.sections.map((section) => (
            <section key={section.title}>
              <Label>{section.title}</Label>
              <div className="space-y-2 leading-relaxed">
                {section.lines.map((line) => (
                  <p key={line}>{line}</p>
                ))}
              </div>
            </section>
          ))}
        </div>
      </Panel>
    </Overlay>
  );
}
