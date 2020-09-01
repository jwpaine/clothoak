import * as React from 'react';
import {CardElement, injectStripe, ReactStripeElements} from 'react-stripe-elements'

class CCForm extends React.Component<> {

    constructor(props) {
        super(props);
        this.state = {
            name : ''
        }
    }

    onChange(field, value) {
        this.setState({[field] : value});
    }
    render() {

        return(

                <main className="container">
                    <form>
                        <label>Name</label>
                        <input
                            type="text"
                            value={this.state.name}
                            onChange={this.onChange.bind(this)}
                        />
                        <CardElement />>
                        <button>Submit</button>
                    </form>
                </main>




        )
    }
}

export default injectStripe(CCForm)