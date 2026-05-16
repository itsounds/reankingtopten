"use client";

import { useEffect } from "react";

function applyIframeViewport() {
  const width = document.documentElement.clientWidth;

  if (!width) {
    return;
  }

  let meta = document.querySelector<HTMLMetaElement>('meta[name="viewport"]');

  if (!meta) {
    meta = document.createElement("meta");
    meta.name = "viewport";
    document.head.appendChild(meta);
  }

  meta.content = `width=${width}, initial-scale=1, maximum-scale=1, user-scalable=no`;
}

export function IframeViewportFix() {
  useEffect(() => {
    applyIframeViewport();

    const resizeObserver = new ResizeObserver(() => {
      applyIframeViewport();
    });

    resizeObserver.observe(document.documentElement);
    window.addEventListener("orientationchange", applyIframeViewport);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener("orientationchange", applyIframeViewport);
    };
  }, []);

  return null;
}
