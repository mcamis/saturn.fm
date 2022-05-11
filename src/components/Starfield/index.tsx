import { styled } from "@linaria/react";
import * as React from "react";
import StarfieldScene from "./scene";

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

  return <Wrapper ref={containerRef} />;
};

const Wrapper = styled.div`
  top: 0;
  width: 100%;
  height: 100%;
  position: absolute;
  z-index: -2;

  &:after {
    content: "";
    background: url("../../images/galaxy.png") no-repeat;
    background-size: cover;
    background-color: black;
    position: absolute;
    left: -35%;
    right: -35%;
    top: -35%;
    bottom: -35%;
    animation-name: spin;
    animation-duration: 500s;
    animation-iteration-count: infinite;
    animation-timing-function: linear;
    z-index: -1;
  }

  @keyframes spin {
    from {
      transform: rotate(-0deg);
    }

    to {
      transform: rotate(-360deg);
    }
  }
`;

export default StarField;
