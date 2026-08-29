import { easingPreset } from "@openmotion/shared";
import { draft, kf, type TemplateDef } from "./helper.js";

// Crystal cascade: faceted shard fragments drift down and click into place
// from staggered offsets, each catching a little "light" as it settles —
// an entrance built for logo marks or hero panels that want a faceted,
// glassy reveal rather than a soft fade.
export const crystalCascadeTemplate: TemplateDef = {
  id: "tpl-crystal-cascade",
  name: "Crystal Cascade",
  category: "entrance",
  description:
    "Faceted shard fragments drift down from staggered heights and click into place, each catching a brief glint of light as it settles. A crisp, glassy entrance.",
  tags: ["entrance", "crystal", "cascade", "shard", "glass", "facet", "stagger"],
  build: () => [
    draft("Shard Core", {
      durationMs: 900,
      delayMs: 0,
      easing: easingPreset("ease-out-cubic"),
      iterationCount: 1,
      keyframes: [
        kf(0, { opacity: 0, translateY: -60, scale: 0.6, rotate: -8 }),
        kf(0.6, { opacity: 1, translateY: 4, scale: 1.04, rotate: 2 }),
        kf(1, { opacity: 1, translateY: 0, scale: 1, rotate: 0 }),
      ],
      style: {
        _content: "",
        _tag: "div",
        width: "120px",
        height: "120px",
        clipPath: "polygon(50% 0%, 100% 38%, 82% 100%, 18% 100%, 0% 38%)",
        background: "linear-gradient(160deg, #E0F2FE 0%, #7DD3FC 45%, #0EA5E9 100%)",
        boxShadow: "0 12px 28px rgba(14,165,233,0.45)",
      },
    }),
    draft("Shard Left", {
      durationMs: 800,
      delayMs: 100,
      easing: easingPreset("ease-out-cubic"),
      iterationCount: 1,
      keyframes: [
        kf(0, { opacity: 0, translateY: -90, translateX: -30, scale: 0.5, rotate: -20 }),
        kf(0.65, { opacity: 0.9, translateY: 3, translateX: -2, scale: 1.02, rotate: -3 }),
        kf(1, { opacity: 0.9, translateY: 0, translateX: 0, scale: 1, rotate: 0 }),
      ],
      style: {
        _content: "",
        _tag: "div",
        width: "56px",
        height: "56px",
        position: "absolute",
        top: "36px",
        left: "-40px",
        clipPath: "polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)",
        background: "linear-gradient(160deg, rgba(224,242,254,0.9) 0%, rgba(56,189,248,0.9) 100%)",
        boxShadow: "0 8px 18px rgba(14,165,233,0.35)",
      },
    }),
    draft("Shard Right", {
      durationMs: 800,
      delayMs: 180,
      easing: easingPreset("ease-out-cubic"),
      iterationCount: 1,
      keyframes: [
        kf(0, { opacity: 0, translateY: -80, translateX: 30, scale: 0.5, rotate: 20 }),
        kf(0.65, { opacity: 0.9, translateY: 3, translateX: 2, scale: 1.02, rotate: 3 }),
        kf(1, { opacity: 0.9, translateY: 0, translateX: 0, scale: 1, rotate: 0 }),
      ],
      style: {
        _content: "",
        _tag: "div",
        width: "48px",
        height: "48px",
        position: "absolute",
        top: "44px",
        left: "112px",
        clipPath: "polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)",
        background: "linear-gradient(160deg, rgba(224,242,254,0.85) 0%, rgba(14,165,233,0.85) 100%)",
        boxShadow: "0 8px 18px rgba(14,165,233,0.3)",
      },
    }),
    draft("Light Glint", {
      durationMs: 500,
      delayMs: 620,
      easing: easingPreset("ease-out"),
      iterationCount: 1,
      keyframes: [
        kf(0, { opacity: 0, scale: 0.4 }),
        kf(0.5, { opacity: 0.9, scale: 1.3 }),
        kf(1, { opacity: 0, scale: 1.8 }),
      ],
      style: {
        _content: "",
        _tag: "div",
        width: "36px",
        height: "36px",
        position: "absolute",
        top: "42px",
        left: "42px",
        borderRadius: "50%",
        background: "radial-gradient(circle, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0) 70%)",
        pointerEvents: "none",
      },
    }),
  ],
};
