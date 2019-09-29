module.exports = {
	env: {
		node: true,
		es6: true
	},
	parserOptions: {
		ecmaVersion: '2019'
		sourceType: 'module'
	},
	plugins: ['prettier'],
	extends: ['google', 'eslint:recommended', 'prettier'],
	rules: {
		'prettier/prettier': 'error'
	}
};
