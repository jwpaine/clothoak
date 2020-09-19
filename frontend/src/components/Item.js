import React, { Component } from 'react';
import {connect} from "react-redux";
import { withRouter } from "react-router-dom";

import PropTypes from 'prop-types'; // ES6
import { reduxForm, Field } from 'redux-form';
import { compose } from 'redux'

import * as actionCreators from '../actions/index.js'
import * as actions from '../actions'
import {ADD_ERROR, AUTH_ERROR} from "../actions/types";

import ImageGallery from 'react-image-gallery'; 

import Swal from 'sweetalert2' 

import ReactHtmlParser, { processNodes, convertNodeToElement, htmlparser2 } from 'react-html-parser';

// const sizes = ['S', 'M', 'L', 'XL', '2XL', '3XL']

class Item extends Component {

constructor(props) {
	super(props)

	// this.props.change("color", 'black')
    
    props.dispatch({type: ADD_ERROR, payload: "" })
	this.props.loadItem(this.props.match.params.name,  () => {
	});
}

static contextTypes = {
    router: PropTypes.object
}

componentDidMount() {

}

componentDidUpdate(props) {

}

static contextTypes = {
    router: PropTypes.object
}
 
addItem = formProps => {
	if (this.props.authenticated) {
		console.log('refreshing session first')
		this.refreshSession();
		this.props.addItemPrivate(formProps, this.props.item.item, () => {
			this.props.history.push('/cart');
		});
	} else {
		this.props.addItem(formProps, this.props.item.item, () => {
			this.props.history.push('/cart');
		});
	}
};

refreshSession = () => {
	this.props.refreshSession(() => {

	})
}

renderErrorMessage = () => {

		if (!this.props.errorMessage) {
			return
		}

		if (this.props.errorMessage.length != 0) {
			return (
				<div className="messages">
					{this.props.errorMessage.map(message => (
						<div key={message.key} className={`message message--error`}>
							{message.text}
						</div>
					))}
				</div>
			)
		}
	
}

renderSizeOptions = item => {
	if (!item) {
		return
	}
	if (item.sizes) {
		return (
			<Field name="size" component="select">
				<option value="">Size</option>
					{item.sizes.map(sizeOption => (
						<option value={sizeOption} key={sizeOption}>
							{sizeOption}
						</option>
					))}
			</Field>
		)
	}
}

renderDescription = item => {
	if (!item) {
		return
	}

	console.log(`desc: ${item.description}`)

	return (
		<div className="description">
			{ReactHtmlParser(item.description)}
		</div>
	)

}

renderOptions = item => {
	if (!item) {
		return
	}

	if (!item.options) {
		return
	}
		return (
			<div> { 
				Object.keys(item.options).map(type =>
					<Field name={type} component="select">
						<option disabled value="">{type}</option>
							{item.options[type].attributes.map(attribute => (
								<option value={attribute} key={attribute}>
									{attribute}
								</option>
							))}
					</Field>
				)} 
			</div>
		)
}

renderImages = item => {
	if (!item) {
		return
	}

	//  let images = []
	 for (var i in item.images) {
		 console.log(item.images[i].original)
		 let item_img = `https://s3.amazonaws.com/clothoak.com/static/images/items/${item.images[i].original}`
		 item.images[i].original = item_img
	// 	images.push({ original: `https://s3.amazonaws.com/clothoak.com/static/images/items/${item.images[i]}`})
	 }  

	return <ImageGallery items={item.images} showThumbnails={false} showPlayButton={false} showFullscreenButton={false} />;
}

notifyWhenAvailable = item => {
	Swal.fire({
		title: "We'll let you know!",
		text: "Please enter your email address and we'll notify you as soon as this product becomes available!",
		input: 'text', 
		inputAttributes: {
		  autocapitalize: 'off'
		}, 
		showCancelButton: false,
		confirmButtonText: 'Submit', 
		showLoaderOnConfirm: true,
		preConfirm: (email) => {
			let data = {
				'item' : item.name,
				'email' : email  
			} 
			fetch('https://api.clothoak.com/notifyme', { 
				method: 'POST',
				headers: {
				  'Content-Type': 'application/json',
				},
				body: JSON.stringify(data),
			  })
			 
		},
		allowOutsideClick: () => !Swal.isLoading()
	  }).then((result) => {
		if (result.isConfirmed) {
		  Swal.fire({
			title: 'Done!',
			text: "We'll let you know as soon as this product becomes available!"
		  })
		} 
	  }) 
}

renderButton = item => {
	if (!item) {
		return
	}


	console.log(`available qty: ${item.available}`)
	if (item.available > 0) {
		return (
			<button>Add To Cart</button>
		)
	}
	return (
		<div className="unavailable">   
			<p>Currently Out of Stock</p> 
			<a onClick={() => this.notifyWhenAvailable(item)}>Notify When Available</a>  
		</div>
	)
}

renderItem = item => {
	
	if(!item.name) { 
		return 
	}

    return (
	    <div className="item-page">
		    <div className="item">
				<div className="img-wrap">
					{/* <img src={`https://s3.amazonaws.com/clothoak.com/static/images/items/${item.image}`} /> */}
					{ this.renderImages(item) }
				</div>

				<div className="details">
					<h1>{item.name}</h1>
					{this.renderDescription(item)}
					<p className="price">${item.price}</p>
					<fieldset>

						{this.renderOptions(item)}

						<div className="quantity">
							<label>Quantity</label>
							<Field
								name="qty"
								type="text"
								component="input"
							/>
						</div>
					</fieldset>
					{this.renderButton(item)} 
					{this.renderErrorMessage()}
					
				</div>
			</div>
		</div>
    )
}


	render() {

		const { handleSubmit } = this.props;
		return(
			<div>
				<form onSubmit={handleSubmit(this.addItem)}>
			        { this.renderItem(this.props.item.item) }
				</form>
			</div>
		)
	}
}

function mapeStateToProps(state, props) {

	return { 
		errorMessage: state.create.errorMessage,
		item : state.item,
		form : props.name,
		initialValues : {
			name: props.match.params.name,
			image: state.item.item.image,
			price: state.item.item.price,
			qty: '1'
		},
		authenticated: state.auth.authenticated
	}
}

export default compose(
	connect(mapeStateToProps, actions),
	reduxForm({ form: 'updateItem', enableReinitialize : true})
)(Item);
