"use client";

import type { RefObject } from "react";
import glass from "@/styles/glass.module.css";
import s3 from "@/styles/scene3.module.css";

type Props = {
  enter: boolean;
  onOpenProject: (targetIndex: number) => void;
  scrollRef: RefObject<HTMLDivElement | null>;
};

export default function Scene3({ enter, onOpenProject, scrollRef }: Props) {
  return (
    <div className={s3.root}>
      <div className={s3.column}>
        {/* Header */}
        <div className={s3.headerZone}>
          <div
            className={s3.title}
            style={{
              opacity: enter ? 1 : 0,
              transform: enter ? "translateX(0)" : "translateX(-18px)",
              transition:
                "opacity 520ms cubic-bezier(0.16, 1, 0.3, 1), transform 520ms cubic-bezier(0.16, 1, 0.3, 1)",
            }}
          >
            MES PROJETS
          </div>

          <div
            className={s3.headerLine}
            style={{
              opacity: enter ? 1 : 0,
              transform: enter ? "scaleX(1)" : "scaleX(0)",
              transformOrigin: "left",
              transition:
                "opacity 320ms ease-out 140ms, transform 520ms cubic-bezier(0.16, 1, 0.3, 1) 140ms",
            }}
          />
        </div>

        {/* Cards zone */}
        <div ref={scrollRef} className={s3.cardsZone}>
          <div className={s3.centerRow}>
            {/* Project 1 */}
            <section
              className={`${glass.card} ${s3.projCard}`}
              role="button"
              tabIndex={0}
              onClick={() => onOpenProject(6)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  onOpenProject(6);
                }
              }}
              style={{
                opacity: enter ? 1 : 0,
                transform: enter ? "translateY(0)" : "translateY(16px)",
                transition: "opacity 520ms ease-out, transform 520ms ease-out",
                transitionDelay: "0ms",
              }}
            >
              <header
                className={s3.projHead}
                style={{
                  opacity: enter ? 1 : 0,
                  transform: enter ? "translateY(0)" : "translateY(10px)",
                  transition:
                    "opacity 420ms ease-out, transform 420ms ease-out",
                  transitionDelay: "140ms",
                }}
              >
                <div className={s3.projDate}>2025 · Decembre</div>
              </header>

              <div className={s3.projBody}>
                <div
                  className={s3.ill}
                  style={{
                    opacity: enter ? 1 : 0,
                    transform: enter ? "translateY(0)" : "translateY(10px)",
                    transition:
                      "opacity 420ms ease-out, transform 420ms ease-out",
                    transitionDelay: "220ms",
                  }}
                >
                  <img
                    src="/projects/motus.png"
                    alt="Jeu Motus en PHP"
                    className={s3.illImg}
                    draggable={false}
                  />
                </div>

                <div
                  className={s3.textBlock}
                  style={{
                    opacity: enter ? 1 : 0,
                    transform: enter ? "translateY(0)" : "translateY(10px)",
                    transition:
                      "opacity 420ms ease-out, transform 420ms ease-out",
                    transitionDelay: "300ms",
                  }}
                >
                  <div className={s3.projTitle}>
                    Jeu Motus — PHP & logique applicative
                  </div>
                  <p className={s3.projDesc}>
                    Développement d’un jeu Motus en PHP, axé sur la logique
                    métier, la gestion des états de jeu et la validation des
                    entrées utilisateur. Le projet met l’accent sur une
                    structure claire du code, la séparation des responsabilités
                    et la robustesse des règles.
                  </p>
                </div>

                <div
                  className={s3.skillRow}
                  style={{
                    opacity: enter ? 1 : 0,
                    transform: enter ? "translateY(0)" : "translateY(10px)",
                    transition:
                      "opacity 420ms ease-out, transform 420ms ease-out",
                    transitionDelay: "380ms",
                  }}
                >
                  <div className={glass.chip}>
                    <div className={glass.chipKey}>PHP</div>
                    <div className={glass.chipVal}>Motus</div>
                  </div>
                  <div className={glass.chip}>
                    <div className={glass.chipKey}>MVC</div>
                    <div className={glass.chipVal}>Structure</div>
                  </div>
                </div>
              </div>
            </section>

            {/* Project 2 */}
            <section
              className={`${glass.card} ${s3.projCard}`}
              role="button"
              tabIndex={0}
              onClick={() => onOpenProject(7)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  onOpenProject(7);
                }
              }}
              style={{
                opacity: enter ? 1 : 0,
                transform: enter ? "translateY(0)" : "translateY(16px)",
                transition: "opacity 520ms ease-out, transform 520ms ease-out",
                transitionDelay: "180ms",
              }}
            >
              <header
                className={s3.projHead}
                style={{
                  opacity: enter ? 1 : 0,
                  transform: enter ? "translateY(0)" : "translateY(10px)",
                  transition:
                    "opacity 420ms ease-out, transform 420ms ease-out",
                  transitionDelay: "320ms",
                }}
              >
                <div className={s3.projDate}>2026 · Janvier</div>
              </header>

              <div className={s3.projBody}>
                <div
                  className={s3.ill}
                  style={{
                    opacity: enter ? 1 : 0,
                    transform: enter ? "translateY(0)" : "translateY(10px)",
                    transition:
                      "opacity 420ms ease-out, transform 420ms ease-out",
                    transitionDelay: "400ms",
                  }}
                >
                  <img
                    src="/projects/map-d3.png"
                    alt="Carte interactive avec D3.js"
                    className={s3.illImg}
                    draggable={false}
                  />
                </div>

                <div
                  className={s3.textBlock}
                  style={{
                    opacity: enter ? 1 : 0,
                    transform: enter ? "translateY(0)" : "translateY(10px)",
                    transition:
                      "opacity 420ms ease-out, transform 420ms ease-out",
                    transitionDelay: "480ms",
                  }}
                >
                  <div className={s3.projTitle}>
                    Carte interactive & visualisation de données
                  </div>
                  <p className={s3.projDesc}>
                    Création d’une carte interactive avec D3.js, combinée à un
                    graphique généré dynamiquement selon les interactions
                    utilisateur. Le projet illustre la manipulation de données,
                    les transitions visuelles et la synchronisation entre carte
                    et visualisation.
                  </p>
                </div>

                <div
                  className={s3.skillRow}
                  style={{
                    opacity: enter ? 1 : 0,
                    transform: enter ? "translateY(0)" : "translateY(10px)",
                    transition:
                      "opacity 420ms ease-out, transform 420ms ease-out",
                    transitionDelay: "560ms",
                  }}
                >
                  <div className={glass.chip}>
                    <div className={glass.chipKey}>D3</div>
                    <div className={glass.chipVal}>Carte</div>
                  </div>
                  <div className={glass.chip}>
                    <div className={glass.chipKey}>SVG</div>
                    <div className={glass.chipVal}>Graphique</div>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
