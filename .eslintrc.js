module.exports = {
  env: {
    browser: true,
    es2020: true,
    node: true,
  },
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 11,
    sourceType: "module",
  },
  plugins: ["react-hooks", "react", "@typescript-eslint"],
  settings: {
    react: {
      version: "detect",
    },
  },
  rules: {
    "react/prop-types": "off",
    "react-hooks/exhaustive-deps": "off",
  },
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/eslint-recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:react/recommended",
    "plugin:react-hooks/recommended",
    "prettier",
  ],
  overrides: [
    {
      files: ["**/*.ts", "**/*.tsx"],
      extends: [
        "plugin:@typescript-eslint/eslint-recommended",
        "plugin:@typescript-eslint/recommended",
      ],
      plugins: ["@typescript-eslint"],
      rules: {
        "@typescript-eslint/no-explicit-any": "error",
        "@typescript-eslint/no-unused-vars": [
          "error",
          { ignoreRestSiblings: true },
        ],
      },
    },
  ],
};
