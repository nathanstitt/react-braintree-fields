import { render } from 'react-dom';
import React from 'react';

import { Braintree, Field } from './src/index';

function onFocus(ev) {

}
render((
    <div>
        <h1>Braintree Hosted Fields Demo</h1>
        <Braintree
            authorization='sandbox_g42y39zw_348pk9cgf3bgyw2b'
            onError={console.log}
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
                Number:
                <Field type="number" onFocus={onFocus} />
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
    </div>
), document.getElementById('root'));
