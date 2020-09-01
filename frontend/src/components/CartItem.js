import React from 'react';
import styled from 'styled-components';
import {Link} from "react-router-dom";



const Wrapper = styled.section`

		background: lightgray;
		
		.name, .price, .size {
		    font-size: 16px;
		    font-weight: bold;
		}
		
		img {
		    height: 100px;
		}
	`;
const renderDelete = (removeItem, index) => {
    if (removeItem) {
        return (
            <a href="#" onClick={() => removeItem(index)}>Remove</a>
        )
    }
}

const renderItemOptions = item => {
    return 
}

const renderItemDetails = item => {
    if (!item) return

    return (
        <div>
            
            
            
            {
            Object.keys(item).map(attribute => 
                
                
                    
                     
                      { if (attribute != 'name' && attribute != 'qty' && attribute != 'price' && attribute != 'image') {
                           return (
                            <label>
                               {attribute + ": " + item[attribute] + "\n"}
                            </label>
                           )
                           

                           } else {
                               return
                           }

                        }
                        
                    

                        
                       
                      
                       
               
            
            
            
            )}
    
            
        </div>
    )

}
const CartItem = (props) => {



    return(
        <div className="item">
            <div className="img-wrap">
                <Link to={`/item/${props.name}`}>
                    <img src={`https://s3.amazonaws.com/clothoak.com/static/images/items/${props.image}`} />
                </Link>
            </div>
            <div className="details">
                <Link to={`/item/${props.name}`}><b>{props.name}</b></Link>
                {renderItemDetails(props.item)}
                <label>Qty: {props.qty} </label>
                <label>${props.price} </label>

                { renderDelete(props.removeItem, props.index) }
            </div>
        </div>
    )
}
export default CartItem;

