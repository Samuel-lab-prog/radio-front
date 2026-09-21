module.exports = {
  rootDirectories: ['app', 'core', 'features'],
  rootFiles: ['main.tsx', 'vite-env.d.ts'],
  featureDirectories: ['internal', 'public', 'use-cases'],
  localDirectories: [
    'components',
    'hooks',
    'utils',
    'schemas',
    'mappers',
    'fixtures',
  ],
  featureName: /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
  roles: ['admin', 'listener'],
};
