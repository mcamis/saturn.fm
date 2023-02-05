import * as React from "react";
import MenuItemScene from "./scene";
import styles from "./MenuItems.module.scss";

const useMenuItemsScene = (
  containerRef: any,
  setActiveButton: any,
  activeButton: string,
  shouldHide: boolean
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

  React.useEffect(() => {
    console.log({ shouldHide });
    scene && scene.updateVisibility(shouldHide);
  }, [shouldHide]);
};

export const MenuItems = ({
  setActiveButton,
  activeButton,
  handleClick,
  shouldHide,
}: {
  setActiveButton: any;
  activeButton: string;
  handleClick: (_: string) => void;
  shouldHide: boolean;
}) => {
  const containerRef = React.useRef<undefined>();

  useMenuItemsScene(containerRef, setActiveButton, activeButton, shouldHide);

  return (
    <div
      ref={containerRef}
      onClick={() => {
        handleClick(activeButton);
      }}
    />
  );
};
