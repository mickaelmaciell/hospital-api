export default {
  env: {
    node: true, // reconhece variáveis globais do Node (process, __dirname, etc.)
    es2022: true, // habilita sintaxe moderna do ECMAScript
  },
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module", // garante suporte a import/export
  },
  rules: {
    // você pode ajustar regras aqui conforme preferir
    "no-unused-vars": "warn",
    "no-undef": "off", // desliga falso positivo do "process is not defined"
  },
};
