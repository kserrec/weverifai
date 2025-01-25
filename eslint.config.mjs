import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";
import typescript from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    ignores: [
      ".next/**/*",
      "node_modules/**/*",
      "build/**/*",
      "dist/**/*",
      "out/**/*",
      "coverage/**/*",
      "public/**/*",
      "**/*.js.map"
    ]
  },
  {
    files: ["**/*.ts", "**/*.tsx"],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        project: "./tsconfig.json"
      }
    },
    plugins: {
      typescript
    },
    rules: 
    { ...typescript.configs["recommended"].rules,
      // Error Prevention
    "@typescript-eslint/no-explicit-any": "error",
    "@typescript-eslint/no-unused-vars": ["error", { "argsIgnorePattern": "^_" }],
    "@typescript-eslint/explicit-function-return-type": "error",
    "@typescript-eslint/no-floating-promises": "error",
    
    // Code Style
    "@typescript-eslint/consistent-type-imports": "error",
    
    // React Best Practices
    "react-hooks/rules-of-hooks": "error",
    "react-hooks/exhaustive-deps": "warn",
    "react/no-unused-prop-types": "error",
    
    // Performance
    "react/jsx-no-constructed-context-values": "error",
    
    // Security
    "react/no-danger": "error"
    }
  }
];

export default eslintConfig;