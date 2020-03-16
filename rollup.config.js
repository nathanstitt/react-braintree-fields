import babel from 'rollup-plugin-babel';

const pkg = require('./package.json');

const external = ['react', 'prop-types', 'braintree-web/data-collector', 'braintree-web/client', 'braintree-web/hosted-fields'];

const plugins = [
    babel({
        babelrc: true,
        // exclude: 'node_modules/**',
        // presets: [['es2015', { modules: false }], 'react', 'es2015-rollup'],
        // plugins: [
        //     '@babel/transform-class-properties',
        //     'transform-object-rest-spread',
        // ],
    }),
];

const globals = {
    react: 'React',
    invariant: 'invariant',
    'prop-types': 'PropTypes',
    'braintree-web/client': 'Braintree',
    'braintree-web/hosted-fields': 'BraintreeHostedFields',
    'braintree-web/data-collector': 'BraintreeDataCollector',
};

const input = 'src/index.js';

export default [
    {
        input,
        plugins,
        external,
        output: {
            format: 'umd',
            name: 'react-braintree-fields',
            sourceMap: true,
            file: pkg.browser,
            globals,
        },
    }, {
        input,
        plugins,
        external,
        output: {
            format: 'es',
            sourceMap: true,
            file: pkg.module,
            globals,
        },
    },
];
