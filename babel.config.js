module.exports = function (api) {
  api.cache(true); // Recommended for performance
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      'react-native-reanimated/plugin', // Keep this plugin
      [
        'module:react-native-dotenv', // Add this plugin
        {
          moduleName: '@env', // The module name to import from
          path: '.env', // The path to your .env file
          safe: false, // Set to true to fail on missing env variables
          allowUndefined: true, // Allow undefined variables
        },
      ],
    ],
  };
};