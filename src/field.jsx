import React from 'react';
import PropTypes from 'prop-types';
import Api from './api';
import fieldSelector from './field-selector';

export default class BraintreeHostedField extends React.Component {

    static propTypes = {
        type: PropTypes.oneOf([
            'number', 'expirationDate', 'expirationMonth', 'expirationYear', 'cvv', 'postalCode',
        ]).isRequired,
        placeholder: PropTypes.string,
        className: PropTypes.string,
        onBlur: PropTypes.func,
        onFocus: PropTypes.func,
        onEmpty: PropTypes.func,
        onNotEmpty: PropTypes.func,
        onCardTypeChange: PropTypes.func,
        onValidityChange: PropTypes.func,
    }

    static contextTypes = {
        braintreeApi: PropTypes.instanceOf(Api),
    }

    constructor(props) {
        super(props);
        this.selector = fieldSelector(props.type);
    }

    componentDidMount() {
        this.context.braintreeApi.checkInField(`#${this.selector}`, this.props);
    }


    get className() {
        const list = ['braintree-hosted-field'];
        if (this.props.className) { list.push(this.props.className); }
        return list.join(' ');
    }

    render() {
        return <div id={this.selector} className={this.className} />;
    }
}
