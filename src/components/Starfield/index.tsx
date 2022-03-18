import React from "react";
import StarfieldScene from "./scene";
import "./style.scss";

const useStarfieldScene = (containerRef: any) => {
  const [scene, setScene] = React.useState(null);
  React.useEffect(() => {
    scene && containerRef?.current?.appendChild(scene.domElement);
  }, [scene]);

  React.useEffect(() => {
    setScene( new StarfieldScene());
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
