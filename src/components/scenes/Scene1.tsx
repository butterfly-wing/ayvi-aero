"use client";

export default function Scene1() {
  return (
    <div
      className="pointer-events-none fixed top-1/2 z-30 -translate-y-1/2"
      style={{ left: "clamp(28px, 4.5vw, 72px)" }}
    >
      <div
        className="select-none uppercase tracking-[0.10em] text-black"
        style={{
          fontWeight: 900,
          fontSize: "clamp(34px, 4.4vw, 64px)",
          lineHeight: 1.05,
        }}
      >
        <div>ZHENIKHOV</div>
        <div
          className="mt-2 normal-case tracking-[0.06em]"
          style={{
            display: "inline-block",
            paddingBottom: "0.38em",
            backgroundImage: "linear-gradient(#000, #000)",
            backgroundRepeat: "no-repeat",
            backgroundSize: "100% 4px",
            backgroundPosition: "0 100%",
          }}
        >
          Viacheslav
        </div>
      </div>
    </div>
  );
}
