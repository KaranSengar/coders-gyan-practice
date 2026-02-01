import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";

export default [
  /* ===============================
     1️⃣ GLOBAL IGNORE (AUTO FILES)
     =============================== */
  {
    ignores: [
      "node_modules/**",
      "dist/**",
      "build/**",
      "coverage/**",
      "*.config.*",
      "*.d.ts",
    ],
  },

  /* ===============================
     2️⃣ BASE ESLINT (JS RULES)
     =============================== */
  js.configs.recommended,

  /* ===============================
     3️⃣ TYPESCRIPT BASE
     =============================== */
  ...tseslint.configs.recommended,

  /* ===============================
     4️⃣ PROJECT CODE (SRC)
     =============================== */
  {
    files: ["src/**/*.{ts,tsx}"],

    /* 🌍 LANGUAGE ENV */
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",

      globals: {
        ...globals.node,
        ...globals.browser,
      },

      /* 🧠 TYPE-AWARE POWER */
      parserOptions: {
        project: "./tsconfig.json",
        tsconfigRootDir: import.meta.dirname,
      },
    },

    /* 🔌 PLUGINS */
    plugins: {
      "@typescript-eslint": tseslint.plugin,
    },

    /* ⚙️ ESLINT ENGINE BEHAVIOUR */
    linterOptions: {
      reportUnusedDisableDirectives: true,
    },

    /* 🚨 ENTERPRISE RULES */
    rules: {
      /* ---------- Type Safety ---------- */
      "@typescript-eslint/no-explicit-any": "error",
      "@typescript-eslint/no-unused-vars": [
        "error",
        { argsIgnorePattern: "^_" },
      ],

      /* ---------- Promise Safety ---------- */
      "@typescript-eslint/no-floating-promises": "error",
      "@typescript-eslint/no-misused-promises": "error",

      /* ---------- Code Quality ---------- */
      eqeqeq: ["error", "always"],
      "no-console": "off",
      "no-debugger": "error",
      "prefer-const": "error",

      /* ---------- Clean Code ---------- */
      "no-unused-expressions": "error",
      "no-implicit-coercion": "error",
    },

    /* 🧩 FRAMEWORK AWARENESS */
    settings: {
      react: {
        version: "detect",
      },
    },
  },
];
