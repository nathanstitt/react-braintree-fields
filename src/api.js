import Braintree from 'braintree-web/client';
import HostedFields from 'braintree-web/hosted-fields';

function cap(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

export default class BraintreeClientApi {
    fields = {};

    _nextFieldId = 1;

    fieldHandlers = {};

    constructor({ authorization, styles, ...callbacks }) {
        this.styles = styles || {};
        this.wrapperHandlers = callbacks || {};
        this.setAuthorization(authorization);
    }

    setAuthorization(authorization) {
        if (!authorization && this.authorization) {
            this.teardown();
        } else if (authorization && authorization !== this.authorization) {
            if (this.authorization) { this.teardown(); }
            this.authorization = authorization;
            Braintree.create({ authorization }, (err, clientInstance) => {
                if (err) {
                    this.onError(err);
                } else {
                    this.create(clientInstance);
                }
            });
        }
    }

    nextFieldId() {
        this._nextFieldId += 1;
        return this._nextFieldId;
    }

    onError(err) {
        if (!err) { return; }
        if (this.wrapperHandlers.onError) { this.wrapperHandlers.onError(err); }
    }

    create(client) {
        HostedFields.create({
            client,
            styles: this.styles,
            fields: this.fields,
        }, (err, hostedFields) => {
            if (err) {
                this.onError(err);
                return;
            }
            this.hostedFields = hostedFields;
            [
                'blur', 'focus', 'empty', 'notEmpty',
                'cardTypeChange', 'validityChange',
            ].forEach((eventName) => {
                hostedFields.on(eventName, ev => this.onFieldEvent(`on${cap(eventName)}`, ev));
            });
            this.onError(err);
        });
    }

    teardown() {
        if (this.hostedFields) { this.hostedFields.teardown(); }
    }

    checkInField({ type, placeholder, ...handlers }) {
        const id = `field-wrapper-${this.nextFieldId()}`;
        this.fieldHandlers[type] = handlers;
        this.fields[type] = {
            selector: `#${id}`,
            placeholder,
        };
        return id;
    }

    focusField(fieldType, cb) {
        this.hostedFields.focus(fieldType, cb);
    }

    clearField(fieldType, cb) {
        this.hostedFields.clear(fieldType, cb);
    }

    onFieldEvent(eventName, event) {
        const fieldHandlers = this.fieldHandlers[event.emittedBy];
        if (fieldHandlers && fieldHandlers[eventName]) {
            fieldHandlers[eventName](event.fields[event.emittedBy], event);
        }
        if (this.wrapperHandlers[eventName]) {
            this.wrapperHandlers[eventName](event);
        }
    }

    tokenize(options = {}) {
        return new Promise((resolve, reject) => {
            this.hostedFields.tokenize(options, (err, payload) => {
                if (err) {
                    this.onError(err);
                    reject(err);
                } else {
                    resolve(payload);
                }
            });
        });
    }
}
