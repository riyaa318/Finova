import { useEffect } from "react";
import { gsap, useGSAP } from "./gsap";
import { DURATION, EASE } from "./tokens";
import { prefersReducedMotion } from "./reducedMotion";

const isMouse = (event) => !event.pointerType || event.pointerType === "mouse";

export function useEntrance(ref, { delay = 0, y = 16, duration = 0.55 } = {}) {
  useGSAP(
    () => {
      if (!ref.current || prefersReducedMotion()) return;
      gsap.from(ref.current, {
        opacity: 0,
        y,
        duration,
        delay,
        ease: EASE.out,
        clearProps: "opacity,transform",
      });
    },
    { scope: ref },
  );
}

export function useReveal(ref, { y = 24, delay = 0, start = "top 92%" } = {}) {
  useGSAP(
    () => {
      if (!ref.current || prefersReducedMotion()) return;
      gsap.from(ref.current, {
        opacity: 0,
        y,
        duration: 0.6,
        delay,
        ease: EASE.out,
        clearProps: "opacity,transform",
        scrollTrigger: { trigger: ref.current, start, once: true },
      });
    },
    { scope: ref },
  );
}

export function useHoverLift(ref, { y = -3 } = {}) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    const to = (target) =>
      gsap.to(el, {
        y: target,
        duration: DURATION.base - 0.1,
        ease: EASE.out,
        overwrite: "auto",
      });
    const enter = (e) => isMouse(e) && !prefersReducedMotion() && to(y);
    const leave = () => to(0);
    el.addEventListener("pointerenter", enter);
    el.addEventListener("pointerleave", leave);
    return () => {
      el.removeEventListener("pointerenter", enter);
      el.removeEventListener("pointerleave", leave);
      gsap.killTweensOf(el);
    };
  }, [ref, y]);
}

export function useIconNudge(hostRef, iconRef, { x = 3 } = {}) {
  useEffect(() => {
    const host = hostRef.current;
    const icon = iconRef.current;
    if (!host || !icon) return undefined;
    const move = (target) =>
      gsap.to(icon, {
        x: target,
        duration: DURATION.fast,
        ease: EASE.out,
        overwrite: "auto",
      });
    const enter = (e) => isMouse(e) && !prefersReducedMotion() && move(x);
    const leave = () => move(0);
    host.addEventListener("pointerenter", enter);
    host.addEventListener("pointerleave", leave);
    return () => {
      host.removeEventListener("pointerenter", enter);
      host.removeEventListener("pointerleave", leave);
      gsap.killTweensOf(icon);
    };
  }, [hostRef, iconRef, x]);
}

export function useButtonMotion(ref, { iconRef, sheenRef } = {}) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    const icon = iconRef?.current;
    const sheen = sheenRef?.current;
    const active = (e) =>
      !el.disabled &&
      el.getAttribute("aria-disabled") !== "true" &&
      !prefersReducedMotion() &&
      (e ? isMouse(e) : true);

    const enter = (e) => {
      if (!active(e)) return;
      gsap.to(el, {
        scale: 1.02,
        duration: DURATION.fast,
        ease: EASE.soft,
        overwrite: "auto",
      });
      if (icon)
        gsap.to(icon, {
          x: 2,
          duration: DURATION.fast,
          ease: EASE.out,
          overwrite: "auto",
        });
      if (sheen)
        gsap.fromTo(
          sheen,
          { xPercent: -130, opacity: 1 },
          {
            xPercent: 130,
            opacity: 1,
            duration: 0.8,
            ease: EASE.inOut,
            overwrite: "auto",
            onComplete: () => gsap.set(sheen, { opacity: 0 }),
          },
        );
    };
    const leave = () => {
      gsap.to(el, {
        scale: 1,
        duration: DURATION.fast,
        ease: EASE.soft,
        overwrite: "auto",
      });
      if (icon)
        gsap.to(icon, {
          x: 0,
          duration: DURATION.fast,
          ease: EASE.out,
          overwrite: "auto",
        });
    };
    const down = () =>
      active() &&
      gsap.to(el, {
        scale: 0.97,
        duration: DURATION.instant,
        ease: EASE.soft,
        overwrite: "auto",
      });
    const up = () =>
      active() &&
      gsap.to(el, {
        scale: el.matches(":hover") ? 1.02 : 1,
        duration: DURATION.fast,
        ease: EASE.pop,
        overwrite: "auto",
      });

    el.addEventListener("pointerenter", enter);
    el.addEventListener("pointerleave", leave);
    el.addEventListener("pointerdown", down);
    el.addEventListener("pointerup", up);
    el.addEventListener("pointercancel", leave);
    return () => {
      el.removeEventListener("pointerenter", enter);
      el.removeEventListener("pointerleave", leave);
      el.removeEventListener("pointerdown", down);
      el.removeEventListener("pointerup", up);
      el.removeEventListener("pointercancel", leave);
      gsap.killTweensOf([el, icon, sheen].filter(Boolean));
    };
  }, [ref, iconRef, sheenRef]);
}
