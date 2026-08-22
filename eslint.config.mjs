import nextVitals from "eslint-config-next/core-web-vitals";

const config = [
  ...nextVitals,
  {
    ignores: [".next/**", "coverage/**", "out/**", "node_modules/**"],
    rules: {
      // This app remains on React 18. Keep the stable Next.js hooks rules,
      // but defer React Compiler-only diagnostics until a React 19 migration.
      "react-hooks/immutability": "off",
      "react-hooks/purity": "off",
      "react-hooks/refs": "off",
      "react-hooks/set-state-in-effect": "off",
      "react-hooks/use-memo": "off",
    },
  },
];

export default config;
