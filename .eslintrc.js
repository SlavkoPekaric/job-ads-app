module.exports = {
  "root": true,
  "parser": "@typescript-eslint/parser",
  "parserOptions": {
    "project": ["tsconfig.json"],
    "createDefaultProgram": true
  },
  "plugins": [
    "@typescript-eslint",
    "@angular-eslint"
  ],
  "extends": [
    "plugin:@angular-eslint/recommended",
    "plugin:@typescript-eslint/recommended"
  ],
  "rules": {
    "@typescript-eslint/no-explicit-any": "off",
    "@typescript-eslint/no-unused-vars": "warn",
    "@typescript-eslint/explicit-function-return-type": "off"
  },
  "overrides": [
    {
      "files": ["*.ts"],
      "rules": {
        "@typescript-eslint/no-var-requires": "off"
      }
    },
    {
      "files": ["*.html"],
      "extends": ["plugin:@angular-eslint/template/recommended"],
      "rules": {
        "@angular-eslint/template/no-negated-async": "error"
      }
    }
  ]
}
