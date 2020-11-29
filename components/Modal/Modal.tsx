import React from "react";
import styled from 'styled-components';
import {
    Box, Image
} from 'rebass/styled-components';
import theme from "../../styles/theme";

type Props = {
    open: boolean;
    onClose?: () => void;
    id?: string;
}

const Overlay = styled(Box)`
    z-index: 10000; 
    min-height: 100vh;
    width: 100%;
    padding: 70px;
    background: white;
    opacity: 0.8;
    position: fixed;
    top: 0;
    left: 0;
    display: ${props => props.open ? 'block' : 'none'};
`;

const Content = styled(Box)`
    z-index: 10001; 
    border: 3px solid black;
    background: white;
    position: fixed;
    top: 0;
    left: 0;
    display: ${props => props.open ? 'block' : 'none'};
    padding: 20px;
    
    margin: 5px;
    min-height: calc(100vh - 10px);
    width: calc(100% - 10px);
    
    ${theme.mediaQueries.small} {
        margin: 50px;
        min-height: calc(100vh - 100px);
        width: calc(100% - 100px);
    }
`;

const CloseButton = styled(Box)`
    float: right;
`

export const Modal: React.FunctionComponent<Props> = ({children, open, onClose}) => (
    <>
        <Overlay open={open}>
        </Overlay>
        <Content role="dialog"
                 aria-modal="true"
                 open={open}>
            {children}

            <CloseButton
                onClick={() => onClose && onClose()}>
                <Image src={'/cross.svg'} height={50}/>
            </CloseButton>
        </Content>
    </>
);
