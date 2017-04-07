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
                <Field type="number" onFocus={onFocus} />
                <Field type="expirationDate" />
            </div>
        </Braintree>
    </div>
), document.getElementById('root'));
