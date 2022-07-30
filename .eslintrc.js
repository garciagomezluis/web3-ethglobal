module.exports = {
    extends: ['@luchio/eslint-config-vra-ts'],
    overrides: [
        {
            files: ['*.ts', '*.tsx', '*.js', '*.jsx'],
            rules: {
                'import/extensions': 'off',
            },
        },
        {
            files: ['*.test.tsx', '**/test/setup.ts', '**/test/utils.ts'],
            rules: {
                'import/no-extraneous-dependencies': 'off',
            },
        },
    ],
};
