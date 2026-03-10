"use client";

import s4 from "@/styles/scene4.module.css";
import glass from "@/styles/glass.module.css";

type Props = {
  onOpenLegal: () => void;
};

export default function Scene4({ onOpenLegal }: Props) {
  return (
    <div className={s4.root}>
      <div className={s4.column}>
        {/* Header */}
        <div className={s4.headerZone}>
          <div className={s4.title}>CONTACTS</div>
          <div className={s4.headerLine} />
        </div>

        {/* Content */}
        <div className={s4.contentZone}>
          <div className={s4.contactsWrap}>
            <a className={glass.linkRow} href="mailto:ayviaero@gmail.com">
              <span>Email</span>
              <span className={glass.linkMeta}>
                ayviaero@gmail.com@example.com
              </span>
            </a>

            <a
              className={glass.linkRow}
              href="https://github.com/butterfly-wing"
              target="_blank"
              rel="noreferrer"
            >
              <span>GitHub</span>
              <span className={glass.linkMeta}>github.com/butterfly-wing</span>
            </a>

            <a
              className={glass.linkRow}
              href="https://www.linkedin.com/in/ayvi-aero"
              target="_blank"
              rel="noreferrer"
            >
              <span>LinkedIn</span>
              <span className={glass.linkMeta}>linkedin.com/in/ayvi-aero</span>
            </a>

            <a
              className={glass.linkRow}
              href="/cv/Viacheslav_Zhenikhov_CV.pdf"
              download
            >
              <span>Télécharger mon CV</span>
              <span className={glass.linkMeta}>PDF</span>
            </a>

            <button
              type="button"
              className={`${glass.linkRow} ${glass.linkButton}`}
              onClick={onOpenLegal}
            >
              <span>Mentions légales</span>
              <span className={glass.linkMeta}>informations</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
