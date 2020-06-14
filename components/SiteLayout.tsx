import styled from 'styled-components';
import React from "react";
import {Footer} from "./Footer/Footer";
import {Header} from "./Header/Header";

const Main = styled.main`
  padding: 50px;
  min-height: calc(100vh - 100px);
  max-width: 900px;
`;


export const Page: React.FunctionComponent = ({ children }) => (
    <>
        <Header />
        <Main>
            {children}
        </Main>
        <Footer />
    </>
);

export default Page;
