import * as React from "react";
import styled, { css, keyframes } from "styled-components";

import modalBackgroundSrc from "../images/menubg.png";
import { ModalHeader } from "./ModalHeader";

export const Modal = (props) => {
  return (
    <FullscreenOverlay>
      <ContainerWithAnimatedBackground className={props.className}>
        <ChildrenWrapper>
          <ModalHeader>{props.header}</ModalHeader>
          <MainContent>{props.children}</MainContent>
        </ChildrenWrapper>
      </ContainerWithAnimatedBackground>
    </FullscreenOverlay>
  );
};

const menuBrightness = keyframes`
  from {
    filter: brightness(0);
  }

  to {
    filter: brightness(1);
  }
`;

const fadeInFilter = css`
  animation-name: ${menuBrightness};
  animation-duration: 1s;
  animation-iteration-count: 1;
  animation-fill-mode: forwards;
  animation-timing-function: ease-out;
  animation-delay: 500ms;
`;

const pixelated = css`
  image-rendering: optimizeSpeed; /* Older versions of FF */
  image-rendering: -moz-crisp-edges; /* FF 6.0+  */
  image-rendering: -webkit-optimize-contrast; /* Safari */
  image-rendering: -o-crisp-edges; /* OS X & Windows Opera (12.02+) */
  image-rendering: pixelated; /* Awesome future-browsers */
`;

const menuContentFadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const FullscreenOverlay = styled.div`
  background: black;
  position: fixed;
  top: 0;
  bottom: 0;
  right: 0;
  left: 0;
  z-index: 100;
`;

const ContainerWithAnimatedBackground = styled.div`
  padding: 2em;
  height: 100%;
  cursor: default;
  font-size: 14px;

  &:before {
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    top: 0;
    content: " ";
    display: block;
    filter: brightness(0);
    ${fadeInFilter}
    ${pixelated};
    background: url(${modalBackgroundSrc}) repeat-y;
    background-position: center top;
    background-size: 100% 880px;
    z-index: -1;
  }
`;

const ChildrenWrapper = styled.div`
  max-width: 1000px;
  margin: 0 auto;
  opacity: 0;
  animation-name: ${menuContentFadeIn};
  animation-duration: 10ms;
  animation-iteration-count: 1;
  animation-fill-mode: forwards;
  animation-timing-function: ease-out;
  animation-delay: 1.35s;
  display: flex;
  height: 100%;
  flex-direction: column;
  align-items: center;
`;

const MainContent = styled.div`
  width: 100%;
  font-size: 13px;
  color: white;
  min-height: 200px;
  height: 100%;
  overflow-y: scroll;
  display: flex;
  flex-direction: column;
  align-items: center;

  @media screen and (min-width: 500px) {
    padding: 4px;
  }
`;
