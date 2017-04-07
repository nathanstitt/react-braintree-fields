import React from 'react';
import PropTypes from 'prop-types';
import Api from './api';
import fieldClassName from './fieldClassName';

export default class BraintreeHostedField extends React.Component {

    static propTypes = {
        type: PropTypes.oneOf([
            'number', 'expirationDate', 'expirationMonth', 'expirationYear', 'cvv', 'postalCode',
        ]).isRequired,
        placeholder: PropTypes.string,
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
        this.className = fieldClassName(props.type);
    }

    componentDidMount() {
        //Object.assign(
        this.context.braintreeApi.checkInField(this.className, this.props);
    }

    render() {
        return <div className={this.className} />;
    }
}
