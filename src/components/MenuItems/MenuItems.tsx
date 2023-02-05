import * as React from "react";
import MenuItemScene from "./scene";
import styles from "./MenuItems.module.scss";

const useMenuItemsScene = (
  containerRef: any,
  setActiveButton: any,
  activeButton: string
) => {
  const [scene, setScene] = React.useState(null);
  React.useEffect(() => {
    scene && containerRef?.current?.appendChild(scene.domElement);
  }, [scene]);

  React.useEffect(() => {
    scene && scene.updateCurrentButton(activeButton);
  }, [activeButton]);

  React.useEffect(() => {
    setScene(new MenuItemScene(setActiveButton));
  }, []);
};

export const MenuItems = ({
  setActiveButton,
  activeButton,
  handleClick,
}: {
  setActiveButton: (_: string) => void;
  activeButton: string;
  handleClick: (_: string) => void;
}) => {
  const containerRef = React.useRef<undefined>();

  useMenuItemsScene(containerRef, setActiveButton, activeButton);

  return (
    <div
      ref={containerRef}
      onClick={() => {
        handleClick(activeButton);
      }}
    />
  );
};
