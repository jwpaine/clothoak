// import React, { Component } from 'react';
// import {connect} from "react-redux";
// import {Link, withRouter} from "react-router-dom";
//
//
// import PropTypes from 'prop-types'; // ES6
// import { reduxForm, Field } from 'redux-form';
// import { FormName } from 'redux-form' // ES6
// import { compose } from 'redux'
//
// import * as actionCreators from '../actions/index.js'
// import * as actions from '../actions'
// import requireAuth from "./RequireAuth";
//
//
//
// class Address extends Component {
//
//
//     constructor(props) {
//         super(props)
//     }
//
//     static contextTypes = {
//         router: PropTypes.object
//     }
//
//
//     componentDidMount() {
//
//     }
//
//     componentDidUpdate(props) {
//
//     }
//
//
//     static contextTypes = {
//         router: PropTypes.object
//     }
//
//
//
//     render() {
//
//         const onSubmit = values => alert(JSON.stringify(values))
//
//         return(
//             <div>
//
//                 <form onSubmit={this.props.onSubmit}>
//                     <fieldset>
//                         <Field
//                             name="name"
//                             type="text"
//                             component="input"
//                             autoComplete="name"
//                             />
//                         <Field
//                             name="address"
//                             type="text"
//                             component="input"
//                             autoComplete="address"
//                         />
//                     </fieldset>
//                     <button>Save</button>
//                 </form>
//
//             </div>
//         )
//     }
// }
//
// // Decorate the form component
// Address = reduxForm({
//     form: 'contact' // a unique name for this form
// })(Address);
//
// export default Address;

import React, { Component } from 'react';
import { Field, reduxForm } from 'redux-form'
import styled from 'styled-components';
import {connect} from "react-redux";
import { compose } from 'redux'

import {Button, H1, Input} from "../theme/elements"

const StyledField = styled(Field)`
    ${Input}
`

const Form = styled.form`
    display: flex;
    flex-direction: column;
`

class Address extends Component {

    constructor(props) {
        super(props);
        if(props.preFill) {

            if (props.preFill.shipping) {
                this.props.change("email", props.preFill.shipping.email) 
                this.props.change("name", props.preFill.shipping.name)
                this.props.change("address", props.preFill.shipping.address)
                this.props.change("city", props.preFill.shipping.city)
                this.props.change("state", props.preFill.shipping.state)
                this.props.change("zip", props.preFill.shipping.zip)
            }

        }

    }


renderEmailInput = (guest) => {
    if (!guest) {
        return
    }



    return (
        <div>
              <StyledField
                    name="email"
                    type="text"
                    component="input"
                    autoComplete="email"
                    placeholder="Email"
                />
                 <br/> <br/>  
        </div>
    )
}
 
    render() {
       
        return (
            <Form form={this.props.form} form={this.form} onSubmit={this.props.handleSubmit}>
                    {this.renderEmailInput(this.props.guest)}
                    
                    <StyledField
                        name="name"
                        type="text"
                        component="input"
                        autoComplete="name"
                        placeholder="Full Name"
                    /> 
                    <StyledField
                        name="address"
                        type="text"
                        component="input"
                        autoComplete="address"
                        placeholder="Address"
                    />
                   
                    <StyledField
                        name="city"
                        type="text"
                        component="input"
                        autoComplete="city"
                        placeholder="City"
                    />
                    <StyledField
                        name="state"
                        type="text"
                        component="input"
                        autoComplete="state"
                        placeholder="State"
                    />
                    <StyledField
                        name="zip"
                        type="text"
                        component="input"
                        autoComplete="zip"
                        placeholder="Zip"
                    />
                <Button>Save</Button>
            </Form>
        )
    }

}

const mapStateToProps = (state, ownProps) => {
    return {
        form: ownProps.name
        // other props...
    }
}

// export default reduxForm({
//    // form: 'myForm'
// })(Address)

export default compose(
    connect(mapStateToProps),
    reduxForm({
        //other redux-form options...
        // form : 'myform'
    })
)(Address);



