import styled from "@emotion/styled";
import React from "react";
import Link from "next/link";
import {Image} from 'rebass';

const HeaderComponent = styled.header`
  padding: 50px;
  height: 50px;
  margin-top: 15px;
  
  & a:hover {
    background: none;
  }
`;

export const Header: React.FC = () => <HeaderComponent id={'top'}>
    <Link href={"#navigation"}>
        <a><Image src={'/logo.png'} height={50}/></a>
    </Link>
</HeaderComponent>