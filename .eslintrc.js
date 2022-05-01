// Severity codes: 0 = off, 1 = warn, 2 = error

// See also https://dev.to/robertcoopercode/using-eslint-and-prettier-in-a-typescript-project-53jb !!!

module.exports = {
  env: {
    es2020: true,
    node: true,
    jest: true,
  },
  parser: '@typescript-eslint/parser', // Specifies the ESLint parser
  extends: [
    'plugin:@typescript-eslint/recommended',
    'plugin:import/recommended',
    'plugin:import/typescript',
    'plugin:prettier/recommended', // Enables eslint-plugin-prettier and displays prettier errors as ESLint errors. Make sure this is always the last configuration in the extends array.
  ],
  parserOptions: {
    ecmaVersion: 2021, // (aka 9) Allows for the parsing of modern ECMAScript features
    sourceType: 'module', // Allows for the use of imports
    // project: './tsconfig.json',
    tsconfigRootDir: './',
  },
  plugins: ['import', 'jsdoc', 'filenames', 'jest', 'jest-async'],
  rules: {
    'member-ordering': [
      0,
      {
        alphabetize: false,
        order: [
          'public-static-field',
          'public-instance-field',
          'public-constructor',
          'private-static-field',
          'private-instance-field',
          'private-constructor',
          'public-instance-method',
          'protected-instance-method',
          'private-instance-method',
        ],
      },
    ],
    '@typescript-eslint/ban-ts-comment': 'warn',
    '@typescript-eslint/naming-convention': [
      'error',
      {
        selector: 'interface',
        format: ['PascalCase'],
        custom: {
          regex: '^I[A-Z]',
          match: true,
        },
      },
    ],
    '@typescript-eslint/no-unused-vars': ['error'],
    /*
     * NOTE: you must disable the base rule as it can report incorrect errors!
     * See: https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/no-unused-vars.md
     */
    'no-unused-vars': 'off',
    'arrow-body-style': 'off',
    'implicit-arrow-linebreak': 'off',
    'class-methods-use-this': [
      'error',
      {
        exceptMethods: [],
      },
    ],
    'comma-dangle': [
      'error',
      {
        arrays: 'only-multiline',
        objects: 'only-multiline',
        imports: 'only-multiline',
        exports: 'only-multiline',
        functions: 'ignore',
      },
    ],
    'consistent-return': 'error',
    /* Matches UpperCamelCase or lowerCamelCase + *.test.js or *.spec.js or *.stories.js or *.style.js or *.config.js files only! */
    'filenames/match-regex': [
      'error',
      '^([a-z0-9]*|[a-z.]+)((-|.)[a-z0-9]*)*(.test|.spec|.stories|.shape|.controller|.view|.style|-staged.config|.config|jestrc.js)?$',
    ],
    'function-paren-newline': 'off', //['error', 'multiline'],
    // 'import/no-amd': 'error',
    'import/no-cycle': 'warn',
    'import/no-extraneous-dependencies': ['off', { devDependencies: ['**/*.stories.js'] }],
    'import/prefer-default-export': 'off',
    'jest/no-disabled-tests': 'warn',
    'jest/no-focused-tests': 'warn',
    'jest/no-identical-title': 'error',
    'jest/valid-expect': 'error',
    'jest-async/expect-return': 'error',
    'jsdoc/check-access': 'warn',
    'jsdoc/check-alignment': 'warn',
    //'jsdoc/check-examples': 'warn',
    'jsdoc/check-indentation': 'warn',
    'jsdoc/check-line-alignment': 'warn',
    'jsdoc/check-param-names': 'warn',
    'jsdoc/check-property-names': 'warn',
    'jsdoc/check-syntax': 'warn',
    'jsdoc/check-tag-names': 'warn',
    'jsdoc/check-types': 'warn',
    'jsdoc/check-values': 'warn',
    'jsdoc/empty-tags': 'warn',
    'jsdoc/implements-on-classes': 'warn',
    'jsdoc/match-description': 'warn',
    'jsdoc/newline-after-description': 'warn',
    'jsdoc/no-bad-blocks': 'warn',
    // 'jsdoc/no-defaults': 'warn',
    'jsdoc/no-types': 'warn',
    'jsdoc/no-undefined-types': 'warn',
    'jsdoc/require-description': 'warn',
    // 'jsdoc/require-description-complete-sentence': 'warn',
    // 'jsdoc/require-example': 'warn',
    // 'jsdoc/require-file-overview': 'warn',
    'jsdoc/require-hyphen-before-param-description': 'warn',
    'jsdoc/require-jsdoc': 'warn',
    'jsdoc/require-param': 'warn',
    'jsdoc/require-param-description': 'warn',
    'jsdoc/require-param-name': 'warn',
    // 'jsdoc/require-param-type': 'warn',
    'jsdoc/require-property': 'warn',
    'jsdoc/require-property-description': 'warn',
    'jsdoc/require-property-name': 'warn',
    // 'jsdoc/require-property-type': 'warn',
    'jsdoc/require-returns': 'warn',
    'jsdoc/require-returns-check': 'warn',
    'jsdoc/require-returns-description': 'warn',
    // 'jsdoc/require-returns-type': 'warn',
    'jsdoc/valid-types': 'warn',
    'max-len': [
      'error',
      140,
      4,
      {
        ignoreUrls: true,
        ignoreStrings: true,
        ignoreRegExpLiterals: true,
        ignoreTemplateLiterals: true,
        ignoreComments: true,
      },
    ],
    'no-case-declarations': 'error',
    'no-console': 'off',
    'no-param-reassign': ['error', { props: false }],
    'no-plusplus': 'off', // ['error', { allowForLoopAfterthoughts: true }],
    'prefer-template': 'error',
    'no-use-before-define': [
      'error',
      {
        functions: false,
        classes: true,
      },
    ],
    'operator-linebreak': ['error', 'after', { overrides: { '?': 'before', ':': 'before' } }],
    'require-jsdoc': [
      'warn',
      {
        require: {
          FunctionDeclaration: true,
          MethodDefinition: true,
          ClassDeclaration: true,
        },
      },
    ],
    strict: ['error', 'never'],
  },
  settings: {
    'import/core-modules': ['aws-lambda'],
    // jsdoc: {
    //   additionalTagNames: {
    //     customTags: ['resolve', 'reject'] // TODO any more wanted here?
    //   },
    // }
  },
};
