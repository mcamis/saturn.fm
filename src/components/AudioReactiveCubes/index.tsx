import { styled } from "@linaria/react";
import * as React from "react";
import AudioReactiveCubesScene from "./scene";

const useCubesScene = (containerRef: any) => {
  const [scene, setScene] = React.useState(null);
  React.useEffect(() => {
    scene && containerRef?.current?.appendChild(scene.domElement);
  }, [scene]);

  React.useEffect(() => {
    setScene(new AudioReactiveCubesScene());
  }, []);


};

const AudioReactiveCubes = ({ isUiHidden, }: { isUiHidden: boolean }) => {
  const containerRef = React.useRef<undefined>();

  useCubesScene(containerRef);

  return <Wrapper ref={containerRef} />;
};

const Wrapper = styled.div`
  position: absolute;
  bottom: 0;
  pointer-events: none;
`;

export default AudioReactiveCubes;
