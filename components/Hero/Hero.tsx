import styled from "styled-components";
import React from "react";

const Heading = styled.h1`
  word-spacing: 100vw;
  text-transform: capitalize;
  font-size: 60px;
  line-height: 80px;
  font-weight: bold;
`;

export const Hero: React.FC = ({ children }) => <Heading>{children}</Heading>;

export default Hero;
