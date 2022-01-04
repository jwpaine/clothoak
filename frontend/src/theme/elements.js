import styled, { css } from "styled-components";
import {createGlobalStyle} from 'styled-components'; 
 
// helper functions
const colored = (props) => {
  return props.theme.color[props.color] || props.color
}
const query = (props, device, start, query) => `
  @media ${props.theme.device[device][start]} {
    ${query}
  }
`

// footer
export const Footer = styled.footer`
  background: ${props => props.theme.color.dark};
  display: flex !important; 
  justify-content: center;  
`
// header
export const Header = styled.header`
  display: flex;
  justify-content: space-between;
  height: 60px;
  border-bottom: 1px solid ${props => props.theme.color.light};  
  align-content: ;
  align-items: center;
  .logo {
    text-decoration: none; 
    color: ${props => props.theme.color.dark};
    font-size: 20px; 
  }
  .links {
    display: flex;
    a {
      margin: 0px 12px; 
    }
  }
`
// category
export const CategoryContainer = styled.div`
  margin: 30px; 
  background: #FFFFFF;
  padding: 25px; 
  border-radius: 10px; 
  border: 1px solid ${props => props.theme.color.light};  
  box-shadow: -1px 3px 50px -10px rgba(0,0,0,0.2); 
  header {
    display: flex;
    justify-content: space-between;   
    padding: 10px 0px; 
    div {
      display: flex;
      flex-direction: column; 
    }
    .code {
      color: ${props => props.theme.color.dark};
      font-size: 15px;
      padding: 5px 0px;  
    }
  }
`
export const Breadcrumb = styled.div`
  > ul {
    list-style-type: none;
    li {
      > * {
        text-transform: capitalize; 
        text-decoration: none;
        color: ${props => props.theme.color.dark}; 
        font-size: 13px;
      } 
    }
  }
 
` 
// item
export const ProductInfoCard = styled.div`
  border: 2px solid ${props => props.theme.color.light};
  border-radius: 5px; 
  padding: 20px;
  display: flex;
  justify-content: center;
  align-items: center; 
  max-width: 558px; 
  margin-top: 15px;
  flex-flow: wrap; 
  justify-content: space-evenly; 
  header {
    display: flex;
    width: 100%;
    justify-content: center; 
    i {
      padding: 2px; 
    }
  }
  div {
    display: flex; 
  }
`
export const ItemOptionsContainer = styled.div`
  display: flex;
  flex-flow: wrap;
  align-items: center;
  margin: 10px 0px; 
  header {
    width: 100%; 
    display: flex; 
    justify-content: flex-start; 
    label {
      margin-right: 5px; 
    } 
  }
`
//checkout
export const CheckoutItem = styled.div`
  display: flex;
  padding: 10px; 
  .details {
    display: flex; 
    flex-direction: column; 
  } 
  img {
    max-width: 100px;
  }
`
// general
export const Main = styled.main`
  display: flex;
  justify-content: center; 
  height: 100%; 
  

  ${props => query(props, 'tabletL', 'max', `
    flex-direction: column; 
    align-items: center; 
    justify-content: flex-start; 
  `)}

  section {
    display: flex;
    flex: 1;
    max-width: 650px; 
    padding: 20px;  
    h1 {
      text-align: center; 
    }
  
    justify-content: center; 
    align-items: center; 
    flex-direction: column; 

    ${props => query(props, 'tabletL', 'max', `
      flex: unset; 
    `)} 
    
    &:nth-of-type(1) {
      border-right: 1px solid ${props => props.theme.color.light}; 
      ${props => query(props, 'tabletL', 'max', `
        border-right: none; 
      `)}
    } 
    
    
    
  }

`
export const Form = styled.form`
  display: flex;
  flex-direction: column; 
  align-items: center;
  width: 350px;
  padding: 10px; 
  ${props => query(props, 'phoneL', 'max', 'width: 100%;')}
  text-align: center; 
  > * {
    width: 100%; 
    margin: 5px; 
  }
`
export const Message = styled.div`
  display: flex;
  justify-content: center; 
  align-items: center; 
  max-width: 300px;
  height: 40px;
  border: 1px solid #B55600;
  background: #FFF4E6;
  color: #B55600;  
  margin: 5px 0px; 
  i, span {
    color: #B55600; 
  } 
`
export const Container = styled.div`
  display: flex;
`
export const SideMenu = styled.aside`
  width: 400px; 

  ${props => query(props, 'tabletS', 'max', 'width: 100%;')}

  header {
      display: flex;
      position: fixed;
      top: 0;
      width: 100%;
      max-width: 370px;
      ${props => query(props, 'tabletS', 'max', 'max-width: calc(100% - 33px);')}
      align-items: center; 
      padding: 12px 15px; 
      background: ${props => props.theme.color.light}; 
      i.close {
        margin-left: auto; 
      }  
      h3 {
        margin-left: 12px; 
      } 
  }   
  .items {
    padding: 20px;
    overflow: hidden;
    overflow-y: auto; 
    height: calc(100vh - 326px);
    margin-top: 50px;
    li {
      display: flex;
      border: 1px solid ${props => props.theme.color.light}; 
      border-radius: 8px;  
      padding: 20px; 
      .actions {
          display: flex;
          flex-wrap: wrap;
          justify-content: center; 
          width: 100px; 
          padding-right: 20px;  
  
        img { 
          max-width: 100px;   
          margin-bottom: 24px;
          cursor: pointer;
        }
        i {
          cursor: pointer;  
        }
      }
      .details {
        flex-direction: column;
        display: flex;
        justify-content: center; 
        span {
          color: ${props => props.theme.color.dark};
          font-weight: ${props => props.theme.font.primary.weight.bold}; 
          font-size: 15px; 
          padding: 7px; 
        } 
      }
    }
  }

  footer {
    position: fixed;
    bottom: 0;
    width: 100%;
    max-width: 359px;
    ${props => query(props, 'tabletS', 'max', 'max-width: calc(100% - 33px);')}
    background: white;
    border-top: 1px solid darkgray;
    padding: 20px; 
    display: flex;
    flex-direction: column; 
    span {
      font-size: 20px; 
    }
    div {
        display: flex; 
        justify-content: space-between; 
        margin-bottom: 30px; 
        border: 1px solid ${props => props.theme.color.light}; 
        border-radius: 5px;   
        padding: 10px;  
      } 
    }
  }

  form {
    display: flex;
    flex-direction: column;
    padding: 20px; 
    margin-top: 40px;
    input {
      padding: 12px;
      border: 1px solid ${props => props.theme.color.light}; 
      border-radius: 5px;
      margin: 10px 0px; 
    }
    a {
      font-weight: ${props => props.theme.font.primary.weight.bold}; 
    }
  }

  button {
    margin: 5px 0px; 
  }

`
export const ItemCard = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center; 
  max-height: 310px;
  cursor: pointer;
  position: relative;
  border: 1px solid ${props => props.theme.color.light}; 
  border-radius: 12px; 
  > img {
    height: 176px; 
    padding: 20px; 
  }  
  > .product-title {
    color: ${props => props.theme.color.dark};
    font-weight: ${props => props.theme.font.primary.weight.bold}; 
    font-size: 14px; 
    max-width: 215px;
    text-align: center;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical; 
    height: 40px; 
  }
  > .product-price {
    color: ${props => props.theme.color.primary};
    font-weight: ${props => props.theme.font.primary.weight.bold}; 
    font-size: 14px; 
    padding: 5px 0px 20px 0px;
  } 
  > i {
    position: absolute;
    right: 10px;
    top: 10px; 
  }
`
export const ItemCardsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(100px, 275px));  
  grid-gap: 25px;   
  max-width: 1175px; 
  padding: 16px; 
`
export const Banner = styled.div` 
  display: flex;
  flex: 1; 
  background-size: cover;
  background-position: center;
  align-items: center; 
  justify-content: center; 
  flex-direction: column; 
  background-image: url(${props => props.image});  
`
export const Input = css`
  height: 48px; 
  border: 2px solid ${props => props.theme.color.light};
  color: ${props => props.theme.color.dark};
  font-size: 15px;
  font-weight:  ${props => props.theme.font.primary.weight.bold}; 
  text-align: center; 
  border-radius: 10px; 
`
export const Icon = styled.i`
  color: ${props => colored(props) || props.theme.color.primary}; 
  font-family: 'Material Icons';
  text-transform: none;
  font-style: normal; 
  font-size: ${props => props.xlarge ? '49px' : props.large ? `40px` : props.medium ? `32px` : `24px`};
`
export const Button = styled.button`
  display: flex;
  flex-direction: column; 
  justify-content: center;
  align-items: center; 
  background: ${props => colored(props) || props.theme.color.primary}; 
  color: ${props => props.color == "secondary" ? props.theme.color.dark : "#FFFFFF" };  
  font-size: 16px;   
  padding: 13px 32px;   
  text-transform: capitalize;
  border-radius: 10px;  
  font-weight: ${props => props.theme.font.primary.weight.bold};
  border: none; 
  cursor: pointer;
  &:hover {
    filter: brightness(80%); 
  }
`;
export const A = styled.a`
  font-size: 15px;
  color: ${props => colored(props) || props.theme.color.primary}; 
  &:hover {
    filter: brightness(80%); 
  } 
`
export const P = styled.p`
  color: ${props => colored(props) || props.theme.color.dark}; 
  font-weight: ${props => props.theme.font.primary.weight.regular}; 
  font-size: 15px;    
`;
export const Span = styled.span`
  color: ${props => colored(props) || props.theme.color.dark}; 
  font-size: 15px;
  font-weight: ${props => props.theme.font.primary.weight.bold}; 
`
export const Label = styled.label`
  color: ${props => colored(props) || props.theme.color.dark}; 
  font-size: 15px;
  font-weight: ${props => props.theme.font.primary.weight.bold};
`
export const Title = styled.title`
  color: ${props => colored(props) || '#FFFFFF'}; 
  font-weight: ${props => props.theme.font.primary.weight.bold};  
  font-size: 80px;  
`;
export const H1 = styled.h1`
  color: ${props => colored(props) || props.theme.color.dark}; 
  font-weight: ${props => props.theme.font.primary.weight.bold}; 
  font-size: 30px;   
`;
export const H2 = styled.h2`
  color: ${props => colored(props) || props.theme.color.dark}; 
  font-weight: ${props => props.theme.font.primary.weight.bold};  
  font-size: 23px;
`;
export const H3 = styled.h3`
  color: ${props => colored(props) || props.theme.color.dark}; 
  font-weight: ${props => props.theme.font.primary.weight.bold}; 
  font-size: 20px;  
`;
export const H4 = styled.h4`
  color:${props => colored(props) || props.theme.color.dark};  
  font-weight: ${props => props.theme.font.primary.weight.bold}; 
  font-size: 15px;
`;
export const H5 = styled.h5`
  color: ${props => colored(props) || props.theme.color.dark}; 
  font-weight: ${props => props.theme.font.primary.weight.bold}; 
  font-size: 12px;
`;
export const H6 = styled.h6` 
  color: ${props => colored(props) || props.theme.color.dark}; 
  font-weight: ${props => props.theme.font.primary.weight.bold};  
  font-size: 10px;
`; 


