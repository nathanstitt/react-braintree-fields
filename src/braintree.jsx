import React from 'react';
import invariant from 'invariant';
import Api from './api';

export default class Braintree extends React.Component {

    static propTypes = {
        children: React.PropTypes.node.isRequired,
        authorization: React.PropTypes.string.isRequired,
        styles: React.PropTypes.object,
        onError: React.PropTypes.func,
    }

    static childContextTypes = {
        braintreeApi: React.PropTypes.instanceOf(Api),
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
        // if (this.pendingAttach) {
        //     clearTimeout(this.pendingAttach);
        // } else {
        this.api.teardown();
//        }
    }

    getChildContext() {
        return { braintreeApi: this.api };
    }

    render() {
        return this.props.children;
    }

}
