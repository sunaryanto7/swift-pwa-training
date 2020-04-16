const fs = require("fs");
const path = require("path");
const projectPath = path.resolve(__dirname, "./");

module.exports = {
    env: {
        browser: true,
        es6: true,
    },
    extends: 'airbnb',
    globals: {
        Atomics: 'readonly',
        SharedArrayBuffer: 'readonly',
    },
    parserOptions: {
        ecmaFeatures: {
            jsx: true,
        },
        ecmaVersion: 2018,
        sourceType: 'module',
    },
    plugins: ['react'],
    rules: {
        'indent': ['error', 4],
        'react/jsx-indent': ['error', 4],
        'react/jsx-indent-props': ['error', 4],
        'react/jsx-filename-extension': [1, { extensions: ['.js', '.jsx'] }],
        'react/jsx-props-no-spreading': 'off',
        "react/prop-types": 0,
        'react/no-array-index-key': 0,
        'max-len': ['error', { code: 150, ignoreComments: true }],
    },
    settings: {
        'import/parser': 'babel-eslint',
        'import/resolver': 'eslint-import-resolver-babel-module',
    },
};