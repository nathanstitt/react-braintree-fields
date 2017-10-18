import React from 'react';
import PropTypes from 'prop-types';
import Braintree from 'braintree-web/client';
import HostedFields from 'braintree-web/hosted-fields';

var classCallCheck = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};

var createClass = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
}();









var inherits = function (subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
  }

  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      enumerable: false,
      writable: true,
      configurable: true
    }
  });
  if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
};









var objectWithoutProperties = function (obj, keys) {
  var target = {};

  for (var i in obj) {
    if (keys.indexOf(i) >= 0) continue;
    if (!Object.prototype.hasOwnProperty.call(obj, i)) continue;
    target[i] = obj[i];
  }

  return target;
};

var possibleConstructorReturn = function (self, call) {
  if (!self) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return call && (typeof call === "object" || typeof call === "function") ? call : self;
};

function cap(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

var BraintreeClientApi = function () {
    function BraintreeClientApi(_ref) {
        var authorization = _ref.authorization,
            styles = _ref.styles,
            onAuthorizationSuccess = _ref.onAuthorizationSuccess,
            callbacks = objectWithoutProperties(_ref, ['authorization', 'styles', 'onAuthorizationSuccess']);
        classCallCheck(this, BraintreeClientApi);
        this.fields = {};
        this._nextFieldId = 1;
        this.fieldHandlers = {};

        this.styles = styles || {};
        this.wrapperHandlers = callbacks || {};
        this.setAuthorization(authorization, onAuthorizationSuccess);
    }

    createClass(BraintreeClientApi, [{
        key: 'setAuthorization',
        value: function setAuthorization(authorization, onAuthorizationSuccess) {
            var _this = this;

            if (!authorization && this.authorization) {
                this.teardown();
            } else if (authorization && authorization !== this.authorization) {
                if (this.authorization) {
                    this.teardown();
                }
                this.authorization = authorization;
                Braintree.create({ authorization: authorization }, function (err, clientInstance) {
                    if (err) {
                        _this.onError(err);
                    } else {
                        _this.create(clientInstance, onAuthorizationSuccess);
                    }
                });
            }
        }
    }, {
        key: 'nextFieldId',
        value: function nextFieldId() {
            this._nextFieldId += 1;
            return this._nextFieldId;
        }
    }, {
        key: 'onError',
        value: function onError(err) {
            if (!err) {
                return;
            }
            if (this.wrapperHandlers.onError) {
                this.wrapperHandlers.onError(err);
            }
        }
    }, {
        key: 'create',
        value: function create(client, onAuthorizationSuccess) {
            var _this2 = this;

            HostedFields.create({
                client: client,
                styles: this.styles,
                fields: this.fields
            }, function (err, hostedFields) {
                if (err) {
                    _this2.onError(err);
                    return;
                }
                _this2.hostedFields = hostedFields;
                ['blur', 'focus', 'empty', 'notEmpty', 'cardTypeChange', 'validityChange'].forEach(function (eventName) {
                    hostedFields.on(eventName, function (ev) {
                        return _this2.onFieldEvent('on' + cap(eventName), ev);
                    });
                });
                _this2.onError(err);

                if (onAuthorizationSuccess) {
                    onAuthorizationSuccess();
                }
            });
        }
    }, {
        key: 'teardown',
        value: function teardown() {
            if (this.hostedFields) {
                this.hostedFields.teardown();
            }
        }
    }, {
        key: 'checkInField',
        value: function checkInField(_ref2) {
            var formatInput = _ref2.formatInput,
                maxlength = _ref2.maxlength,
                minlength = _ref2.minlength,
                placeholder = _ref2.placeholder,
                select = _ref2.select,
                type = _ref2.type,
                handlers = objectWithoutProperties(_ref2, ['formatInput', 'maxlength', 'minlength', 'placeholder', 'select', 'type']);

            var id = 'field-wrapper-' + this.nextFieldId();
            this.fieldHandlers[type] = handlers;
            this.fields[type] = {
                formatInput: formatInput,
                maxlength: maxlength,
                minlength: minlength,
                placeholder: placeholder,
                select: select,
                selector: '#' + id
            };
            return id;
        }
    }, {
        key: 'focusField',
        value: function focusField(fieldType, cb) {
            this.hostedFields.focus(fieldType, cb);
        }
    }, {
        key: 'clearField',
        value: function clearField(fieldType, cb) {
            this.hostedFields.clear(fieldType, cb);
        }
    }, {
        key: 'onFieldEvent',
        value: function onFieldEvent(eventName, event) {
            var fieldHandlers = this.fieldHandlers[event.emittedBy];
            if (fieldHandlers && fieldHandlers[eventName]) {
                fieldHandlers[eventName](event.fields[event.emittedBy], event);
            }
            if (this.wrapperHandlers[eventName]) {
                this.wrapperHandlers[eventName](event);
            }
        }
    }, {
        key: 'tokenize',
        value: function tokenize() {
            var _this3 = this;

            var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

            return new Promise(function (resolve, reject) {
                _this3.hostedFields.tokenize(options, function (err, payload) {
                    if (err) {
                        _this3.onError(err);
                        reject(err);
                    } else {
                        resolve(payload);
                    }
                });
            });
        }
    }]);
    return BraintreeClientApi;
}();

var _class;
var _temp;

var Braintree$1 = (_temp = _class = function (_React$Component) {
    inherits(Braintree$$1, _React$Component);

    function Braintree$$1(props) {
        classCallCheck(this, Braintree$$1);

        var _this = possibleConstructorReturn(this, (Braintree$$1.__proto__ || Object.getPrototypeOf(Braintree$$1)).call(this, props));

        _this.api = new BraintreeClientApi(props);
        return _this;
    }

    createClass(Braintree$$1, [{
        key: 'componentDidMount',
        value: function componentDidMount() {
            this.api.setAuthorization(this.props.authorization, this.props.onAuthorizationSuccess);
            if (this.props.getTokenRef) {
                this.props.getTokenRef(this.api.tokenize.bind(this.api));
            }
        }
    }, {
        key: 'componentWillUnmount',
        value: function componentWillUnmount() {
            this.api.teardown();
        }
    }, {
        key: 'componentWillReceiveProps',
        value: function componentWillReceiveProps(nextProps) {
            this.api.setAuthorization(nextProps.authorization, this.props.onAuthorizationSuccess);
        }
    }, {
        key: 'tokenize',
        value: function tokenize(options) {
            return this.api.tokenize(options);
        }
    }, {
        key: 'getChildContext',
        value: function getChildContext() {
            return { braintreeApi: this.api };
        }
    }, {
        key: 'render',
        value: function render() {
            var _props = this.props,
                providedClass = _props.className,
                Tag = _props.tagName;

            var className = 'braintree-hosted-fields-wrapper';
            if (providedClass) {
                className += ' ' + providedClass;
            }
            return React.createElement(
                Tag,
                { className: className },
                this.props.children
            );
        }
    }]);
    return Braintree$$1;
}(React.Component), _class.propTypes = {
    children: PropTypes.node.isRequired,
    onAuthorizationSuccess: PropTypes.func,
    authorization: PropTypes.string,
    getTokenRef: PropTypes.func,
    onValidityChange: PropTypes.func,
    onCardTypeChange: PropTypes.func,
    onError: PropTypes.func,
    styles: PropTypes.object,
    className: PropTypes.string,
    tagName: PropTypes.string
}, _class.defaultProps = {
    tagName: 'div'
}, _class.childContextTypes = {
    braintreeApi: PropTypes.instanceOf(BraintreeClientApi)
}, _temp);

var _class$1;
var _temp$1;

var BraintreeHostedField = (_temp$1 = _class$1 = function (_React$Component) {
    inherits(BraintreeHostedField, _React$Component);

    function BraintreeHostedField() {
        classCallCheck(this, BraintreeHostedField);
        return possibleConstructorReturn(this, (BraintreeHostedField.__proto__ || Object.getPrototypeOf(BraintreeHostedField)).apply(this, arguments));
    }

    createClass(BraintreeHostedField, [{
        key: 'focus',
        value: function focus() {
            this.context.braintreeApi.focusField(this.props.type);
        }
    }, {
        key: 'clear',
        value: function clear() {
            this.context.braintreeApi.clearField(this.props.type);
        }
    }, {
        key: 'componentWillMount',
        value: function componentWillMount() {
            this.fieldId = this.context.braintreeApi.checkInField(this.props);
        }
    }, {
        key: 'render',
        value: function render() {
            return React.createElement('div', { id: this.fieldId, className: this.className });
        }
    }, {
        key: 'className',
        get: function get$$1() {
            var list = ['braintree-hosted-field'];
            if (this.props.className) {
                list.push(this.props.className);
            }
            return list.join(' ');
        }
    }]);
    return BraintreeHostedField;
}(React.Component), _class$1.propTypes = {
    type: PropTypes.oneOf(['number', 'expirationDate', 'expirationMonth', 'expirationYear', 'cvv', 'postalCode']).isRequired,
    placeholder: PropTypes.string,
    className: PropTypes.string,
    onCardTypeChange: PropTypes.func,
    onValidityChange: PropTypes.func,
    onNotEmpty: PropTypes.func,
    onFocus: PropTypes.func,
    onEmpty: PropTypes.func,
    onBlur: PropTypes.func
}, _class$1.contextTypes = {
    braintreeApi: PropTypes.instanceOf(BraintreeClientApi)
}, _temp$1);

export { Braintree$1 as Braintree, BraintreeHostedField as HostedField };
//# sourceMappingURL=build.module.js.map
