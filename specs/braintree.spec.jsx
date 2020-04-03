import React from 'react';
import { mount, shallow } from 'enzyme';
import renderer from 'react-test-renderer';
import BraintreeClient from 'braintree-web/client';
import HostedFields from 'braintree-web/hosted-fields';
import { Braintree, HostedField } from '../src/index.js';

jest.mock('braintree-web/client');
jest.mock('braintree-web/hosted-fields');
jest.useFakeTimers();

let getToken;

const buildTree = (
    { styles = {}, props = {}, authorization = 'sandbox_g42y39zw_348pk9cgf3bgyw2b', onAuthorizationSuccess = () => {} } = {}
) => (
    <Braintree
        className="braintree-test"
        onAuthorizationSuccess={onAuthorizationSuccess}
        authorization={authorization}
        styles={styles}
        getTokenRef={ref => (getToken = ref)}
    >
        <HostedField type="number"          placeholder="cc #"  {...props.number}          />
        <HostedField type="expirationDate"  placeholder="date"  {...props.expirationDate}  />
        <HostedField type="expirationMonth" placeholder="month" {...props.expirationMonth} />
        <HostedField type="expirationYear"  placeholder="year"  {...props.expirationYear}  />
        <HostedField type="cvv"             placeholder="cvv"   {...props.cvv}             />
        <HostedField type="postalCode"      placeholder="zip"   {...props.postalCode}      />
    </Braintree>
);

describe('Braintree hosted fields', () => {
    beforeEach(() => {

    });
    afterEach(() => {
        BraintreeClient.create.mockClear();
        HostedFields.create.mockClear();
    });
    it('renders and matches snapshot', () => {
        expect(renderer.create(buildTree())).toMatchSnapshot();
    });

    it('registers when mounted', () => {
        mount(buildTree());
        jest.runAllTimers();
        expect(BraintreeClient.create).toHaveBeenCalledWith(expect.objectContaining({
            authorization: 'sandbox_g42y39zw_348pk9cgf3bgyw2b',
        }), expect.anything());
    });

    it('registers an onAuthorizationSuccess callback when passed', () => {
        BraintreeClient.create = jest.fn((args, cb) => cb(null, jest.fn()));
        HostedFields.create = jest.fn((args, cb) => cb(null, {
            on: jest.fn(),
        }));
        const onAuthorizationSuccess = jest.fn();
        mount(buildTree({ onAuthorizationSuccess }));
        jest.runAllTimers();
        expect(onAuthorizationSuccess.mock.calls.length).toEqual(1);
    });

    it('sets styles', () => {
        const styles = { input: { 'font-size': '18px' } };
        const client = shallow(buildTree({ styles }));
        expect(client.instance().api.styles).toEqual(styles);
    });

    it('forwards events to fields', () => {
        const onFocus = jest.fn();
        const client = mount(buildTree({ props: { number: { onFocus } } }));
        const { api } = client.instance();
        api.onFieldEvent('onFocus', { emittedBy: 'number', fields: { number: { foo: 'bar' } } });
        expect(onFocus).toHaveBeenCalledWith({ foo: 'bar' }, expect.anything());
    });

    it('can set token ref during render', () => {
        const clientInstance = jest.fn();
        BraintreeClient.create = jest.fn((args, cb) => cb(null, clientInstance));
        mount(buildTree({ authorization: 'onetwothree' }));
        jest.runAllTimers();
        expect(BraintreeClient.create).toHaveBeenCalledWith(
            { authorization: 'onetwothree' }, expect.any(Function),
        );
        expect(HostedFields.create.mock.calls).toMatchSnapshot();
    });

    it('can set token ref after render', () => {
        const styles = { foo: 'bar' };
        const fields = mount(buildTree({ styles, authorization: '' }));
        jest.runAllTimers();
        const clientInstance = jest.fn();
        BraintreeClient.create = jest.fn((args, cb) => cb(null, clientInstance));
        expect(BraintreeClient.create).not.toHaveBeenCalled();
        expect(HostedFields.create).not.toHaveBeenCalled();

        fields.setProps({ authorization: 'blahblahblah' });
        expect(BraintreeClient.create).toHaveBeenCalledWith(
            { authorization: 'blahblahblah' }, expect.any(Function),
        );
        expect(HostedFields.create.mock.calls).toMatchSnapshot();
    });
});
