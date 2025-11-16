module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: ["eslint:recommended", "plugin:@typescript-eslint/recommended"],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
    project: "./tsconfig.json",
    tsconfigRootDir: __dirname,
  },
  ignorePatterns: [
    ".eslintrc.cjs",
    "seed-companies.js",
    "seed-companies.ts",
    "seed-alumni.ts",
  ],
  plugins: ["@typescript-eslint", "no-relative-import-paths"],
  rules: {
    "default-case": "off",
    "no-plusplus": "off",
    "no-continue": "off",
    "prefer-template": "off",
    "prefer-destructuring": "off",
    "class-methods-use-this": "off",

    // Allow leading underscores in identifiers (e.g. _id in MongoDB).
    "no-underscore-dangle": "off",

    // Some APIs use snake_case identifiers.
    camelcase: "off",

    // Depending on the context, using bracket notation might be clearer.
    "dot-notation": "off",

    /**
     * Reassigning parameters can be useful to avoid creating another variable,
     * and to modify objects by reference.
     */
    "no-param-reassign": "off",

    /**
     * Unused variables and arguments should be removed in most cases, but it's
     * convenient to allow them when the code is still being implemented.
     *
     * Prefix variable names with an underscore to suppress the warning.
     */
    "no-unused-vars": [
      "warn",
      {
        argsIgnorePattern: "^_",
        varsIgnorePattern: "^_",
      },
    ],

    "@typescript-eslint/no-unused-vars": "off",

    // Not necessary for some APIs (consistency reasons)
    "import/prefer-default-export": "off",

    // Stylistic rules.
    "lines-between-class-members": "off",

    // "no-relative-import-paths/no-relative-import-paths": [
    //   "warn",
    //   { allowSameFolder: false, rootDir: "backend" },
    // ],
    "no-relative-import-paths/no-relative-import-paths": "off",
  },
  overrides: [
    {
      files: ["index.ts"],
      rules: {
        "@typescript-eslint/ban-ts-comment": "off",
      },
    },
  ],
};
