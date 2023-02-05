import React from "react";

import styles from "./DashboardBackground.module.scss";
import { AnimationNames } from "../components/SharedKeyframeAnimations";

// className={cx(showExitAnimation && AnimationNames.exitTranslateDown)}
export const DashboardBackground = ({
  showExitAnimation,
}: {
  showExitAnimation: boolean;
}) => (
  <>
    <div className={styles.wrapper} />
  </>
);
