import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import App from "./containers/App";
import configureStore from "./store/configure";
import "./styles/index.scss";
import { preloadImages } from "./utilities/preloadImages";

preloadImages();

// if (process.env.NODE_ENV === "production") {
//   Sentry.init({
//     dsn: "https://992c24dba9924e9a9431f74d2b9515a6@sentry.io/1830195",
//   });
// }

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

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById("root")
);
