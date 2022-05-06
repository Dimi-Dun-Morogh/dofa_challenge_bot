module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: './tsconfig.eslint.json'
  },
  plugins: [
    '@typescript-eslint',
  ],
  env: {
    es6: true,
    node: true,
  },
  extends: [
    'airbnb-typescript/base'
  ],
  rules: {
    "consistent-return": "off",
    // "no-console": "off",
    "import/prefer-default-export": "off",
    "no-return-assign": "off",
    "no-underscore-dangle": "off",
    "@typescript-eslint/naming-convention": "off",
    "no-await-in-loop": "off",
    "no-nested-ternary": "off",
    "no-param-reassign": "off",
    "class-methods-use-this": "off"
  },
  ignorePatterns: ['.eslintrc.js', '**/front_end']
};