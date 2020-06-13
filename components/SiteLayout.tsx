import {Box, Image} from 'rebass'
import styled from 'styled-components';
import React from "react";
import Link from "next/link";


const Header = styled.header`
  padding: 50px;
  height: 50px;
  margin-top: 15px;
  
  & a:hover {
    background: none;
  }
`;

const Main = styled.main`
  padding: 50px;
  min-height: calc(100vh - 100px);
  max-width: 900px;
`;

const Footer = styled.footer`
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

const Anchor = styled.div`
    background: white;
    position: absolute;
    z-index: 9999;
    height: 15px;
    top: 0;
    width: 100%;
    left: 0;
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

export const Page: React.FunctionComponent = ({ children }) => (
    <>
        <Header id={'top'}>
                <Link href={"#navigation"}>
                    <a><Image src={'/logo.png'} height={50}/></a>
                </Link>
        </Header>
        <Main>
            {children}
        </Main>
        <Footer id={'navigation'}>
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
        </Footer>
    </>
);

export default Page;
