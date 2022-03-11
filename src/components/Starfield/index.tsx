import React, { useState } from "react";

import StarfieldScene from "./scene";
import "./style.scss";

const useStarfieldScene = (containerRef: any) => {
  const [scene] = React.useState(new StarfieldScene({}));
  React.useEffect(() => {
    containerRef?.current?.appendChild(scene.domElement);
  }, [containerRef]);

  React.useEffect(() => {
    scene.start();
  }, []);
};

const StarField = () => {
  const containerRef = React.useRef<undefined>();

  useStarfieldScene(containerRef);

  return (
    <div className="starfield">
      <div ref={containerRef} />
    </div>
  );
};

export default StarField;
