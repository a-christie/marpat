module.exports = {
	env: {
		node: true,
		es6: true
	},
	parserOptions: {
		ecmaVersion: '2019',
		sourceType: 'module'
	},
	plugins: ['prettier'],
	extends: ['google', 'eslint:recommended', 'prettier'],
	rules: {
		'new-cap': 0,
		'require-jsdoc': [
			'error',
			{
				require: {
					ArrowFunctionExpression: true
				}
			}
		],
		'prettier/prettier': 'error'
	}
};
