import React from "react";
import ReactDOM from "react-dom";
import App from "./containers/App";
import "./styles/index.scss";
import { preloadImages } from "./utilities/preloadImages";

preloadImages();

// if (process.env.NODE_ENV === "production") {
//   Sentry.init({
//     dsn: "https://992c24dba9924e9a9431f74d2b9515a6@sentry.io/1830195",
//   });
// }

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
