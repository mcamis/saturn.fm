import * as React from "react";
import StarfieldScene from "./scene";
import "./style.scss";

const useStarfieldScene = (containerRef: any, shouldShowSpaceship: boolean) => {
  const [scene, setScene] = React.useState(null);
  React.useEffect(() => {
    scene && containerRef?.current?.appendChild(scene.domElement);
  }, [scene]);

  React.useEffect(() => {
    setScene(new StarfieldScene());
  }, []);

  React.useEffect(() => {
    scene?.toggleSpaceShipVisbility(shouldShowSpaceship);
  }, [shouldShowSpaceship]);
};

const StarField = ({ isUiHidden }: { isUiHidden: boolean }) => {
  const containerRef = React.useRef<undefined>();

  useStarfieldScene(containerRef, isUiHidden);

  return (
    <div className="starfield">
      <div ref={containerRef} />
    </div>
  );
};

export default StarField;
