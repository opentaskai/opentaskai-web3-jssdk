module.exports = {
  env: {
    browser: true,
    es2021: true,
    mocha: true,
    node: true,
  },
  ignorePatterns: ["lib"],
  plugins: ["@typescript-eslint", "import"],
  extends: [
    "standard",
    "plugin:prettier/recommended",
    "eslint:recommended",
    "plugin:import/typescript",
  ],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: 12,
  },

  rules: {
    "prettier/prettier": ["error", { printWidth: "off" }],
    "max-len": "off",
    "n/no-unsupported-features/es-syntax": ["error", { ignores: ["modules"] }],
    "no-unused-expressions": "off",
    "no-unused-vars": "off",
    "@typescript-eslint/no-unused-vars": [
      "warn",
      { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
    ],
    "object-shorthand": ["error", "always"],
  },
};
