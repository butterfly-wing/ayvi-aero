"use client";

import type { RefObject } from "react";
import sp from "@/styles/sceneProject.module.css";

type ProjectKind = "motus" | "d3";

type Props = {
  kind: ProjectKind;
  scrollRef: RefObject<HTMLDivElement | null>;
  onBack: () => void;
};

export default function SceneProject({ kind, scrollRef, onBack }: Props) {
  const data = getProjectData(kind);

  return (
    <div className={sp.root}>
      <div ref={scrollRef} className={sp.scroller} data-scroller="scene">
        {/* Back */}
        <button type="button" onClick={onBack} className={sp.backBtn}>
          ← Retour
        </button>

        {/* DATE */}
        <div className={sp.date}>{data.date}</div>

        {/* IMAGE */}
        <div className={sp.heroWrap}>
          <div className={sp.hero}>
            <img
              src={data.imageSrc}
              alt={data.imageAlt}
              className={sp.heroImg}
              draggable={false}
            />
          </div>
        </div>

        {/* TEXT BLOCK */}
        <div className={sp.textWrap}>
          <div className={sp.title}>{data.title}</div>

          <div className={sp.underline} />

          <div className={sp.block}>
            <div className={sp.label}>PROJET</div>
            <p className={sp.p}>{data.projectText}</p>
          </div>

          <div className={sp.blockTight}>
            <div className={sp.label}>MES EFFORTS</div>
            <p className={sp.p}>{data.effortText}</p>
          </div>

          <div className={sp.block}>
            <div className={sp.label}>STACK</div>

            <div className={sp.stackRow}>
              <div className={sp.stackImg}>
                <img
                  src={data.stackImg1.src}
                  alt={data.stackImg1.alt}
                  className={sp.stackImgInner}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function getProjectData(kind: ProjectKind) {
  if (kind === "motus") {
    return {
      date: "2025 · Décembre",
      title: "MotusPHP",
      imageSrc: "/projects/motus-hero.png",
      imageAlt: "MotusPHP",
      projectText:
        "Ce projet consiste en la création d’un jeu Motus entièrement développé en PHP.\n" +
        "L’objectif était de reproduire les mécaniques du jeu tout en mettant l’accent sur la logique métier, la gestion des états de jeu et la validation rigoureuse des entrées utilisateur.\n\n" +
        "Le jeu repose sur une structure claire permettant de séparer les règles, le traitement des données et l’affichage, afin de garantir un comportement cohérent et prévisible à chaque partie.",
      effortText:
        "J’ai conçu l’architecture du projet en privilégiant la lisibilité et la maintenabilité du code.\n" +
        "Une attention particulière a été portée à la gestion des cas limites, à la robustesse des règles du jeu et à la clarté des flux logiques.\n\n" +
        "Ce projet m’a permis de travailler sur la structuration d’une application backend simple mais complète, en gardant un contrôle précis sur chaque étape du traitement.",
      stackImg1: { src: "/projects/motus-stack.png", alt: "PHP" },
    };
  }

  return {
    date: "2026 · Janvier",
    title: "Carte Interactive France",
    imageSrc: "/projects/d3map-hero.png",
    imageAlt: "Carte Interactive France",
    projectText:
      "Ce projet porte sur la création d’une carte interactive associée à un graphique dynamique à l’aide de D3.js.\n" +
      "Les données sont représentées visuellement et évoluent en fonction des interactions utilisateur, telles que la sélection ou le survol d’éléments de la carte.\n\n" +
      "L’objectif était de rendre l’information lisible et intuitive, tout en conservant une structure de code claire pour faciliter les évolutions futures.",
    effortText:
      "J’ai travaillé sur la mise en place des interactions entre la carte et le graphique, ainsi que sur la synchronisation des données et des transitions visuelles.\n" +
      "Une attention particulière a été portée à la cohérence des animations, à la gestion des échelles et à la clarté de la visualisation.\n\n" +
      "Ce projet m’a permis d’approfondir la manipulation de données et la conception de visualisations interactives orientées expérience utilisateur.",
    stackImg1: { src: "/projects/d3-stack.png", alt: "D3" },
  };
}
