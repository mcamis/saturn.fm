import React from "react";
import ReactDOM from "react-dom";
import App from "containers/App";
import { Provider } from "react-redux";
import configureStore from "store/configure";
import "styles/index.scss";

import dashboard from "images/dashboard.png";
import header from "images/header.png";
import globeSprite from "images/globeSprite.png";
import discSrc from "images/disc.png";
import moreSrc from "images/more.png";
import hideSrc from "images/hide.png";
import rwdSrc from "images/rwd.png";
import playSrc from "images/play-pause.png";
import ffwdSrc from "images/ffwd.png";
import stopSrc from "images/stop.png";
import repeatSrc from "images/repeat.png";
import textureSrc from "images/texture.gif";
import pinkSrc from "images/pink.gif";
import orbShadow from "images/orb-shadow.png";
import * as Sentry from "@sentry/browser";

if (process.env.NODE_ENV === "production") {
  Sentry.init({
    dsn: "https://992c24dba9924e9a9431f74d2b9515a6@sentry.io/1830195",
  });
}

// Export the store so it can be used outside of react-redux
export const store = configureStore(); // eslint-disable-line import/prefer-default-export

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

function preloadImages() {
  const imageSrcs = [
    dashboard,
    header,
    globeSprite,
    discSrc,
    moreSrc,
    hideSrc,
    rwdSrc,
    playSrc,
    ffwdSrc,
    stopSrc,
    repeatSrc,
    textureSrc,
    pinkSrc,
    orbShadow,
  ];

  imageSrcs.forEach((srcUrl) => {
    const img = new Image();
    img.src = srcUrl;
  });
}

// Mobile Safari doesn't provide a correct `window.innerHeight` on initial render
setTimeout(() => {
  setManualViewportHeight();
  preloadImages();

  ReactDOM.render(
    <Provider store={store}>
      <App />
    </Provider>,
    document.getElementById("root")
  );
}, 100);
