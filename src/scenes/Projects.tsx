import { Button, Heading, Panel, Tag } from "../components/ui";
import type { ProjectId } from "../content/types";
import { useLang } from "../i18n/context";

export default function Projects({ onOpen }: { onOpen: (id: ProjectId) => void }) {
  const { t } = useLang();

  return (
    <>
      <Heading>{t.projects.heading}</Heading>

      <ol className="grid gap-5 md:grid-cols-2 xl:grid-cols-3 xl:gap-8">
        {t.projects.items.map((p) => (
          <li key={p.id}>
            <Panel className="h-full" bodyClassName="flex h-full flex-col p-3 sm:p-4">
              <img
                src={p.image.src}
                alt={p.image.alt}
                loading="lazy"
                className="facet aspect-16/9 w-full object-cover object-top [--cut:26px]"
              />
              <div className="flex flex-1 flex-col px-2 pt-5 pb-2 sm:px-3">
                <p className="text-xs font-semibold tracking-[0.2em] text-ink/55 uppercase">{p.date}</p>
                <h3 className="mt-2 text-lg leading-snug font-bold">{p.title}</h3>
                <p className="mt-3 line-clamp-4 text-sm leading-relaxed text-ink/75">{p.summary}</p>
                <ul className="mt-4 flex flex-wrap gap-2">
                  {p.tags.map((tag) => (
                    <Tag key={tag}>{tag}</Tag>
                  ))}
                </ul>
                <Button className="mt-6 self-start" onClick={() => onOpen(p.id)}>
                  {t.ui.open}
                </Button>
              </div>
            </Panel>
          </li>
        ))}
      </ol>
    </>
  );
}
