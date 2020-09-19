import React from 'react';
import styled from 'styled-components';
import {Link} from "react-router-dom";



export default () => {
	return (

		<div className="home">
			<div className="hero">
				 
				<div className="hero__img">
					<div className="hero__text tablet--show">
						<h1>We're in this together.</h1>
						<p>Premium 4-layer masks stitched with cotton, non-woven, and melt-blown fabrics. </p> 
						<p>1 mask purchased = 1 mask donated.</p>
                    
						<Link to={`/item/mask`}><button>Shop Masks</button></Link>
					</div>
				</div>
				<div className="hero__text tablet--hide">
					<h1>We're in this together.</h1>
					<p>Premium 4-layer masks stitched with cotton, non-woven, and melt-blown fabrics. </p> 
					<p>1 mask purchased = 1 mask donated.</p> 
				    <Link to={`/item/mask`}><button>Shop Masks</button></Link> 
				</div>
			</div>
		</div>

	)
}; 
