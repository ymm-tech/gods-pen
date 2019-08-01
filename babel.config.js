module.exports = {
  comments: true,
  presets: [
    ['@vue/app', {useBuiltIns: false}]
  ],
  plugins: [
    [
      'import', {
        libraryName: "mint-ui",
        style: (name) => `${name}/style.css`,
      }
    ]
  ],
}
