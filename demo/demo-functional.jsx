import { render } from 'react-dom';
import React from 'react';
import { Braintree, HostedField } from '../src/index';

const Demo = () => {
    const [tokenize, setTokenizeFunc] = React.useState()
    const [cardType, setCardType] = React.useState('')
    const [error, setError] = React.useState(null)
    const [token, setToken] = React.useState(null)
    const [focusedFieldName, setFocusedField] = React.useState('')
    const numberField = React.useRef()
    const cvvField = React.useRef();

    const onAuthorizationSuccess = () => {
      numberField.current.focus();
    }

    const onDataCollectorInstanceReady = (collector) => {
        // DO SOMETHING with Braintree collector as needed
    }

    const handleError = (error) => {
        setError(error.message || String(error));
    }

    const onFieldBlur = (field, event) => setFocusedField('')
    const onFieldFocus = (field, event) => setFocusedField(event.emittedBy)

    const onCardTypeChange = ({ cards }) => {
        if (1 === cards.length) {
          const [card] = cards;

          setCardType(card.type);

          if (card.code && card.code.name) {
            cvvField.current.setPlaceholder(card.code.name);
          } else {
            cvvField.current.setPlaceholder('CVV');
          }

        } else {
            setCardType('');
          cvvField.current.setPlaceholder('CVV');
        }
    }

    const getToken = () => {
        tokenize()
            .then(setToken)
            .catch(handleError);
    }

    const renderResult = (title, obj) => {
        if (!obj) { return null; }
        return (
            <div>
                <b>{title}:</b>
                <pre>{JSON.stringify(obj, null, 4)}</pre>
            </div>
        );
    }

    return (
        <div>
            <Braintree
                className="demo"
                authorization='sandbox_g42y39zw_348pk9cgf3bgyw2b'
                onAuthorizationSuccess={onAuthorizationSuccess}
                onDataCollectorInstanceReady={onDataCollectorInstanceReady}
                onError={handleError}
                onCardTypeChange={onCardTypeChange}
                getTokenRef={ref => setTokenizeFunc(() => ref)}
                styles={{
                    'input': {
                        'font-size': 'inherit',
                    },
                    ':focus': {
                        'color': 'blue'
                    },
                }}
            >
                {renderResult('Error', error)}
                {renderResult('Token', token)}

                <div>
                    Number:
                    <HostedField
                        type="number"
                        className={focusedFieldName == 'number' ? 'focused' : ''}
                        onBlur={onFieldBlur}
                        onFocus={onFieldFocus}
                        prefill="4111 1111 1111 1111"
                        ref={numberField}
                    />
                    <p>Card type: {cardType}</p>
                    Date:
                    <HostedField
                        type="expirationDate"
                        onBlur={onFieldBlur}
                        onFocus={onFieldFocus}
                        className={focusedFieldName == 'expirationDate' ? 'focused' : ''}
                    />
                    Month:
                    <HostedField type="expirationMonth" />
                    Year:
                    <HostedField type="expirationYear" />
                    CVV:
                    <HostedField type="cvv" placeholder="CVV" ref={cvvField} />
                    Zip:
                    <HostedField type="postalCode" />
                </div>

            </Braintree>
            <div className="footer">
                <button onClick={getToken}>Get nonce token</button>
            </div>
        </div>
    )

}

export default Demo;
