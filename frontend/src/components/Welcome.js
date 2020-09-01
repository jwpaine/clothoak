import React from 'react';
import styled from 'styled-components';
import {Link} from "react-router-dom";



export default () => {
	return (

		<div className="home">
			<div className="hero">
				
				<div className="hero__img">
					<div className="hero__text tablet--show">
						<h1>Mask Up!</h1>
						<p>Stitched with cotton and non-woven fabrics, our 4-layer masks are effective and affordable.  </p>
                        <Link to={`/item/mask`}><button>Shop Masks</button></Link>
					</div>
				</div>
				<div className="hero__text tablet--hide">
					<h1>Mask Up!</h1>
					<p>Stitched with cotton and non-woven fabrics, our 4-layer masks are effective and affordable. </p>
                    <Link to={`/item/mask`}><button>Shop Masks</button></Link>
				</div>
			</div>
		</div>

	)
}; 
