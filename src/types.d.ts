declare module "*.jpg";
declare module "*.jpeg";
declare module "*.png";
declare module "*.mp3";

declare global {
    interface Window {
      webkitAudioContext: typeof AudioContext
    }
  }
