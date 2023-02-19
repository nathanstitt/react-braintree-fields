module.exports = {
    presets: [
        '@babel/preset-react',
        [
            '@babel/preset-env', {
                loose: true,
                targets: {
                    esmodules: true,
                },
            },
        ],
    ],
    plugins: [
        ['@babel/plugin-proposal-class-properties', { loose: true }],
    ],
};
