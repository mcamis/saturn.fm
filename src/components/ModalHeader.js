import * as React from "react";
import styled from "styled-components";

import headerBgSrc from "../images/header_bg.png";

export const ModalHeader = ({ children }) => {
  return <Header>{children}</Header>;
};

const Header = styled.h2`
  line-height: 59px;
  padding: 2px 22px 6px;
  font-size: 42px;
  text-stroke: 0.45px rgba(0, 0, 0, 0.5);

  color: white;
  text-transform: capitalize;

  padding: 4px 1.5em 0;
  margin: 0 auto;
  margin-bottom: 20px;

  background: url(${headerBgSrc});
  background-color: rgba(0, 0, 0, 0.5);
  background-size: 100% 100%;
  border-radius: 10px;

  display: inline-block;
`;
