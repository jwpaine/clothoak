import { createGlobalStyle } from 'styled-components';
 
const GlobalStyle = createGlobalStyle`
 * {
    font-family: ${props => props.theme.font.primary.family};     
  }

  #root {
    height: 100vh; 
  }

`;
 
export default GlobalStyle; 
 