import * as React from "react";
import MenuItemScene from "./scene";
import styles from './MenuItems.module.scss'

const useMenuItemsScene = (containerRef: any) => {
  const [scene, setScene] = React.useState(null);
  React.useEffect(() => {
    scene && containerRef?.current?.appendChild(scene.domElement);
  }, [scene]);

  React.useEffect(() => {
    setScene(new MenuItemScene());
  }, []);
};

export const MenuItems = () => {
  const containerRef = React.useRef<undefined>();

  useMenuItemsScene(containerRef);

  return <div ref={containerRef} />;
};
