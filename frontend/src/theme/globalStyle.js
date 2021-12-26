import { createGlobalStyle } from 'styled-components';
 
const GlobalStyle = createGlobalStyle`
 * {
    font-family: ${props => props.theme.font.primary.family};     
  }

  .MuiDrawer-paperAnchorRight {
    overflow: hidden;
    @media ${props => props.theme.device.tabletS.max} {
      width: 100%;
    }
  }
`;
 
export default GlobalStyle; 
 