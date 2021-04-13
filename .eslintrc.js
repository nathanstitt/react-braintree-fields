module.exports = {

    "extends": "eslint:recommended",
    "parser": "babel-eslint",
	"parserOptions": {
		"ecmaVersion": 6,
		"sourceType": "module"
	},
    "env": {
        "browser": true,
        "amd": true,
        "node": true
    },
    rules: {
        'no-underscore-dangle': 0,
    },
};
