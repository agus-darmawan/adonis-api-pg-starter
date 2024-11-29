export const configExtends = ['@commitlint/config-conventional'];
export const rules = {
  //   TODO Add Scope Enum Here
  // 'scope-enum': [2, 'always', ['yourscope', 'yourscope']],
  'type-enum': [
    2,
    'always',
    [
      'feat',
      'fix',
      'docs',
      'delate',
      'chore',
      'refactor',
      'ci',
    ],
  ],
};
