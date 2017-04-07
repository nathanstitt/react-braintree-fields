import React from 'react';
import { mount, shallow } from 'enzyme';
import renderer from 'react-test-renderer';
import BraintreeClient from 'braintree-web/client';
import { Braintree, Field } from '../src/index.js';

jest.mock('braintree-web/client');
jest.mock('../src/fieldClassName', () => type => `field-${type}-1`);

const buildTree = (style = {}, props = {}) => (
    <Braintree
        authorization='sandbox_g42y39zw_348pk9cgf3bgyw2b'
        styles={style}
    >
        <div>
            <Field type="number"          placeholder="cc #"  {...props.number}          />
            <Field type="expirationDate"  placeholder="date"  {...props.expirationDate}  />
            <Field type="expirationMonth" placeholder="month" {...props.expirationMonth} />
            <Field type="expirationYear"  placeholder="year"  {...props.expirationYear}  />
            <Field type="cvv"             placeholder="cvv"   {...props.cvv}             />
            <Field type="postalCode"      placeholder="zip"   {...props.postalCode}      />
        </div>
    </Braintree>
);

describe('Braintree hosted fields', () => {
    it('renders and matches snapshot', () => {
        expect(renderer.create(buildTree())).toMatchSnapshot();
    });

    it('registers when mounted', () => {
        mount(buildTree());
        expect(BraintreeClient.create).toHaveBeenCalledWith(expect.objectContaining({
            authorization: 'sandbox_g42y39zw_348pk9cgf3bgyw2b',
        }), expect.anything());
    });

    it('sets styles', () => {
        const style = { input: { 'font-size': '18px' } };
        const client = shallow(buildTree(style));
        expect(client.instance().api.styles).toEqual(style);
    });

    it('forwards events to fields', () => {
        const onFocus = jest.fn();
        const client = mount(buildTree({}, { number: { onFocus } }));
        const { api } = client.instance();
        api.onFieldEvent('onFocus', { emittedBy: 'number' });
        expect(onFocus).toHaveBeenCalled();
    });
});
