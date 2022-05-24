import React from "react";
import { cx } from "@linaria/core";
import { styled } from "@linaria/react";
import { AnimationNames } from "../components/SharedKeyframeAnimations";

const DashboardBackground = ({
  showExitAnimation,
}: {
  showExitAnimation: boolean;
}) => (
  <>
    <DashboardHalf
      className={cx(
        showExitAnimation && AnimationNames.exitTranslateDown
      )}
    />
  </>
);
const DashboardHalf = styled.div<{ isRight?: boolean }>`
  content: "";
  background: url("../images/dashboard.png") no-repeat;
  background-size: 100% 47%;
  background-position: 0 100%;
  position: absolute;
  bottom: 0;
  width: 50%;
  z-index: -1;
  padding-bottom: 91%;
  left: 0;
  :after {
    content: "";
    background: url("../images/dashboard.png") no-repeat;
    background-size: 100% 47%;
    background-position: 0 100%;
    position: absolute;
    bottom: 0;
    width: 50%;
    z-index: 20;
    padding-bottom: 91%;
    width: 100%;
    right: -100%;
    top: 0;
    transform: scale(-1.001, 1);
    width: 100%;
  }
`;

export default DashboardBackground;
