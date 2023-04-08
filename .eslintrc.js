module.exports = {
  root: true,
  env: {
    node: true
  },
  'extends': [
    'plugin:vue/essential',
    '@vue/airbnb',
    '@vue/prettier'
  ],
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'import/extensions': "off",
    "import/no-dynamic-require": 0,
    "no-unused-vars": ["error", { "args": "none" }],
    "import/no-unresolved": [
      2,
      {
        ignore: ["^@/"], // @ 是设置的路径别名
      },
    ],
  },
  parserOptions: {
    parser: 'babel-eslint'
  }
}