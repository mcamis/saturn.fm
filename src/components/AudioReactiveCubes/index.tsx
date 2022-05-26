import { styled } from "@linaria/react";
import * as React from "react";
import AudioReactiveCubesScene from "./scene";

const useCubesScene = (containerRef: any) => {
  const [scene, setScene] = React.useState(null);
  React.useEffect(() => {
    scene && containerRef?.current?.appendChild(scene.domElement);
    // only run when scene changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scene]);

  React.useEffect(() => {
    setScene(new AudioReactiveCubesScene());
  }, []);
};

const AudioReactiveCubes = () => {
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
