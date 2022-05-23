import { styled } from "@linaria/react";
import * as React from "react";
import { audioManagerSingleton } from "../audioManager";

export const CreateAudioContextButton = () => {
  return (
    <Wrapper>
      <button type="button" onClick={() => audioManagerSingleton.init()}>
        Click to Start
      </button>
    </Wrapper>
  );
};

const Wrapper = styled.div`
position: fixed;
z-index: 9999;
background: rgba(10, 5, 25, 0.5);
left: 0;
right: 0;
bottom: 0;
top: 0;
display: flex;
text-align: center;
align-items: center;
justify-content: center;
font-size: 18px;

button {
  transition: background-color 250ms ease-in-out;
  transition-property: color, border;
  background: none;
  border: 1px solid rgba(255,255,255,.25);
  color: white;
  padding: 0.5em 1.5em;

  color: white;
  border-radius: 2px;
  background: rgba(0, 0, 0, 0.75);

  box-shadow: 0 3px 20px 0px rgb(255 255 255 / 20%);
  span {
    display: block;
    margin-bottom: 8px;
    padding-bottom: 8px;
    border-bottom: 0.5px solid white;
  }
  &:hover,
  &:active,
  &:focus {
    color: black;
    background: white;
    border: none;
    cursor: pointer;
    outline: none;
  }
  &:active {
    transform: translate(0, 4px);
  }
  `;
