import type { AppProps } from "next/app";
import { preloadImages } from "../utilities/preloadImages";
import "../styles/index.scss";

if (typeof window !== "undefined") {
  preloadImages();

  function setManualViewportHeight() {
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty("--vh", `${vh}px`);
  }

  window.addEventListener("resize", () => {
    setManualViewportHeight();
  });

  window.addEventListener("orientationchange", () => {
    setManualViewportHeight();
  });

  // Mobile Safari still reports a wrong vh on load
  window.setTimeout(() => {
    setManualViewportHeight();
  }, 0);
}

export default function App({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}
