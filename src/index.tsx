import React from "react";
import { createRoot } from "react-dom/client";

import App from "./containers/App";
import { preloadImages } from "./utilities/preloadImages";
import "./styles/index.scss";

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

const container = document.getElementById("root");
const root = createRoot(container); // createRoot(container!) if you use TypeScript
root.render(<App />);
