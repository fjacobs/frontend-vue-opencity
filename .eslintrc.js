module.exports = {
  root: true,
  env: {
    node: true
  },
  extends: [
    "standard",
    "plugin:vue/recommended",
    "plugin:vue/essential",
    "@vue/prettier",
    "@vue/cli-plugin-babel"
  ],
  rules: {
    "no-console": process.env.NODE_ENV === "production" ? "error" : "off",
    "no-debugger": process.env.NODE_ENV === "production" ? "error" : "off"
  },
  parserOptions: {
    parser: "babel-eslint"
  }
};
