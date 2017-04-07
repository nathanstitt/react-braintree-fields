import React from 'react';

import Api from './api';
import fieldClassName from './fieldClassName';

export default class BraintreeHostedField extends React.Component {

    static propTypes = {
        type: React.PropTypes.oneOf([
            'number', 'expirationDate', 'expirationMonth', 'expirationYear', 'cvv', 'postalCode',
        ]).isRequired,
        placeholder: React.PropTypes.string,

        onBlur: React.PropTypes.func,
        onFocus: React.PropTypes.func,
        onEmpty: React.PropTypes.func,
        onNotEmpty: React.PropTypes.func,
        onCardTypeChange: React.PropTypes.func,
        onValidityChange: React.PropTypes.func,
    }

    static contextTypes = {
        braintreeApi: React.PropTypes.instanceOf(Api),
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
