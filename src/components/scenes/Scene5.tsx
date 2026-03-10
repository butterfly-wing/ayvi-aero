"use client";

import type { RefObject } from "react";
import s5 from "@/styles/scene5.module.css";
import glass from "@/styles/glass.module.css";

type Props = {
  scrollRef: RefObject<HTMLDivElement | null>;
  onBack: () => void;
};

export default function Scene5({ scrollRef, onBack }: Props) {
  return (
    <div className={s5.root}>
      <div className={s5.column}>
        {/* Header */}
        <div className={s5.headerZone}>
          <div className={s5.title}>MENTIONS LÉGALES</div>
          <div className={s5.headerLine} />
        </div>

        {/* Scrollable content */}
        <div ref={scrollRef} className={s5.scrollArea}>
          <div className={s5.wrap}>
            {/* Back */}
            <button type="button" onClick={onBack} className={s5.backBtn}>
              ← Retour
            </button>

            <section className={glass.legalSection}>
              <h3 className={glass.legalTitle}>Éditeur du site</h3>
              <p>
                <strong>Nom :</strong> Viacheslav Zhenikhov
              </p>
              <p>
                <strong>Statut :</strong> Développeur full-stack
              </p>
              <p>
                <strong>Email :</strong> ayviaero@example.com
              </p>
            </section>

            <section className={glass.legalSection}>
              <h3 className={glass.legalTitle}>Hébergement</h3>
              <p>
                Le site est hébergé par un prestataire tiers. Les informations
                exactes d’hébergement peuvent être communiquées sur demande.
              </p>
            </section>

            <section className={glass.legalSection}>
              <h3 className={glass.legalTitle}>Propriété intellectuelle</h3>
              <p>
                L’ensemble des contenus présents sur ce site (textes, code,
                visuels, animations, architecture logicielle et éléments
                graphiques) est protégé par le droit d’auteur.
              </p>
              <p>
                Toute reproduction, représentation ou diffusion, totale ou
                partielle, sans autorisation préalable est interdite.
              </p>
            </section>

            <section className={glass.legalSection}>
              <h3 className={glass.legalTitle}>Responsabilité</h3>
              <p>
                Les informations fournies sur ce site sont données à titre
                indicatif. Malgré le soin apporté à leur exactitude, l’éditeur
                ne saurait être tenu responsable des erreurs ou omissions.
              </p>
            </section>

            <section className={glass.legalSection}>
              <h3 className={glass.legalTitle}>Données personnelles</h3>
              <p>
                Aucune donnée personnelle n’est collectée à l’insu de
                l’utilisateur.
              </p>
              <p>
                Les données éventuellement transmises via les moyens de contact
                sont utilisées uniquement dans le cadre d’un échange
                professionnel et ne sont jamais cédées à des tiers.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
