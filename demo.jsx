import { render } from 'react-dom';
import React from 'react';

import { Braintree, Field } from './src/index';


class BraintreeHostedfieldDemo extends React.PureComponent {

    constructor(props) {
        super(props);
        ['onCardTypeChange', 'getToken'].forEach((prop) =>
            this[prop] = this[prop].bind(this)
        );
    }

    getToken() {
        this.tokenize().then((t) => {
            debugger
        })
    }

    onCardTypeChange({ cards }) {
        this.setState({ card: (cards.length == 1) ? cards[0].type : '' });
    }

    state = {
        numberFocused: false,
    }

    render() {
        return (
            <div>
                <h1>Braintree Hosted Fields Demo</h1>
                <Braintree
                    authorization='sandbox_g42y39zw_348pk9cgf3bgyw2b'
                    onError={console.log}
                    getTokenRef={t => (this.tokenize = t)}
                    onCardTypeChange={this.onCardTypeChange}
                    styles={{
                        'input': {
                            'font-size': '14px',
                            'font-family': 'helvetica, tahoma, calibri, sans-serif',
                            'color': '#7d6b6b',
                        },
                        ':focus': {
                            'color': 'black',
                        },
                    }}
                >
                    <div>
                        Number:
                        <Field type="number"
                               onBlur={() => this.setState({ numberFocused: false })}
                               onFocus={() => this.setState({ numberFocused: true })}
                               className={this.state.numberFocused ? 'focused' : ''}
                        />
                        <p>Card type: {this.state.card}</p>
                        Date:
                        <Field type="expirationDate" />
                        Month:
                        <Field type="expirationMonth" />
                        Year:
                        <Field type="expirationYear" />
                        CVV:
                        <Field type="cvv" />
                        Zip:
                        <Field type="postalCode" />
                    </div>
                </Braintree>
                <button onClick={this.getToken}>Get token</button>
            </div>
        )
    }
}

render((
    <BraintreeHostedfieldDemo />
), document.getElementById('root'));
