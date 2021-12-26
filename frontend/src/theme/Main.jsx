import React from "react";
import { ThemeProvider } from "styled-components";
import GlobalStyle from './globalStyle'
import ColorMixer from './ColorMixer'
import Fonts from './Fonts'
import Device from "./Device"

const colors = {
    'primary' : '#DA291C',
    'secondary' : '#A2AAAD',
    'tertiary' : '0000FF',
    'success' : '#067F05',
    'warning' : '#B55600',
    'danger' : '#C93027'
}

const theme_1 = {
    color : colors,
    font : {  
        primary : {
            family: `'Open Sans', sans-serif`,
            resource: <link href="https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;700" rel="stylesheet" />,
            weight : {
                regular : 400,
                bold : 700 
            }
        },
        secondary : {
            family: `proxima-nova, sans-serif`,
            resource: Fonts.generate("typekit", "lwk2yuh"),
            weight : {
                regular : 400,
                bold: 700
            }
        } 
    },
    device : Device
}

theme_1.color['dark'] = () => {
    // '#121212 base with 25% of 'primary' overlaid
    let base = ColorMixer.hexToRgb('#121212')
    let added = ColorMixer.hexToRgb(colors.primary)
    added[3] = 0.02      
    return `rgba(${ColorMixer.mix(base, added).join(", ")})`
}
theme_1.color['medium'] = () => {
    // #666666 as base with 25% of 'primary' overlaid
    let base =  ColorMixer.hexToRgb('#666666')
    let added =  ColorMixer.hexToRgb(colors.primary)
    added[3] = 0.02   
    return `rgba(${ ColorMixer.mix(base, added).join(", ")})`
}
theme_1.color['light'] = () => {
    // #F5F5F5 base color with 25% of 'primary' overlaid
    let base =   ColorMixer.hexToRgb('#F5F5F5')
    let added =  ColorMixer.hexToRgb(colors.primary)
    added[3] = 0.02
    return `rgba(${ ColorMixer.mix(base, added).join(", ")})`
}

const Theme = ({ children }) => (
    <ThemeProvider theme={theme_1}>
        <GlobalStyle /> 
        {Fonts.link(theme_1.font)}
        {children} 
    </ThemeProvider>
);

export default Theme;


