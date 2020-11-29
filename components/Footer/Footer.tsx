import Link from "next/link";
import React from "react";
import styled from "styled-components";
import {Box, Image} from 'rebass/styled-components';
import theme from "../../styles/theme";

const Anchor = styled.div`
    background: white;
    position: absolute;
    z-index: 9999;
    height: 15px;
    top: 0;
    width: 100%;
    left: 0;
`

const FooterComponent = styled.footer`
  position: relative;

  padding: 65px 25px 50px 25px;
  ${theme.mediaQueries.small} {
    padding: 65px 50px 50px 50px;
  }

  background: black;  
  height: 100vh;

  color: white;

  & a {
    color: white;    
  }

  & a:hover {
    text-decoration: none;
  }
`

const Menu = styled.ul`
  list-style-type: none;
  padding: 0;
  
  & li a {
    font-size: 60px;
    line-height: 80px;
    font-weight: bold;
    text-decoration: none;
  }
`

export const Footer: React.FC = () => <FooterComponent id={'navigation'}>
    <Anchor />
    <Box>
        <Link href={"#top"}><a><Image src={'/arrowup.svg'} height={50}/></a></Link>
    </Box>
    <Menu>
        <li><Link href={"/"}>Home</Link></li>
        <li><Link href={"/about"}>About</Link></li>
        <li><Link href={"/now"}>Now</Link></li>
        <li><Link href={"/uses"}>Uses</Link></li>
        <li><Link href={"/connect"}>Connect</Link></li>
    </Menu>
</FooterComponent>