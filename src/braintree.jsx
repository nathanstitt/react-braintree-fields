import React from 'react';
import PropTypes from 'prop-types';
import Api from './api';

export default class Braintree extends React.Component {

    static propTypes = {
        children: PropTypes.node.isRequired,
        onAuthorizationSuccess: PropTypes.func,
        authorization: PropTypes.string,
        getTokenRef: PropTypes.func,
        onValidityChange: PropTypes.func,
        onCardTypeChange: PropTypes.func,
        onError: PropTypes.func,
        styles: PropTypes.object,
        className: PropTypes.string,
        tagName: PropTypes.string,
    }

    static defaultProps = {
        tagName: 'div',
    }

    static childContextTypes = {
        braintreeApi: PropTypes.instanceOf(Api),
    }

    constructor(props) {
        super(props);
        this.api = new Api(props);
    }

    componentDidMount() {
        this.api.setAuthorization(this.props.authorization, this.props.onAuthorizationSuccess);
        if (this.props.getTokenRef) {
            this.props.getTokenRef(this.api.tokenize.bind(this.api));
        }
    }

    componentWillUnmount() {
        this.api.teardown();
    }

    componentDidUpdate() {
        this.api.setAuthorization(this.props.authorization, this.props.onAuthorizationSuccess);
    }

    tokenize(options) {
        return this.api.tokenize(options);
    }

    getChildContext() {
        return { braintreeApi: this.api };
    }

    render() {
        const { className: providedClass, tagName: Tag } = this.props;
        let className = 'braintree-hosted-fields-wrapper';
        if (providedClass) { className += ` ${providedClass}`; }
        return (
            <Tag className={className}>
                {this.props.children}
            </Tag>
        );
    }

}
