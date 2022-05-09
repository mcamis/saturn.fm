import React from "react";
import ReactDOM from "react-dom";
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

ReactDOM.render(<App />, document.getElementById("root"));
