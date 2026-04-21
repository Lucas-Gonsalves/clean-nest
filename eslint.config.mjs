// @ts-check
import eslint from '@eslint/js';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';
import simpleImportSort from 'eslint-plugin-simple-import-sort'
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  {
    ignores: ['eslint.config.mjs'],
  },
  eslint.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked,
  eslintPluginPrettierRecommended,
  {
    plugins:  {
      'simple-import-sort': simpleImportSort,
    },
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.jest,
      },
      sourceType: 'commonjs',
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
  {
    rules: {
      semi: ['warn', 'never'], // Disallow semicolons at the end of statements
      quotes: ['warn', 'single'], // Enforce the use of single quotes for strings
      indent: ['warn', 2], // Enforce consistent indentation of 2 spaces
      'comma-dangle': ['warn', 'always-multiline'], // Require trailing commas in multiline objects, arrays, etc.
      'object-curly-spacing': ['warn', 'always'], // Require spaces inside curly braces (e.g., { foo: 'bar' })
      'arrow-parens': ['warn', 'always'], // Require parentheses around arrow function parameters
      'jsx-quotes': ['warn', 'prefer-double'], // Enforce double quotes in JSX attributes
      'simple-import-sort/imports': 'warn', // turn import sort to warn
      'no-unused-vars': 'off', // desable error of no used variables
      'simple-import-sort/exports': 'warn', // turn export sort to warn

      '@typescript-eslint/no-unused-vars': [ // set a role to ignores the no used vars in case of first letter '_'
        'warn',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
        },
      ],
      '@typescript-eslint/no-empty-object-type': [
        'warn',
        {
          allowInterfaces: 'always',
          allowObjectTypes: 'always',
        },
      ],
      '@typescript-eslint/no-unsafe-call': 'off',
      '@typescript-eslint/no-unsafe-assignment': 'off',
      '@typescript-eslint/no-unsafe-member-access': 'off',
      
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-floating-promises': 'warn',
      "prettier/prettier": ["warn", { endOfLine: "auto" }],
    },
  },
);
