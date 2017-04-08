import { render } from 'react-dom';
import React from 'react';

import { Braintree, Field } from './src/index';


class BraintreeHostedfieldDemo extends React.PureComponent {

    constructor(props) {
        super(props);
        [
            'onError',
            'getToken',
            'onCardTypeChange',
        ].forEach(prop => (this[prop] = this[prop].bind(this)));
    }

    state = {}

    onError(error) {
        this.setState({ error });
    }

    getToken() {
        this.tokenize().then(
            token => this.setState({ token, error: null }),
        ).catch(
            error => this.setState({ token: null, error }),
        );
    }

    onCardTypeChange({ cards }) {
        this.setState({ card: (1 === cards.length) ? cards[0].type : '' });
    }

    state = {
        numberFocused: false,
    }

    renderResult(title, obj) {
        if (!obj) { return null; }
        return (
            <div>
                <b>{title}:</b>
                <pre>{JSON.stringify(obj, null, 4)}</pre>
            </div>
        );
    }

    render() {
        return (
            <div>
                <h1>Braintree Hosted Fields Demo</h1>
                {this.renderResult('Error', this.state.error)}
                {this.renderResult('Token', this.state.token)}

                <Braintree
                    authorization='sandbox_g42y39zw_348pk9cgf3bgyw2b'
                    onError={this.onError}
                    getTokenRef={t => (this.tokenize = t)}
                    onCardTypeChange={this.onCardTypeChange}
                    styles={{
                        input: {
                            'font-size': '14px',
                            'font-family': 'helvetica, tahoma, calibri, sans-serif',
                            color: '#7d6b6b',
                        },
                        ':focus': {
                            color: 'black',
                        },
                    }}
                >
                    <div>
                        Number:
                        <Field
                            type="number"
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
                <div className="footer">
                    <button onClick={this.getToken}>Get token</button>
                </div>
            </div>
        );
    }
}

render((
    <BraintreeHostedfieldDemo />
), document.getElementById('root'));
