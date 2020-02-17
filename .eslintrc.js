module.exports = {
    'env': {
        'commonjs': true,
        'es6': true,
        'node': true,
        'browser': true
    },
    'extends': ['eslint:recommended'],
    'globals': {
        'Atomics': 'readonly',
        'SharedArrayBuffer': 'readonly',
        'WebAssembly': 'readonly',
        'Go': 'readonly',
        'self': 'readonly',
        'performance': 'readonly',
        'crypto': 'readonly',
        'fs': 'readonly',
        'ENV': 'readonly',
        '__IS_WEB__': 'readonly',
        '__IS_NODE__': 'readonly'
    },
    parser: "babel-eslint",
    'parserOptions': {
        'sourceType': 'module',
        'ecmaVersion': 2018
    },
    'rules': {
        'indent': [
            'error',
            2
        ],
        'linebreak-style': [
            'error',
            'unix'
        ],
        'quotes': [
            'error',
            'single'
        ],
        'semi': [
            'error',
            'always'
        ]
    }
};