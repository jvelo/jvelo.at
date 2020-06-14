import styled from "@emotion/styled";
import React from "react";
import Link from "next/link";
import {Image} from 'rebass';
import theme from "../../styles/theme";

const HeaderComponent = styled.header`
  padding: 25px 25px 50px 25px;
  height: 50px;
  margin-top: 15px;
  
  ${theme.mediaQueries.small} {
    padding: 50px;
  }
  
  & a:hover {
    background: none;
  }
`;

export const Header: React.FC = () => <HeaderComponent id={'top'}>
    <Link href={"#navigation"}>
        <a><Image src={'/logo.png'} height={50}/></a>
    </Link>
</HeaderComponent>