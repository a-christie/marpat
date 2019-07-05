module.exports = {
	env: {
		node: true,
		es6: true
	},
	parserOptions: {
		sourceType: 'module'
	},
	plugins: ['prettier'],
	extends: ['google', 'eslint:recommended', 'prettier'],
	rules: {
		'prettier/prettier': 'error'
	}
};
