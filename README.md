# React components to integrate Braintree hosted fields

A few small React components to make integrating [Braintree's Hosted Fields](https://developers.braintreepayments.com/guides/hosted-fields/) easier.

[![Build Status](https://travis-ci.org/nathanstitt/react-braintree-fields.svg?branch=master)](https://travis-ci.org/nathanstitt/react-braintree-fields)

# See also

I've also written a vendor agnostic library [PaymentFields](https://github.com/nathanstitt/payment-fields)  It's an extension of this library to also support Square and Stripe.  You might check that out if you ever think you'll need to support additional processors.

## Introduction

```javascript
import { Braintree, HostedField } from 'react-braintree-fields';
class MySillyCheckoutForm extends React.PureComponent {

    function onSubmit() {
        // could also obtain a reference to the Braintree wrapper element and call `.tokenize()`
       this.getToken({ cardholderName: 'My Order Name' }).then((payload) => {
         console.log("nonce=" , payload.nonce)
         console.log("device_data", this.device_data)
       })
    }

    onCardTypeChange() {
        this.setState({ card: (1 === cards.length) ? cards[0].type : '' });
    }

    function onFocus(event) {
        console.log("number is focused", event);
    }

    onError(err) {
       console.warn(err);
       this.ccNum.focus(); // focus number field
    }

    onAuthorizationSuccess() {
      this.setState({ isBraintreeReady : true });
    }

    onDataCollectorInstanceReady(err, dataCollectorInstance) {
      if(!err) this.device_data = dataCollectorInstance.deviceData
    }

    render() {
        return (
            <Braintree
                className={ this.state.isBraintreeReady ? '' : 'disabled' }
                authorization='sandbox_g42y39zw_348pk9cgf3bgyw2b'
                onAuthorizationSuccess={this.onAuthorizationSuccess}
                onDataCollectorInstanceReady={this.onDataCollectorInstanceReady}
                onError={this.handleError}
                onCardTypeChange={this.onCardTypeChange}
                getTokenRef={ref => (this.getToken = ref)}
                styles={{
                    'input': {
                        'font-size': '14px',
                        'font-family': 'helvetica, tahoma, calibri, sans-serif',
                        'color': '#3a3a3a'
                    },
                    ':focus': {
                        'color': 'black'
                    }
                }}
            >
                <div className="fields">
                    <HostedField type="number" onFocus={onFocus} ref={ccNum => (this.ccNum = ccNum)} />
                    <HostedField type="expirationDate" />
                    <HostedField type="cvv" />
                </div>
                <button onClick={onSubmit}>Submit</button>
            </Braintree>
        );
    }
}
```

See [demo site](https://nathanstitt.github.io/react-braintree-fields/) for a working example. It renders [demo/demo-class.jsx](demo/demo-class.jsx)  There's also a [functional version](demo/demo-functional.jsx) available that illustrates how to work around the issue of storing a function reference using setState that was discovered in [issue #20](https://github.com/nathanstitt/react-braintree-fields/issues/20)

## Braintree Component

Props:
 * authorization: Required, either a [tokenization key or a client token](https://developers.braintreepayments.com/guides/hosted-fields/setup-and-integration/)
 * onAuthorizationSuccess: Function that will be called after Braintree successfully initializes the form.
 * styles: Object containing [valid field styles](https://braintree.github.io/braintree-web/3.11.1/module-braintree-web_hosted-fields.html#.create)
 * onError: Function that will be called if an Braintree error is encountered.
 * getTokenRef: A function that will be called once Braintree the API is initialized.  It will be called with a function that can be used to initiate tokenization.
   * The tokenization function will return a Promise which will be either resolved or rejected.  If resolved, the promise payload will contain an object with the `nonce` and other data from Braintree.
 * onDataCollectorInstanceReady: A function that will be called with the results of `Braintree.dataCollector.create`. This can be used in conjunction with [Braintree's Advanced Fraud Tools](https://developers.braintreepayments.com/guides/advanced-fraud-tools/client-side/javascript/v3).

## HostedField Component

Props:
  * type: Required, one of:
    - 'number', 'expirationDate', 'expirationMonth', 'expirationYear', 'cvv', 'postalCode'
  * onBlur
  * onFocus
  * onEmpty
  * onNotEmpty
  * onValidityChange
  * onCardTypeChange - accepted on any field, but will only be called by type="number"
  * placeholder - A string to that will be displayed in the input while it's empty
  * formatInput
  * maxlength,
  * minlength
  * select
  * prefill

See the [Braintree api docs](https://braintree.github.io/braintree-web/3.33.0/module-braintree-web_hosted-fields.html#%7Efield) for more details

Fields also have "focus" and "clear" methods.  These may be called by obtaining a reference to the field.
