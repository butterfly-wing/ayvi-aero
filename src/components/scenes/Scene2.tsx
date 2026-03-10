"use client";

import type { RefObject } from "react";
import glass from "@/styles/glass.module.css";
import s2 from "@/styles/scene2.module.css";

type Props = {
  enter: boolean;
  scrollRef: RefObject<HTMLDivElement | null>;
};

export default function Scene2({ enter, scrollRef }: Props) {
  // ----- animation helpers -----
  const cardAnim = (delayMs: number) => ({
    opacity: enter ? 1 : 0,
    transform: enter ? "translateY(0)" : "translateY(14px)",
    transition: "opacity 420ms ease-out, transform 420ms ease-out",
    transitionDelay: `${delayMs}ms`,
  });

  const headerTitleAnim = (baseDelayMs: number) => ({
    opacity: enter ? 1 : 0,
    transform: enter ? "translateY(0)" : "translateY(6px)",
    transition: "opacity 360ms ease-out, transform 360ms ease-out",
    transitionDelay: `${baseDelayMs + 120}ms`,
  });

  const headerLineAnim = (baseDelayMs: number) => ({
    opacity: enter ? 1 : 0,
    transform: enter ? "translateY(0)" : "translateY(6px)",
    transition: "opacity 360ms ease-out, transform 360ms ease-out",
    transitionDelay: `${baseDelayMs + 160}ms`,
  });

  const bodyAnim = (baseDelayMs: number) => ({
    opacity: enter ? 1 : 0,
    transform: enter ? "translateY(0)" : "translateY(10px)",
    transition: "opacity 420ms ease-out, transform 420ms ease-out",
    transitionDelay: `${baseDelayMs + 220}ms`,
  });

  return (
    <div className={s2.root}>
      <div className={s2.column}>
        {/* Header zone */}
        <div className={s2.headerZone}>
          <div
            className={s2.title}
            style={{
              opacity: enter ? 1 : 0,
              transform: enter ? "translateX(0)" : "translateX(-18px)",
              transition:
                "opacity 520ms cubic-bezier(0.16, 1, 0.3, 1), transform 520ms cubic-bezier(0.16, 1, 0.3, 1)",
            }}
          >
            <div>FULL-STACK</div>
            <div className={s2.titleLine2}>DÉVELOPPEUR</div>
          </div>

          <div
            className={s2.headerLine}
            style={{
              opacity: enter ? 1 : 0,
              transform: enter ? "scaleX(1)" : "scaleX(0)",
              transformOrigin: "left",
              transition:
                "opacity 320ms ease-out 120ms, transform 520ms cubic-bezier(0.16, 1, 0.3, 1) 120ms",
            }}
          />
        </div>

        {/* Cards zone */}
        <div ref={scrollRef} className={s2.cardsZone}>
          <div className={s2.grid}>
            {/* LEFT */}
            <div className={s2.colHalf}>
              <section className={glass.card} style={cardAnim(0)}>
                <header className={glass.head}>
                  <h3 className={glass.title} style={headerTitleAnim(0)}>
                    À propos
                  </h3>
                  <div className={glass.underline} style={headerLineAnim(0)} />
                </header>

                <div className={glass.body} style={bodyAnim(0)}>
                  <p className={glass.text}>
                    Je m’appelle{" "}
                    <span className={glass.strong}>Viacheslav</span>.
                  </p>
                  <p className={glass.text}>
                    Je conçois et développe des applications comme du cristal :{" "}
                    <span className={glass.strong}>
                      clairs dans leur logique, solides dans leur architecture
                    </span>
                    , et précis jusque dans les détails visibles comme
                    invisibles.
                  </p>

                  <div className={glass.sep} />

                  <p className={glass.text}>
                    Mon objectif n’est pas seulement de faire fonctionner un
                    produit, mais de construire une structure{" "}
                    <span className={glass.strong}>lisible</span>,{" "}
                    <span className={glass.strong}>maintenable</span> et{" "}
                    <span className={glass.strong}>cohérente</span> — du bas
                    niveau jusqu’à l’interface.
                  </p>
                  <p className={glass.text}>
                    Je privilégie l’architecture, la performance et la maîtrise
                    des couches plutôt qu’un simple empilement d’outils.
                  </p>
                </div>
              </section>
            </div>

            {/* RIGHT */}
            <div className={s2.colHalfRight}>
              <section className={glass.card} style={cardAnim(140)}>
                <header className={glass.head}>
                  <h3 className={glass.title} style={headerTitleAnim(140)}>
                    Stack
                  </h3>
                  <div
                    className={glass.underline}
                    style={headerLineAnim(140)}
                  />
                </header>

                <div className={glass.body} style={bodyAnim(140)}>
                  <div className={glass.label}>Langages & outils</div>

                  <div className={glass.iconRow}>
                    {[
                      { id: "js", src: "/icons/js.jpg", label: "JavaScript" },
                      { id: "ts", src: "/icons/ts.jpg", label: "TypeScript" },
                      { id: "rb", src: "/icons/rb.jpg", label: "Ruby" },
                      { id: "next", src: "/icons/next.png", label: "Next.js" },
                      { id: "tw", src: "/icons/tw.jpg", label: "Tailwind" },
                      { id: "php", src: "/icons/php.png", label: "PHP" },
                    ].map((i) => (
                      <div key={i.id} className={glass.iconBox} title={i.label}>
                        <img
                          src={i.src}
                          alt={i.label}
                          className={glass.iconImg}
                          draggable={false}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </section>

              <section className={glass.card} style={cardAnim(280)}>
                <header className={glass.head}>
                  <h3 className={glass.title} style={headerTitleAnim(280)}>
                    Soft skills
                  </h3>
                  <div
                    className={glass.underline}
                    style={headerLineAnim(280)}
                  />
                </header>

                <div className={glass.body} style={bodyAnim(280)}>
                  <ul className={glass.list}>
                    <li>Pensée systémique et structurée</li>
                    <li>Autonomie et sens des responsabilités</li>
                    <li>Communication claire (tech & non-tech)</li>
                    <li>Rigueur, lisibilité et constance</li>
                    <li>Orientation résultat, sans dette inutile</li>
                  </ul>
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
