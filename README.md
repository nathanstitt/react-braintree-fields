# React components to integrate Braintree hosted fields

A few small React components to make integrating [Braintree's Hosted Fields](https://developers.braintreepayments.com/guides/hosted-fields/) easier.

[![Build Status](https://travis-ci.org/nathanstitt/react-braintree-fields.svg?branch=master)](https://travis-ci.org/nathanstitt/react-braintree-fields)


## Introduction

```javascript
import { Braintree, Field } from 'react-braintree-fields';

let getToken;
function onSubmit() {
   getToken().then((payload) => {
     console.log("nonce=" , payload.nonce)
   })
}
<Braintree
    authorization='sandbox_g42y39zw_348pk9cgf3bgyw2b'
    onError={this.handleError}
    onCardTypeChange={this.onCardTypeChange}
    getTokenRef={ref => (getToken = ref)}
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
        <Field type="number" onFocus={onFocus} />
        <Field type="expirationDate" />
        <Field type="cvv" />
    </div>
    <button onClick={onSubmit}>Submit</button>
</Braintree>


```

See [demo.jsx](demo.jsx) for a more complete working example.

## Braintree Component

Props:
 * authorization: Required, either a [tokenization key or a client token](https://developers.braintreepayments.com/guides/hosted-fields/setup-and-integration/)
 * styles: Object containing [valid field styles](https://braintree.github.io/braintree-web/3.11.1/module-braintree-web_hosted-fields.html#.create)
 * onError: Function that will be called if an Braintree error is encountered.
 * getTokenRef: A function that will be called once Braintree the API is initialized.  It will be called with a function that can be used to initiate tokenization.
   * The tokenization function will return a Promise which will be either resolved or rejected.  If resolved, the promise payload will contain an object with the `nonce` and other data from Braintree.

## Field Component

Props:
  * type: Required, one of:
    - 'number', 'expirationDate', 'expirationMonth', 'expirationYear', 'cvv', 'postalCode'
  * onBlur
  * onFocus
  * onEmpty
  * onNotEmpty
  * onValidityChange
  * onCardTypeChange - accepted on any field, but will only be called by type="number"
