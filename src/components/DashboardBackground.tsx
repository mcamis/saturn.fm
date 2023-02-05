import React from "react";
import clsx from "clsx";

import styles from "./DashboardBackground.module.scss";

// className={cx(showExitAnimation && AnimationNames.exitTranslateDown)}
export const DashboardBackground = ({
  isUiHidden,
}: {
  isUiHidden: boolean;
}) => (
  <>
    <div
      className={clsx(styles.wrapper, {
        [styles.exitAnimation]: isUiHidden,
      })}
    />
  </>
);
