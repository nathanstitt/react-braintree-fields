import babel from 'rollup-plugin-babel';

const pkg = require('./package.json');

const external = Object.keys(pkg.dependencies).concat(
    ['react', 'prop-types', 'braintree-web/client', 'braintree-web/hosted-fields'],
);

export default {
    entry: 'src/index.js',
    plugins: [
        babel({
            babelrc: true,
            exclude: 'node_modules/**',
            presets: [['es2015', { modules: false }], 'react', 'es2015-rollup'],
            plugins: [
                'transform-decorators-legacy',
                'transform-class-properties',
                'transform-object-rest-spread',
            ],
        }),
    ],
    globals: {
        react: 'React',
        invariant: 'invariant',
        'prop-types': 'PropTypes',
        'braintree-web/client': 'Braintree',
        'braintree-web/hosted-fields': 'HostedFields',
    },
    external,
    targets: [
        {
            dest: pkg.main,
            format: 'umd',
            moduleName: 'react-braintree-fields',
            sourceMap: true,
        }, {
            dest: pkg.module,
            format: 'es',
            sourceMap: true,
        },
    ],
};
