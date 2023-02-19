import React from "react";
import { createRoot } from 'react-dom/client'
import { act, render } from "@testing-library/react";
//import userEvent from '@testing-library/user-event'
import "@testing-library/jest-dom";
import pretty from "pretty";
// import React from 'react';
// import { mount, shallow } from 'enzyme';
// import renderer from 'react-test-renderer';
import BraintreeClient from "braintree-web/client";
import HostedFields from "braintree-web/hosted-fields";
import { Braintree, HostedField } from "../src/index.js";

jest.mock("braintree-web/client");
jest.mock("braintree-web/hosted-fields");
jest.useFakeTimers();

let getToken;

const buildTree = ({
  styles = {},
  props = {},
  getInstance,
  authorization = "sandbox_g42y39zw_348pk9cgf3bgyw2b",
  onAuthorizationSuccess = () => {},
} = {}) => (
  <Braintree
    ref={getInstance}
    className="braintree-test"
    onAuthorizationSuccess={onAuthorizationSuccess}
    authorization={authorization}
    styles={styles}
    getTokenRef={(ref) => (getToken = ref)}
  >
    <HostedField
      type="cardholderName"
      placeholder="name"
      {...props.cardholderName}
    />
    <HostedField type="number" placeholder="cc #" {...props.number} />
    <HostedField
      type="expirationDate"
      placeholder="date"
      {...props.expirationDate}
    />
    <HostedField
      type="expirationMonth"
      placeholder="month"
      {...props.expirationMonth}
    />
    <HostedField
      type="expirationYear"
      placeholder="year"
      {...props.expirationYear}
    />
    <HostedField type="cvv" placeholder="cvv" {...props.cvv} />
    <HostedField type="postalCode" placeholder="zip" {...props.postalCode} />
  </Braintree>
);

describe("Braintree hosted fields", () => {
    beforeEach(() => {
        HostedFields.create = jest.fn((args, cb) =>
            cb(null, {
                on: jest.fn(),
                teardown: jest.fn(),

            })
        );

    });
    afterEach(() => {
        BraintreeClient.create.mockClear();
        HostedFields.create.mockClear();
    });

    it("renders and matches snapshot", () => {
        const container = document.createElement("div");
        document.body.appendChild(container);
        let root
        act(() => {
            root = createRoot(container)
            root.render(buildTree())
        });
        expect(pretty(container.innerHTML)).toMatchSnapshot()
        act(() => root.unmount())
    });

    it("registers when mounted", () => {
        render(buildTree());

        jest.runAllTimers();
        expect(BraintreeClient.create).toHaveBeenCalledWith(
            expect.objectContaining({
                authorization: "sandbox_g42y39zw_348pk9cgf3bgyw2b",
            }),
            expect.anything()
        );
    });

    it("registers an onAuthorizationSuccess callback when passed", () => {
        BraintreeClient.create = jest.fn((args, cb) => cb(null, jest.fn()));

        const onAuthorizationSuccess = jest.fn();
        render(buildTree({ onAuthorizationSuccess }));
        jest.runAllTimers();
        expect(onAuthorizationSuccess.mock.calls.length).toEqual(1);
    });

    it("sets styles", () => {
        let instance;
        const styles = { input: { "font-size": "18px" } };
        render(buildTree({ styles, getInstance: (ref) => { instance = ref } }));
        expect(instance.api.styles).toEqual(styles);
    });

    it("forwards events to fields", () => {
        const onFocus = jest.fn();
        let instance;
        render(buildTree({ props: { number: { onFocus } }, getInstance: (ref) => {
            instance = ref
        } }) );

        instance.api.onFieldEvent("onFocus", {
            emittedBy: "number",
            fields: { number: { foo: "bar" } },
        });
        expect(onFocus).toHaveBeenCalledWith({ foo: "bar" }, expect.anything());
    });

    it("can set token ref during render", () => {
        const clientInstance = jest.fn();
        BraintreeClient.create = jest.fn((args, cb) => cb(null, clientInstance));
        render(buildTree({ authorization: "onetwothree" }));
        jest.runAllTimers();
        expect(BraintreeClient.create).toHaveBeenCalledWith(
            { authorization: "onetwothree" },
            expect.any(Function)
        );
        expect(HostedFields.create.mock.calls).toMatchSnapshot();
    });

    it("can set token ref after render", () => {
        const styles = { foo: "bar" };

        const { rerender } = render(buildTree({ styles, authorization: "" }));
        jest.runAllTimers();

        const clientInstance = jest.fn();
        BraintreeClient.create = jest.fn((args, cb) => cb(null, clientInstance));
        expect(BraintreeClient.create).not.toHaveBeenCalled();
        expect(HostedFields.create).not.toHaveBeenCalled();

        rerender(buildTree({ styles, authorization: "blahblahblah" }));
        expect(BraintreeClient.create).toHaveBeenCalledWith(
            { authorization: "blahblahblah" },
            expect.any(Function)
        );
        expect(HostedFields.create.mock.calls).toMatchSnapshot();
    });
});
