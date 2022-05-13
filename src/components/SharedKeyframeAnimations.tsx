import * as React from "react";
import { styled } from "@linaria/react";
import { css } from "@linaria/core";

// TODO: Linaria is breaking on enums
export const AnimationNames = {
  appStartFloatInRelative: "appStartFloatInRelative",
  exitTranslateDown: "exitTranslateDown",
};
/*



.hidden {
  .dashboard,
  .cubes canvas,
  li {
    animation-name: floatDownRelative;
    animation-duration: 2000ms;
    animation-iteration-count: 1;
    animation-fill-mode: forwards; // animation-delay: 10s;
    animation-timing-function: linear;
  }
}


@keyframes floatDownRelative {
  from {
    transform: translateY(0%);
  }

  to {
    transform: translateY(100%);
  }
}

*/

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

  .${AnimationNames.exitTranslateDown} {
    animation-name: ${AnimationNames.exitTranslateDown};
    animation-duration: 2000ms;
    animation-iteration-count: 1;
    animation-fill-mode: forwards;
    animation-timing-function: linear;
  }

  @keyframes ${AnimationNames.exitTranslateDown} {
    from {
      transform: translateY(0%);
    }

    to {
      transform: translateY(100%);
    }
  }
`;
