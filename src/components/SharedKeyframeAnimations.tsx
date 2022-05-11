import * as React from "react";
import { styled } from "@linaria/react";
import { css } from "@linaria/core";

// TODO: Linaria is breaking on enums
export const AnimationNames = {
  appStartFloatInRelative: "appStartFloatInRelative",
};

export const Animations = styled.div`
  :global() {
    .${AnimationNames.appStartFloatInRelative} {
      animation-name: ${AnimationNames.appStartFloatInRelative};
      animation-duration: 600ms;
      animation-iteration-count: 1;
      animation-fill-mode: backwards;
      animation-timing-function: linear;
      animation-delay: 0;
    }

    @keyframes ${AnimationNames.appStartFloatInRelative} {
      from {
        transform: translateY(100%);
      }

      to {
        transform: translateY(0%);
      }
    }
  }
`;
