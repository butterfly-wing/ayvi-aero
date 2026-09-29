import { Label, Panel, Tag } from "../components/ui";
import type { ProjectId } from "../content/types";
import { useLang } from "../i18n/context";
import Overlay from "./Overlay";

export default function ProjectDetail({ id, onClose }: { id: ProjectId; onClose: () => void }) {
  const { t } = useLang();
  const p = t.projects.items.find((item) => item.id === id);
  if (!p) return null;

  return (
    <Overlay title={p.title} onClose={onClose}>
      <p className="-mt-4 mb-8 text-xs font-semibold tracking-[0.2em] text-ink/55 uppercase">{p.date}</p>

      <Panel className="mb-8" bodyClassName="p-3 sm:p-4">
        <img src={p.image.src} alt={p.image.alt} className="facet max-h-[60vh] w-full object-cover object-top [--cut:26px]" />
      </Panel>

      <div className="grid gap-6 md:grid-cols-2 lg:gap-8">
        <Panel>
          <Label>{t.projects.detailAbout}</Label>
          <div className="space-y-4 leading-relaxed">
            {p.about.map((para) => (
              <p key={para}>{para}</p>
            ))}
          </div>
        </Panel>
        <Panel>
          <Label>{t.projects.detailRole}</Label>
          <div className="space-y-4 leading-relaxed">
            {p.role.map((para) => (
              <p key={para}>{para}</p>
            ))}
          </div>
        </Panel>
      </div>

      <Panel className="mt-6 lg:mt-8">
        <Label>{t.projects.detailStack}</Label>
        <ul className="flex flex-wrap gap-2">
          {p.stack.map((s) => (
            <Tag key={s}>{s}</Tag>
          ))}
        </ul>
      </Panel>
    </Overlay>
  );
}
