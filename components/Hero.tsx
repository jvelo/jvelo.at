import styled from 'styled-components';

const Heading = styled.h1`
  word-spacing: 100vw;
  text-transform: capitalize;
  font-size: 60px;
  line-height: 80px;
  font-weight: bold;
`

export const Hero: React.FunctionComponent = ({ children }) => (
    <Heading>
        {children}
    </Heading>
);

export default Hero;
