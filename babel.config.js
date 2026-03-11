module.exports = (api) => {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      [
        'module-resolver',
        {
          root: ['./src'],
          alias: {
            '@components': './src/components',
            '@screens': './src/screens',
            '@db': './src/db',
            '@theme': './src/theme',
            '@services': './src/services',
            '@utils': './src/utils',
            '@hooks': './src/hooks',
            '@constants': './src/constants',
            '@providers': './src/providers',
            '@navigation': './src/navigation',
          },
        },
      ],
      'react-native-reanimated/plugin',
    ],
  };
};
