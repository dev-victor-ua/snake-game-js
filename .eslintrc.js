module.exports = {
    "rules": {
      "no-unused-vars": 1
    },
    "env": {
        "es6": true,
        "browser": true
    },
    "parserOptions": {
        "ecmaVersion": 2018,
        "sourceType": "module"
    },
    "extends": [
        "eslint:recommended",
        "plugin:prettier/recommended"
    ],
    "globals": {
        "Atomics": "readonly",
        "SharedArrayBuffer": "readonly"
    }
}
