import React from "react";
import Theme from "./theme";

const globalStyles: () => JSX.Element = () => (
  <style>
    {`
        body {
            color: ${Theme.colors.primary};
            margin: 0;
            padding: 0;
            font-size: 20px;
            line-height: 2.0rem;
            background-color: ${Theme.colors.white};
            font-family: ${Theme.fonts.sans};           
        }       

        *::selection {
            background: black;
            color: white;
        }
        
        * {
            box-sizing: border-box;
        }
        
        h1 {          
          font-size: 60px;
          line-height: 80px;
          font-weight: bold;
        }

        a {
          color: ${Theme.colors.primary};
          text-decoration: overline;
          font-weight: bold;
          text-decoration-thickness: 3px;
          cursor: pointer;
        }
        
        a:hover {
          text-decoration: none;
          color: white;
          background: ${Theme.colors.primary};
          font-weight: bold;
          text-decoration-thickness: 3px;
        }
        
        a:visited {
        }
        
        ul {
          list-style-type: square;
        }
    `}
  </style>
);

export default globalStyles;
