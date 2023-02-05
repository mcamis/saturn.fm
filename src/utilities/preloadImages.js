import dashboard from "../images/dashboard.png";
import header from "../images/header.png";
import discSrc from "../images/disc.png";
import moreSrc from "../images/more.png";
import hideSrc from "../images/hide.png";
import rwdSrc from "../images/rwd.png";
import playSrc from "../images/play-pause.png";
import ffwdSrc from "../images/ffwd.png";
import stopSrc from "../images/stop.png";
import repeatSrc from "../images/repeat.png";
import textureSrc from "../images/texture.gif";
import pinkSrc from "../images/pink.gif";
import orbShadow from "../images/orb-shadow.png";

export function preloadImages() {
  const imageSrcs = [
    dashboard,
    header,
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
    img.src = srcUrl.src;
  });
}
