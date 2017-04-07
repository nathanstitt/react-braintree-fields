import Braintree from 'braintree-web/client';
import HostedFields from 'braintree-web/hosted-fields';

function cap(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

export default class BraintreeClientApi {

    constructor({ authorization, onError, styles }) {
        this.fields = {};
        this.handlers = {};
        this.styles = styles || {};
        this.onErrorCallback = onError;

        Braintree.create({ authorization }, (err, clientInstance) => {
            if (err) {
                this.onError(err);
            } else {
                this.clientInstance = clientInstance;
                if (this.isAttachable) { this._attach(); }
            }
        });
    }

    onError(err) {
        if (!err) { return; }
        if (this.onErrorCallback) { this.onErrorCallback(err); }
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

    checkInField(className, { type, placeholder, ...handlers }) {
        this.handlers[type] = handlers;
        this.fields[type] = {
            selector: `.${className}`,
            placeholder,
        };
    }

    onFieldEvent(eventName, event) {
        const fieldHandlers = this.handlers[event.emittedBy];
        if (fieldHandlers && fieldHandlers[eventName]) {
            fieldHandlers[eventName](event);
        }
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
            return this.onError(err);
        });
    }
}
