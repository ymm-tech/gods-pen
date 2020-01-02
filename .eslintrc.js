module.exports = {
  root: true,
  parserOptions: {
    parser: "babel-eslint",
    sourceType: 'module',
    allowImportExportEverywhere: true
  },
  env: {
    browser: true,
    node: true
  },
  extends: [
    'plugin:vue/essential',
    'standard'
  ],
  plugins: [
    'vue'
  ],
  'rules': {
    "eol-last": 0,
    "vue/no-async-in-computed-properties": 0,
    "vue/no-side-effects-in-computed-properties": 0,
    "vue/no-side-effects-in-computed-properties": 0,
    "vue/valid-v-for": 0,
    "no-multiple-empty-lines": 0,
    "space-before-function-paren": 0,
    "no-return-await": 0,
    "vue/no-unused-vars": 0,
    "object-curly-spacing": 0,
    "no-proto": 0,
    "no-new": 0,
    "no-extra-boolean-cast": 0,
    "no-mixed-operators": 0,
    "no-eval": 0,
    // allow paren-less arrow functions
    'arrow-parens': 0,
    'no-useless-escape': 0,
    'no-sparse-arrays': 0,
    // no-fallthrough
    'no-fallthrough': 0,
    // allow debugger during development
    'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 0,
    "eqeqeq": 0, //必须使用全等
    "no-extend-native": 0,
    "no-multi-spaces": 0,
    "indent": 0,
    "comma-dangle": [2, "only-multiline"] //定义数组或对象最后多余的逗号
  }
}