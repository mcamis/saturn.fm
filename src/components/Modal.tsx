import * as React from "react";
import { styled } from "@linaria/react";

import modalBackgroundSrc from "../images/menubg.png";
import { ModalHeader } from "./ModalHeader";

type ModalProps = {
  className?: string;
  header: string;
  children: React.ReactNode;
};

export function Modal(props: ModalProps) {
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
}

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
    background: url(${modalBackgroundSrc}) repeat-y;
    background-position: center top;
    background-size: 100% 880px;
    z-index: -1;

    animation-name: menuBrightness;
    animation-duration: 1s;
    animation-iteration-count: 1;
    animation-fill-mode: forwards;
    animation-timing-function: ease-out;
    animation-delay: 500ms;

    @keyframes menuBrightness {
      from {
        filter: brightness(0);
      }

      to {
        filter: brightness(1);
      }
    }
  }
`;

const ChildrenWrapper = styled.div`
  @keyframes menuContentFadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
  max-width: 1000px;
  margin: 0 auto;
  opacity: 0;
  animation-name: menuContentFadeIn;
  animation-duration: 10ms;
  animation-iteration-count: 1;
  animation-fill-mode: forwards;
  animation-timing-function: ease-out;
  animation-delay: 1.35s;
  display: flex;
  height: 100%;
  flex-direction: column;
  align-items: center;

  > button {
    border-radius: 3px;
    box-shadow: 0 0 0 2px rgba(53, 59, 101, 0.8),
      0 0 0 3.5px rgba(149, 149, 149, 0.8), 0 0 0 5px rgba(53, 59, 101, 0.8);
    display: inline-block;
    margin: 0 auto;
    margin-top: auto;
    color: white;
    font-family: Phoebe;
    font-size: 36px;
    padding: 14px 14px 10px;
    background-color: rgba(93, 21, 122, 0.8);
    border: 0;
    cursor: pointer;
  }
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
