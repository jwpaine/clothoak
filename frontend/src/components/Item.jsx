import React, { Component } from 'react';
import {connect} from "react-redux";
import { withRouter } from "react-router-dom";

import PropTypes from 'prop-types'; // ES6
import { reduxForm, Field } from 'redux-form';
import { compose } from 'redux'

import * as actionCreators from '../actions/index.js'
import * as actions from '../actions'
import {ADD_ERROR, AUTH_ERROR} from "../actions/types";
import styled from 'styled-components';
import ImageGallery from 'react-image-gallery'; 

import Swal from 'sweetalert2' 

import ReactHtmlParser, { processNodes, convertNodeToElement, htmlparser2 } from 'react-html-parser';

import {Main, H1, Span, Button, P, A} from "../theme/elements"

class Item extends Component {

constructor(props) {
	super(props)
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

	if (!this.props.errorMessage) return

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
	if (!item) return

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
	if (!item) return

	return ReactHtmlParser(item.description)
}

renderOptions = item => {
	if (!item) return

	if (!item.options) return

	return (
		<> { 
			Object.keys(item.options).map(type =>
				<Field key={type} name={type} component="select">
					<option disabled value="">{type}</option>
						{item.options[type].attributes.map(attribute => (
							<option value={attribute} key={attribute}>
								{attribute}
							</option>
						))}
				</Field>
			)} 
		</>
	)
}

renderImages = item => {
	if (!item.images) return

	return <ImageGallery originalClass="imageGallery" items={item.images} showThumbnails={false} showPlayButton={false} showFullscreenButton={false} />;
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
	if (!item) return
	if (item.available > 0) return <Button>Add To Cart</Button>

	return (
		<>  
			<P>Currently Out of Stock</P> 
			<A onClick={() => this.notifyWhenAvailable(item)}>Notify When Available</A>  
		</>
	)
}


renderItem = item => {
	
	if(!item.name) return

    return (
		<>
			<H1>{item.name}</H1>
			{this.renderDescription(item)}
			<Span>${item.price}</Span>
			{this.renderOptions(item)}

		</>
    )
}

	render() {

		const { handleSubmit } = this.props;
		const StyledForm = styled.form`
			max-width: 500px; 
			display: flex;
			flex-direction: column;

			h1 {
				text-align: left !important; 
			}

			select {
				max-width: 145px;
			}
			input {
				max-width: 50px;
				margin: 0px 10px; 
			}
			div {
				display: flex; 
				align-items: center; 
			}

			> * {
				margin: 8px;
			}
		`

		const ProductImage = styled.section`
			.image-gallery {
				img {
					width: 100%; 
				}
			}
		`
		return(
			<Main>
				<ProductImage>
					{ this.renderImages(this.props.item.item) }
				</ProductImage>
				<section>
					<StyledForm onSubmit={handleSubmit(this.addItem)}>
						{ this.renderItem(this.props.item.item) }
						<div>
							<Span>Quantity</Span>
						<Field
							name="qty"
							type="text"
							component="input"
						/>
						</div>
									
						{this.renderButton(this.props.item.item)} 
						{this.renderErrorMessage()}
					</StyledForm>
				</section>
			</Main>
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
