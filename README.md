# React components to integrate Braintree hosted fields

A few small React components to make integrating [Braintree's Hosted Fields](https://developers.braintreepayments.com/guides/hosted-fields/) easier.

[![Build Status](https://travis-ci.org/nathanstitt/react-braintree-fields.svg?branch=master)](https://travis-ci.org/nathanstitt/react-braintree-fields)


## Introduction

```javascript
import { Braintree, Field } from 'react-braintree-fields';



<Braintree
    authorization='sandbox_g42y39zw_348pk9cgf3bgyw2b'
    onError={this.handleError}
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
    <div>
        <h3>child</h3>
        <Field type="number" onFocus={onFocus} />
        <Field type="expirationDate" />
    </div>
</Braintree>
```


## Braintree Component

Props:
 * authorization: Required, either a [tokenization key or a client token](https://developers.braintreepayments.com/guides/hosted-fields/setup-and-integration/)
 * styles: Object containing [valid field styles](https://braintree.github.io/braintree-web/3.11.1/module-braintree-web_hosted-fields.html#.create)
 * onError: Function that will be called if an Braintree error is encountered.


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
