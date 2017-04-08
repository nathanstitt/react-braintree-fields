import React from 'react';
import PropTypes from 'prop-types';
import invariant from 'invariant';
import Api from './api';

export default class Braintree extends React.Component {

    static propTypes = {
        children: PropTypes.element.isRequired,
        authorization: PropTypes.string.isRequired,
        onValidityChange: PropTypes.func,
        onCardTypeChange: PropTypes.func,
        onError: PropTypes.func,
        styles: PropTypes.object,
    }

    static childContextTypes = {
        braintreeApi: PropTypes.instanceOf(Api),
    }

    componentWillReceiveProps(nextProps) {
        invariant(nextProps.authorization === this.props.authorization,
                  'Cannot update authorization after mounted');
    }

    constructor(props) {
        super(props);
        this.api = new Api(props);
    }

    componentDidMount() {
        this.api.attach();
    }

    componentWillUnmount() {
        this.api.teardown();
    }

    getChildContext() {
        return { braintreeApi: this.api };
    }

    render() {
        return this.props.children;
    }

}
