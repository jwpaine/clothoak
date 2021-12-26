import React from "react";
import { Helmet } from "react-helmet"
import WebFont from "webfontloader"


const Fonts = {
    link : function(font) {
        let resourceList = []
        for (var i in font) {
            if (font[i].resource) {
                resourceList.push(font[i].resource)
            }
        }
        if (resourceList.length == 0) return
        return(
            <Helmet> 
                {resourceList.map(function(resource) {
                   return resource
                })}   
            </Helmet>
        )
    }, 
    generate : function(source, family) {
        let font = {}
        font[source] = {
            families: [family]
        }
        return WebFont.load(font);
    }
}

export default Fonts






// const loadWebFont = (module, family) => {
//     let font = {}
//     font[module] = {
//         families: [family]
//     }
//     return WebFont.load(font);
// }


// // const fontList = {
// //     "Open Sans" : {
// //         family: `'Open Sans', sans-serif`,
// //         resource: loadWebFont('google', 'Open Sans'),
// //         weight : { regular : 400, bold : 700 }
// //     } 
// // }

// const Fonts = {
//     link : function(font) {
//         if (!font) return

//         let resourceList = []
//         for (var i in font) {
//             if (font[i].resource) {
//                 resourceList.push(font[i].resource)
//             }
//         }
//         console.log(`resource list: ${resourceList}`)
//         return(
//             <Helmet> 
//                 {resourceList.map(function(resource) {
//                    return resource
//                 })}   
//             </Helmet>
//         )
//     }, 
//     generate : function(module, font, family, weight) {
//         // return fontList[font] 
//         loadWebFont(module, font)
//         return {
//             "id" : font,
//             "family" : family,
//             "weight" : weight
//         }
//     }
// }

// export default Fonts