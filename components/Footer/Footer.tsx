import Link from "next/link";
import React from "react";
import styled from "@emotion/styled";
import {Box, Image} from 'rebass';

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
  padding: 50px;
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