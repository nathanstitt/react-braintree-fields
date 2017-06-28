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
        Braintree.create({ authorization }, (err, clientInstance) => {
            if (err) {
                this.onError(err);
            } else {
                this.clientInstance = clientInstance;
                if (this.isAttachable) { this._attach(); }
            }
        });
    }

    nextFieldId() {
        this._nextFieldId += 1;
        return this._nextFieldId;
    }

    onError(err) {
        if (!err) { return; }
        if (this.wrapperHandlers.onError) { this.wrapperHandlers.onError(err); }
    }

    attach() {
        if (this.clientInstance) {
            this._attach();
        } else {
            this.isAttachable = true;
        }
    }

    teardown() {
        if (this.hostedFields) { this.hostedFields.teardown(); }
    }

    checkInField({ formatInput, maxlength, minlength, placeholder, select, type, ...handlers }) {
        const id = `field-wrapper-${this.nextFieldId()}`;
        this.fieldHandlers[type] = handlers;
        this.fields[type] = {
            formatInput,
            maxlength,
            minlength,
            placeholder,
            select,
            selector: `#${id}`,
        };
        return id;
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

    tokenize() {
        return new Promise((resolve, reject) => {
            this.hostedFields.tokenize((err, payload) => {
                if (err) {
                    this.onError(err);
                    reject(err);
                } else {
                    resolve(payload);
                }
            });
        });
    }

    _attach() {
        delete this.isAttachable;
        return HostedFields.create({
            client: this.clientInstance,
            styles: this.styles,
            fields: this.fields,
        }, (err, hostedFields) => {
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
}
