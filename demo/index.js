import { render } from 'react-dom';
import React from 'react';
import { Braintree, HostedField } from '../src/index';
import Demo from './demo-class.jsx'
//import Demo from './demo-functional.jsx'

render(React.createElement(Demo), document.getElementById('root'));
